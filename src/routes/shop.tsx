import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { z } from "zod";
import { AppShell } from "@/components/layout/AppShell";
import { ProductCard } from "@/components/store/ProductCard";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/products";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  component: Shop,
  head: () => ({
    meta: [
      { title: "Shop — StitchNaija" },
      { name: "description", content: "Browse fabrics, ready-to-wear and accessories for your clients." },
    ],
  }),
});

function Shop() {
  const { category, q } = Route.useSearch();
  const [selectedCat, setSelectedCat] = useState<Category | "All">(
    (category as Category) || "All",
  );
  const [query, setQuery] = useState(q || "");
  const [sort, setSort] = useState<"featured" | "priceAsc" | "priceDesc" | "rating">("featured");
  const [priceMax, setPriceMax] = useState(200000);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let out = PRODUCTS.filter((p) => (selectedCat === "All" ? true : p.category === selectedCat));
    if (query.trim()) {
      const t = query.toLowerCase();
      out = out.filter(
        (p) =>
          p.name.toLowerCase().includes(t) ||
          p.brand.toLowerCase().includes(t) ||
          p.tags.some((tg) => tg.includes(t)),
      );
    }
    out = out.filter((p) => p.price <= priceMax);
    switch (sort) {
      case "priceAsc":
        out = [...out].sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        out = [...out].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        out = [...out].sort((a, b) => b.rating - a.rating);
        break;
    }
    return out;
  }, [selectedCat, query, priceMax, sort]);

  const grouped = useMemo(() => {
    if (selectedCat !== "All") return null;
    return CATEGORIES.map((c) => ({
      category: c,
      items: filtered.filter((p) => p.category === c),
    })).filter((g) => g.items.length > 0);
  }, [filtered, selectedCat]);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-black md:text-4xl">Shop</h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} pieces · updated daily
            </p>
          </div>
          <div className="flex flex-1 gap-2 sm:max-w-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search kaftans, sizes, brands…"
              className="flex-1 rounded-full border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium md:hidden"
              aria-label="Filters"
            >
              <SlidersHorizontal className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {(["All", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition",
                selectedCat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
          <aside
            className={cn(
              "space-y-6 rounded-2xl border border-border bg-card p-4 md:block",
              showFilters ? "block" : "hidden",
            )}
          >
            <FilterGroup title="Sort">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="featured">Featured</option>
                <option value="priceAsc">Price: low to high</option>
                <option value="priceDesc">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </FilterGroup>
            <FilterGroup title={`Max price · ₦${priceMax.toLocaleString("en-NG")}`}>
              <input
                type="range"
                min={5000}
                max={200000}
                step={5000}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </FilterGroup>
            <FilterGroup title="Body type">
              {["Slim", "Athletic", "Curvy", "Plus"].map((b) => (
                <label key={b} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="accent-primary" /> {b}
                </label>
              ))}
            </FilterGroup>
            <FilterGroup title="Occasion">
              {["Owambe", "Wedding", "Casual", "Work", "Loungewear"].map((o) => (
                <label key={o} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="accent-primary" /> {o}
                </label>
              ))}
            </FilterGroup>
            <button
              onClick={() => {
                setSelectedCat("All");
                setQuery("");
                setPriceMax(200000);
                setSort("featured");
              }}
              className="w-full rounded-full border border-border py-2 text-sm font-medium hover:bg-muted"
            >
              Reset filters
            </button>
          </aside>

          <div>
            {filtered.length === 0 ? (
              <div className="grid place-items-center rounded-2xl border border-dashed border-border py-20 text-center">
                <Filter className="size-8 text-muted-foreground" />
                <p className="mt-3 font-semibold">No matches</p>
                <p className="text-sm text-muted-foreground">Try widening your filters.</p>
              </div>
            ) : (
              grouped ? (
                <div className="space-y-10">
                  {grouped.map((g) => (
                    <section key={g.category} aria-labelledby={`cat-${g.category}`}>
                      <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-border pb-2">
                        <h2
                          id={`cat-${g.category}`}
                          className="font-display text-xl font-black md:text-2xl"
                        >
                          {g.category}
                        </h2>
                        <button
                          onClick={() => setSelectedCat(g.category)}
                          className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
                        >
                          {g.items.length} items · view all
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {g.items.map((p) => (
                          <ProductCard key={p.id} product={p} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              )
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="grid gap-2">{children}</div>
    </div>
  );
}

// keep import of X used elsewhere reachable
void X;