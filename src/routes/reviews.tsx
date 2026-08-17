import { createFileRoute } from "@tanstack/react-router";
import { Copy, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState, Field, inputCls, PageHeader } from "@/components/studio/Bits";
import { addReview, prettyDate, removeReview, useStudio } from "@/lib/studio";

export const Route = createFileRoute("/reviews")({
  component: Reviews,
  head: () => ({
    meta: [
      { title: "Client reviews — StitchNaija" },
      {
        name: "description",
        content:
          "Collect and showcase client reviews for your tailoring studio, and request new ones over WhatsApp.",
      },
      { property: "og:title", content: "Client reviews — StitchNaija" },
      { property: "og:description", content: "Turn happy clients into proof that wins new ones." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Reviews() {
  const { data } = useStudio();
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const avg = data.reviews.length
    ? data.reviews.reduce((n, r) => n + r.rating, 0) / data.reviews.length
    : 0;

  const requestText = `Hi! Thank you for trusting ${data.profile.studioName} with your outfit. Could you drop a short review of your experience? It helps my studio a lot. 🙏`;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <PageHeader
          eyebrow="Social proof"
          title="Client reviews"
          subtitle={
            data.reviews.length
              ? `${avg.toFixed(1)} average from ${data.reviews.length} reviews`
              : "No reviews yet — ask your last happy client."
          }
          action={
            <button
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-full gradient-emerald px-4 py-2.5 text-sm font-bold text-primary-foreground"
            >
              <Plus className="size-4" /> Add review
            </button>
          }
        />

        <button
          onClick={() => {
            void navigator.clipboard?.writeText(requestText);
            toast.success("Review request copied — paste it into WhatsApp.");
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-emerald"
        >
          <Copy className="size-4" /> Copy review request
        </button>

        {open ? (
          <form
            className="mt-6 grid gap-4 rounded-2xl border border-border bg-card p-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!clientName.trim() || !text.trim()) return;
              addReview({ clientName: clientName.trim(), rating, text: text.trim() });
              setClientName("");
              setText("");
              setRating(5);
              setOpen(false);
            }}
          >
            <Field label="Client name">
              <input
                className={inputCls}
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Amaka Okafor"
              />
            </Field>
            <Field label="Rating">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} stars`}
                    onClick={() => setRating(n)}
                    className="p-1"
                  >
                    <Star
                      className={
                        n <= rating ? "size-6 fill-gold text-gold" : "size-6 text-muted-foreground"
                      }
                    />
                  </button>
                ))}
              </div>
            </Field>
            <Field label="What they said">
              <textarea
                className={`${inputCls} min-h-24`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="The gown fit perfectly and arrived early..."
              />
            </Field>
            <button className="justify-self-start rounded-full gradient-emerald px-5 py-2.5 text-sm font-bold text-primary-foreground">
              Save review
            </button>
          </form>
        ) : null}

        <div className="mt-8 space-y-3">
          {data.reviews.length === 0 ? (
            <EmptyState title="No reviews yet" hint="Add your first review to build trust." />
          ) : null}
          {data.reviews.map((r) => (
            <article key={r.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{r.clientName}</p>
                  <div className="mt-1 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < r.rating ? "size-4 fill-gold text-gold" : "size-4 text-muted-foreground"
                        }
                      />
                    ))}
                    <span className="ml-2 text-xs text-muted-foreground">{prettyDate(r.at)}</span>
                  </div>
                </div>
                <button
                  aria-label="Delete review"
                  onClick={() => removeReview(r.id)}
                  className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}