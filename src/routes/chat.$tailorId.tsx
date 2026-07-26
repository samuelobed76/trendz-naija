import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Crown, MapPin, Send, Star, MessageCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { QUICK_PROMPTS, getTailor, startConversation, useChat } from "@/lib/chat";
import { usePremium } from "@/lib/premium";

export const Route = createFileRoute("/chat/$tailorId")({
  component: ChatThread,
  loader: ({ params }) => {
    const tailor = getTailor(params.tailorId);
    if (!tailor) throw notFound();
    return { tailor };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Chat with ${loaderData?.tailor.name ?? "your tailor"} — StyleNaija` },
      {
        name: "description",
        content: `Message ${loaderData?.tailor.name ?? "a designer"} in ${loaderData?.tailor.city ?? "Nigeria"} about ${loaderData?.tailor.specialty ?? "bespoke fashion"} — prices, measurements and delivery.`,
      },
      {
        property: "og:title",
        content: `Chat with ${loaderData?.tailor.name ?? "your tailor"} — StyleNaija`,
      },
      {
        property: "og:description",
        content: `Bespoke ${loaderData?.tailor.specialty ?? "fashion"} from ${loaderData?.tailor.city ?? "Nigeria"}, direct in the app.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ChatThread() {
  const { tailor } = Route.useLoaderData();
  const { membership } = usePremium();
  const { convo, typing, send } = useChat(tailor.id, membership.active);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startConversation(tailor.id);
  }, [tailor.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convo.messages.length, typing]);

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    send(text);
    setText("");
  };

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col px-4 py-4">
        {/* Header */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <Link to="/chat" aria-label="Back to messages" className="rounded-full p-1.5 hover:bg-muted">
            <ArrowLeft className="size-5" />
          </Link>
          <img
            src={tailor.image}
            alt={tailor.name}
            className="size-11 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-black leading-tight">{tailor.name}</p>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Star className="size-3 fill-current text-accent-foreground" /> {tailor.rating}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" /> {tailor.city}
              </span>
            </p>
          </div>
          <a
            href={`https://wa.me/${tailor.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Continue on WhatsApp"
            className="rounded-full border border-border p-2 hover:bg-muted"
          >
            <MessageCircle className="size-4" />
          </a>
        </div>

        {membership.active ? (
          <p className="mt-2 inline-flex items-center gap-1.5 self-start rounded-full bg-accent/50 px-3 py-1 text-xs font-semibold text-accent-foreground">
            <Crown className="size-3.5" /> Prime priority — replies come first
          </p>
        ) : (
          <Link
            to="/premium"
            className="mt-2 inline-flex items-center gap-1.5 self-start rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/60 hover:text-foreground"
          >
            <Crown className="size-3.5" /> Go Prime for priority replies
          </Link>
        )}

        {/* Messages */}
        <div className="mt-3 min-h-[45vh] space-y-3 rounded-2xl bg-muted/40 p-3">
          {convo.messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                  m.from === "me"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm border border-border bg-card text-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
                <p
                  className={`mt-1 text-[10px] ${
                    m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {new Date(m.at).toLocaleTimeString("en-NG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-sm border border-border bg-card px-3.5 py-2.5">
                <span className="flex gap-1">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick prompts */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary/60"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Composer */}
        <form onSubmit={onSend} className="sticky bottom-20 mt-3 flex gap-2 md:bottom-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={800}
            placeholder={`Message ${tailor.name.split(" ")[0]}…`}
            aria-label="Message"
            className="flex-1 rounded-full border border-input bg-background px-4 py-3 text-sm shadow-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            aria-label="Send message"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
          >
            <Send className="size-5" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}