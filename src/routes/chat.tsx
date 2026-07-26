import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessagesSquare, ChevronRight, Crown } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { loadConversations, type Conversation } from "@/lib/chat";
import type { Tailor } from "@/lib/tailors";
import { usePremium } from "@/lib/premium";

export const Route = createFileRoute("/chat")({
  component: ChatLayout,
  head: () => ({
    meta: [
      { title: "Chat with tailors — StyleNaija" },
      {
        name: "description",
        content:
          "Message Nigerian tailors and fashion designers directly in StyleNaija — share styles, agree prices and track your bespoke pieces.",
      },
      { property: "og:title", content: "Chat with tailors — StyleNaija" },
      {
        property: "og:description",
        content: "Direct in-app messaging between customers and vetted Nigerian designers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function ChatLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path !== "/chat") return <Outlet />;
  return <ChatList />;
}

function ChatList() {
  const [convos, setConvos] = useState<(Conversation & { tailor: Tailor | undefined })[]>([]);
  const { membership } = usePremium();

  useEffect(() => {
    const sync = () => setConvos(loadConversations());
    sync();
    window.addEventListener("stylenaija:chats", sync);
    return () => window.removeEventListener("stylenaija:chats", sync);
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-black md:text-4xl">Messages</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Talk directly with your tailors and designers.
            </p>
          </div>
          {membership.active && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/50 px-3 py-1 text-xs font-semibold text-accent-foreground">
              <Crown className="size-3.5" /> Priority
            </span>
          )}
        </div>

        {convos.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <MessagesSquare className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-4 font-display text-xl font-black">No chats yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Find a designer near you and start a conversation.
            </p>
            <Link
              to="/tailors"
              className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Browse tailors
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {convos.map((c) => {
              const last = c.messages[c.messages.length - 1];
              return (
                <li key={c.tailorId}>
                  <Link
                    to="/chat/$tailorId"
                    params={{ tailorId: c.tailorId }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition hover:border-primary/60 hover:shadow-sm"
                  >
                    <img
                      src={c.tailor?.image}
                      alt={c.tailor?.name ?? "Tailor"}
                      loading="lazy"
                      className="size-12 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{c.tailor?.name ?? "Designer"}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {last ? (last.from === "me" ? "You: " : "") + last.text : "Say hello"}
                      </p>
                    </div>
                    {c.unread > 0 && (
                      <span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {c.unread}
                      </span>
                    )}
                    <ChevronRight className="size-5 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}