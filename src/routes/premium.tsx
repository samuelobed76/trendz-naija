import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Crown, Sparkles, Truck, MessageCircle, Scissors } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { formatNaira } from "@/lib/products";
import { PLANS, PREMIUM_PERKS, usePremium, type PlanId } from "@/lib/premium";

export const Route = createFileRoute("/premium")({
  component: PremiumPage,
  head: () => ({
    meta: [
      { title: "StyleNaija Prime — Premium Fashion Membership" },
      {
        name: "description",
        content:
          "Join StyleNaija Prime for free nationwide delivery, priority tailor chat, early access to drops and free personal styling.",
      },
      { property: "og:title", content: "StyleNaija Prime — Premium Fashion Membership" },
      {
        property: "og:description",
        content:
          "Free delivery, priority tailor chat, early drops and monthly styling sessions from ₦4,500/month.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function PremiumPage() {
  const { membership, start, stop } = usePremium();
  const [selected, setSelected] = useState<PlanId>("yearly");

  const onSubscribe = () => {
    start(selected);
    toast.success("Welcome to Prime 👑", {
      description: "Your perks are active immediately.",
    });
  };

  return (
    <AppShell>
      <section className="gradient-warm text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Crown className="size-3.5" /> Membership
          </span>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-black leading-tight md:text-5xl">
            StyleNaija Prime
          </h1>
          <p className="mt-3 max-w-xl text-sm text-primary-foreground/90 md:text-base">
            Free delivery everywhere in Nigeria, tailors that reply you first, and first
            dibs on every owambe drop.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <span className="inline-flex items-center gap-2">
              <Truck className="size-4" /> Free delivery
            </span>
            <span className="inline-flex items-center gap-2">
              <MessageCircle className="size-4" /> Priority chat
            </span>
            <span className="inline-flex items-center gap-2">
              <Scissors className="size-4" /> Styling sessions
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {membership.active ? (
          <div className="rounded-3xl border border-primary/40 bg-card p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full gradient-warm text-primary-foreground">
                <Crown className="size-6" />
              </span>
              <div>
                <p className="font-display text-2xl font-black">You're a Prime member</p>
                <p className="text-sm text-muted-foreground">
                  {membership.plan === "yearly" ? "Yearly" : "Monthly"} plan · renews{" "}
                  {membership.renewsAt
                    ? new Date(membership.renewsAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/chat"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Chat a tailor now
              </Link>
              <button
                onClick={() => {
                  stop();
                  toast("Membership cancelled", { description: "You can rejoin anytime." });
                }}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                Cancel membership
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {PLANS.map((p) => {
              const active = selected === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`rounded-3xl border p-6 text-left transition ${
                    active
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-black">{p.name}</span>
                    {p.save && (
                      <span className="rounded-full bg-accent/50 px-2.5 py-0.5 text-[11px] font-semibold text-accent-foreground">
                        {p.save}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 font-display text-3xl font-black">
                    {formatNaira(p.price)}
                    <span className="text-base font-semibold text-muted-foreground">
                      {p.period}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{p.note}</p>
                </button>
              );
            })}
          </div>
        )}

        <h2 className="mt-12 font-display text-2xl font-black">What you get</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {PREMIUM_PERKS.map((perk) => (
            <li
              key={perk.title}
              className="flex gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-secondary/15 text-secondary">
                <Check className="size-4" />
              </span>
              <div>
                <p className="font-semibold">{perk.title}</p>
                <p className="text-sm text-muted-foreground">{perk.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        {!membership.active && (
          <div className="sticky bottom-20 mt-10 md:bottom-6">
            <button
              onClick={onSubscribe}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-display text-base font-black text-primary-foreground shadow-lg hover:bg-primary/90"
            >
              <Sparkles className="size-5" />
              Join Prime · {formatNaira(PLANS.find((p) => p.id === selected)!.price)}
              {PLANS.find((p) => p.id === selected)!.period}
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Prototype checkout — no real payment is taken.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}