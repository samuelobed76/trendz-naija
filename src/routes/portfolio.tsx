import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";

export const Route = createFileRoute("/portfolio")({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: "Portfolio — StitchNaija" },
      {
        name: "description",
        content: "Showcase your best work on StitchNaija. Build a portfolio that wins new clients.",
      },
      { property: "og:title", content: "Portfolio — StitchNaija" },
      { property: "og:description", content: "A curated lookbook of bespoke Nigerian fashion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const LOOKS = [
  { id: "l1", image: portfolio1, title: "Emerald Aso-Oke Gown", category: "Bridal", price: "₦96,000" },
  { id: "l2", image: portfolio2, title: "Charcoal Agbada Set", category: "Native", price: "₦145,000" },
  { id: "l3", image: portfolio3, title: "Ankara Couple Set", category: "Casual", price: "₦68,000" },
  { id: "l4", image: portfolio4, title: "Traditional Kids Wear", category: "Kids", price: "₦28,000" },
  { id: "l1", image: portfolio2, title: "Navy Two-Piece Suit", category: "Suits", price: "₦148,000" },
  { id: "l2", image: portfolio1, title: "Gold-Embroidered Kaftan", category: "Evening", price: "₦82,000" },
  { id: "l3", image: portfolio4, title: "Coral Beads & Wrapper", category: "Traditional", price: "₦74,000" },
  { id: "l4", image: portfolio3, title: "Printed Resort Set", category: "Casual", price: "₦45,000" },
];

const CATEGORIES = ["All", "Bridal", "Native", "Suits", "Casual", "Kids", "Traditional", "Evening"];

function Portfolio() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald">Lookbook</p>
            <h1 className="mt-1 font-display text-3xl font-black md:text-4xl">Portfolio</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Curate your best pieces so new clients know your craft.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-emerald/90 transition">
            <Plus className="size-4" /> Add look
          </button>
        </div>

        {/* Filters */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none md:mx-0 md:px-0">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                c === "All"
                  ? "border-emerald bg-emerald text-primary-foreground"
                  : "border-border bg-card hover:border-emerald/60"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {LOOKS.map((look, idx) => (
            <div
              key={`${look.id}-${idx}`}
              className="group relative overflow-hidden rounded-2xl bg-muted"
            >
              <img
                src={look.image}
                alt={look.title}
                loading="lazy"
                width={512}
                height={640}
                className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent opacity-90" />
              <div className="absolute bottom-4 left-4 right-4 text-background">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{look.category}</p>
                <p className="font-display text-lg font-black leading-tight">{look.title}</p>
                <p className="mt-1 text-sm opacity-90">{look.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state CTA */}
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <p className="font-display text-xl font-black">Build your lookbook</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Prime members get featured placement on the StitchNaija home page.
          </p>
          <Link
            to="/premium"
            className="mt-4 inline-flex items-center gap-1 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Learn about Prime <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
