import { useCallback, useEffect, useState } from "react";
import { TAILORS, type Tailor } from "./tailors";

export interface ChatMessage {
  id: string;
  from: "me" | "tailor";
  text: string;
  at: number;
}

export interface Conversation {
  tailorId: string;
  messages: ChatMessage[];
  updatedAt: number;
  unread: number;
}

const KEY = "stylenaija.chats.v1";
const EVT = "stylenaija:chats";

function readAll(): Record<string, Conversation> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, Conversation>) : {};
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, Conversation>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function getTailor(id: string): Tailor | undefined {
  return TAILORS.find((t) => t.id === id);
}

export function loadConversations(): (Conversation & { tailor: Tailor | undefined })[] {
  return Object.values(readAll())
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((c) => ({ ...c, tailor: getTailor(c.tailorId) }));
}

export function loadConversation(tailorId: string): Conversation {
  return (
    readAll()[tailorId] ?? { tailorId, messages: [], updatedAt: Date.now(), unread: 0 }
  );
}

function push(tailorId: string, msg: Omit<ChatMessage, "id" | "at">, unreadDelta: number) {
  const all = readAll();
  const convo = all[tailorId] ?? { tailorId, messages: [], updatedAt: Date.now(), unread: 0 };
  convo.messages = [
    ...convo.messages,
    { ...msg, id: Math.random().toString(36).slice(2), at: Date.now() },
  ];
  convo.updatedAt = Date.now();
  convo.unread = Math.max(0, convo.unread + unreadDelta);
  all[tailorId] = convo;
  writeAll(all);
  return convo;
}

export function markRead(tailorId: string) {
  const all = readAll();
  if (all[tailorId] && all[tailorId].unread !== 0) {
    all[tailorId] = { ...all[tailorId], unread: 0 };
    writeAll(all);
  }
}

export function deleteConversation(tailorId: string) {
  const all = readAll();
  delete all[tailorId];
  writeAll(all);
}

export function totalUnread(): number {
  return Object.values(readAll()).reduce((n, c) => n + c.unread, 0);
}

export const QUICK_PROMPTS = [
  "Hi! Can you sew an aso-ebi style for me?",
  "What's your price for a 2-piece agbada?",
  "How soon can you deliver? I need it in 2 weeks.",
  "Do you do home measurement in my area?",
];

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

export function useChat(tailorId: string, priority: boolean) {
  const [convo, setConvo] = useState<Conversation>({
    tailorId,
    messages: [],
    updatedAt: 0,
    unread: 0,
  });
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    setConvo(loadConversation(tailorId));
    markRead(tailorId);
  }, [tailorId]);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim().slice(0, 800);
      if (!trimmed) return;
      setConvo(push(tailorId, { from: "me", text: trimmed }, 0));
      setTyping(true);
      const delay = priority ? 700 : 1600;
      window.setTimeout(() => {
        const next = push(
          tailorId,
          { from: "tailor", text: reply(getTailor(tailorId), trimmed, priority) },
          0,
        );
        markRead(tailorId);
        setConvo({ ...next, unread: 0 });
        setTyping(false);
      }, delay);
    },
    [tailorId, priority],
  );

  return { convo, typing, send } as const;
}

export function startConversation(tailorId: string) {
  const all = readAll();
  if (!all[tailorId]) {
    const tailor = getTailor(tailorId);
    push(
      tailorId,
      {
        from: "tailor",
        text: `Hi 👋 You're chatting with ${tailor?.name ?? "our studio"} in ${tailor?.city ?? "Nigeria"}. Tell me what you'd like sewn and when you need it.`,
      },
      0,
    );
  }
}