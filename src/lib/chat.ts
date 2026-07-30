import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TAILORS, type Tailor } from "./tailors";
import { useAuth } from "./auth";

export interface ChatMessage {
  id: string;
  from: "me" | "tailor";
  text: string;
  at: number;
}

export interface ConversationSummary {
  id: string;
  tailorId: string;
  tailor: Tailor | undefined;
  unread: number;
  updatedAt: number;
  last: ChatMessage | null;
}

export function getTailor(id: string): Tailor | undefined {
  return TAILORS.find((t) => t.id === id);
}

export const QUICK_PROMPTS = [
  "Hi! Can you sew an aso-ebi style for me?",
  "What's your price for a 2-piece agbada?",
  "How soon can you deliver? I need it in 2 weeks.",
  "Do you do home measurement in my area?",
];

interface MessageRow {
  id: string;
  conversation_id: string;
  sender: string;
  body: string;
  created_at: string;
}

function toMessage(row: MessageRow): ChatMessage {
  return {
    id: row.id,
    from: row.sender === "tailor" ? "tailor" : "me",
    text: row.body,
    at: new Date(row.created_at).getTime(),
  };
}

/* ---------- notifications ---------- */

export async function requestChatNotifications(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  return (await Notification.requestPermission()) === "granted";
}

export function chatNotificationsEnabled(): boolean {
  return typeof window !== "undefined" && "Notification" in window
    ? Notification.permission === "granted"
    : false;
}

export function notifyNewMessage(tailorName: string, text: string) {
  if (!chatNotificationsEnabled()) return;
  try {
    new Notification(`New message from ${tailorName}`, {
      body: text.slice(0, 120),
      icon: "/favicon.ico",
      tag: "stylenaija-chat",
    });
  } catch {
    /* ignore */
  }
}

/* ---------- data access ---------- */

export async function ensureConversation(tailorId: string, userId: string): Promise<string> {
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_id", userId)
    .eq("tailor_id", tailorId)
    .maybeSingle();
  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId, tailor_id: tailorId })
    .select("id")
    .single();
  if (error) throw error;

  const tailor = getTailor(tailorId);
  await supabase.from("messages").insert({
    conversation_id: data.id,
    user_id: userId,
    sender: "tailor",
    body: `Hi 👋 You're chatting with ${tailor?.name ?? "our studio"} in ${tailor?.city ?? "Nigeria"}. Tell me what you'd like sewn and when you need it.`,
  });
  return data.id;
}

function reply(tailor: Tailor | undefined, text: string, priority: boolean): string {
  const t = text.toLowerCase();
  const name = tailor?.name ?? "the studio";
  const lead = priority ? "⚡ Prime member — replying first. " : "";
  if (/price|cost|how much|₦/.test(t))
    return `${lead}For that piece we start from ₦${(tailor?.priceFrom ?? 20000).toLocaleString()}, final price depends on fabric and detailing. Want me to send a full quote?`;
  if (/deliver|ready|when|days|week|urgent/.test(t))
    return `${lead}Our current turnaround is ${tailor?.turnaround ?? "10 days"}. If it's urgent we can rush it for a small express fee.`;
  if (/measure|size|fit|measurement/.test(t))
    return `${lead}You can send your measurements here, or we arrange a home measurement within ${tailor?.city ?? "your city"}. Which do you prefer?`;
  if (/fabric|ankara|lace|adire|material/.test(t))
    return `${lead}We can source the fabric for you or work with yours. I'll send you photos of what we have in store now.`;
  if (/hi|hello|good|hey/.test(t))
    return `${lead}Hello! Welcome to ${name} 👋 Tell me the style you have in mind and the date you need it.`;
  return `${lead}Noted! Let me check and get back to you shortly. Feel free to share a photo of the style you want.`;
}

/* ---------- hooks ---------- */

export function useConversations() {
  const { user } = useAuth();
  const [items, setItems] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("conversations")
      .select("id, tailor_id, unread, updated_at, messages(id, conversation_id, sender, body, created_at)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    setItems(
      (data ?? []).map((c) => {
        const msgs = ((c.messages ?? []) as MessageRow[])
          .slice()
          .sort((a, b) => a.created_at.localeCompare(b.created_at));
        const last = msgs.length ? toMessage(msgs[msgs.length - 1]) : null;
        return {
          id: c.id,
          tailorId: c.tailor_id,
          tailor: getTailor(c.tailor_id),
          unread: c.unread ?? 0,
          updatedAt: new Date(c.updated_at).getTime(),
          last,
        };
      }),
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    setLoading(true);
    load();
    if (!user) return;
    const channel = supabase
      .channel(`convos-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, load]);

  return { items, loading, reload: load } as const;
}

export function useUnreadCount() {
  const { items } = useConversations();
  return items.reduce((n, c) => n + c.unread, 0);
}

export function useChat(tailorId: string, priority: boolean) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [ready, setReady] = useState(false);
  const convoId = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    (async () => {
      if (!user) {
        setReady(false);
        setMessages([]);
        return;
      }
      const id = await ensureConversation(tailorId, user.id);
      if (!active) return;
      convoId.current = id;

      const { data } = await supabase
        .from("messages")
        .select("id, conversation_id, sender, body, created_at")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });
      if (!active) return;
      setMessages((data ?? []).map(toMessage));
      setReady(true);
      await supabase.from("conversations").update({ unread: 0 }).eq("id", id);

      channel = supabase
        .channel(`chat-${id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${id}`,
          },
          (payload) => {
            const msg = toMessage(payload.new as MessageRow);
            setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
            if (msg.from === "tailor") {
              notifyNewMessage(getTailor(tailorId)?.name ?? "Your tailor", msg.text);
            }
          },
        )
        .subscribe();
    })();

    return () => {
      active = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [tailorId, user]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim().slice(0, 800);
      if (!trimmed || !user || !convoId.current) return;
      const id = convoId.current;
      await supabase
        .from("messages")
        .insert({ conversation_id: id, user_id: user.id, sender: "me", body: trimmed });
      await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", id);

      setTyping(true);
      window.setTimeout(
        async () => {
          await supabase.from("messages").insert({
            conversation_id: id,
            user_id: user.id,
            sender: "tailor",
            body: reply(getTailor(tailorId), trimmed, priority),
          });
          await supabase
            .from("conversations")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", id);
          setTyping(false);
        },
        priority ? 700 : 1600,
      );
    },
    [tailorId, priority, user],
  );

  return { messages, typing, send, ready } as const;
}
