import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { MessagesSquare, ChevronRight, Crown } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useConversations } from "@/lib/chat";
import { usePremium } from "@/lib/premium";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/chat")({
  component: ChatLayout,
  head: () => ({
    meta: [
      { title: "Messages — StitchNaija" },
      {
        name: "description",
        content:
          "Message your clients directly in StitchNaija — confirm fittings, share updates and close orders faster.",
      },
      { property: "og:title", content: "Messages — StitchNaija" },
      {
        property: "og:description",
        content: "In-app messaging between tailors and their clients.",
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
  const { membership } = usePremium();
  const { user, loading: authLoading } = useAuth();
  const { items: convos, loading } = useConversations();

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-black md:text-4xl">Messages</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Talk directly with your clients.
            </p>
          </div>
          {membership.active && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-emerald">
              <Crown className="size-3.5" /> Priority
            </span>
          )}
        </div>

        {!authLoading && !user ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <MessagesSquare className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-4 font-display text-xl font-black">Sign in to see your messages</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your chats sync live across every device once you're signed in.
            </p>
            <Link
              to="/auth"
              className="mt-6 inline-flex rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Sign in / Create account
            </Link>
          </div>
        ) : loading ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">Loading your chats…</p>
        ) : convos.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <MessagesSquare className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-4 font-display text-xl font-black">No chats yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your client conversations will appear here.
            </p>
            <Link
              to="/clients"
              className="mt-6 inline-flex rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Browse clients
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {convos.map((c) => {
              const last = c.last;
              return (
                <li key={c.id}>
                  <Link
                    to="/chat/$tailorId"
                    params={{ tailorId: c.tailorId }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition hover:border-emerald/60 hover:shadow-sm"
                  >
                    <img
                      src={c.tailor?.image}
                      alt={c.tailor?.name ?? "Client"}
                      loading="lazy"
                      className="size-12 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{c.tailor?.name ?? "Client"}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {last ? (last.from === "me" ? "You: " : "") + last.text : "Say hello"}
                      </p>
                    </div>
                    {c.unread > 0 && (
                      <span className="grid size-5 place-items-center rounded-full bg-emerald text-[10px] font-bold text-primary-foreground">
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
