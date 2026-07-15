import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProductCard } from "@/components/store/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import heroImg from "@/assets/hero.jpg";
import lifestyle1 from "@/assets/lifestyle1.jpg";
import lifestyle2 from "@/assets/lifestyle2.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const trending = PRODUCTS.filter((p) => p.trending).slice(0, 8);
  const newArrivals = PRODUCTS.filter((p) => p.new).slice(0, 6);
  const sale = PRODUCTS.filter((p) => p.onSale).slice(0, 6);
  const bundle = [PRODUCTS[7], PRODUCTS[5], PRODUCTS[9]];

  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-2 md:gap-10 md:py-16">
          <div className="order-2 md:order-1 flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent/40 px-3 py-1 text-xs font-semibold text-accent-foreground">
              <Sparkles className="size-3.5" /> New drop · Owambe season
            </span>
            <h1 className="mt-4 font-display text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
              Bold styles.<br />
              <span className="text-gradient-warm">Confident fits.</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground">
              Shop Nigerian designers with sizes that actually fit. Free returns across
              Lagos, delivery nationwide.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
              >
                Shop the collection <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/shop"
                search={{ category: "Women" } as never}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-semibold hover:bg-muted transition"
              >
                For women
              </Link>
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              {[
                { k: "5k+", v: "Nigerian designs" },
                { k: "24h", v: "Lagos delivery" },
                { k: "4.8★", v: "Customer rating" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-2xl font-black text-primary">{s.k}</dt>
                  <dd className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="order-1 md:order-2 relative">
            <div className="relative overflow-hidden rounded-3xl bg-accent/30">
              <img
                src={heroImg}
                alt="StyleNaija hero"
                width={1600}
                height={1200}
                className="aspect-[4/5] w-full object-cover md:aspect-[3/4]"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-background/90 p-3 backdrop-blur md:bottom-6 md:left-6 md:right-6 md:p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Featured
                  </p>
                  <p className="font-display text-base font-bold md:text-lg">
                    Amara Emerald Kaftan
                  </p>
                </div>
                <Link
                  to="/product/$id"
                  params={{ id: "amara-kaftan" }}
                  className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  Shop
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category rail */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none md:justify-center">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to="/shop"
              search={{ category: c } as never}
              className="shrink-0 rounded-full border border-border bg-card px-5 py-2 text-sm font-medium hover:border-primary hover:text-primary transition"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended */}
      <Section
        eyebrow="For you"
        title="Recommended based on your size"
        subtitle="Based on your profile · Women · UK 10"
        cta={{ label: "See all", to: "/shop" }}
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {trending.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Sale carousel — NO auto-rotate */}
      <section className="mx-auto max-w-7xl px-4 mt-12">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-accent p-6 md:p-10 text-primary-foreground">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">Sale</p>
              <h2 className="font-display text-2xl md:text-4xl font-black">
                Up to 30% off owambe season
              </h2>
            </div>
            <Link
              to="/shop"
              className="rounded-full bg-background text-foreground px-5 py-2.5 text-sm font-semibold hover:bg-background/90"
            >
              Shop sale
            </Link>
          </div>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
            {sale.map((p) => (
              <div key={p.id} className="w-56 shrink-0 snap-start rounded-2xl bg-background p-2 text-foreground">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complete the look */}
      <Section
        eyebrow="Complete the look"
        title="Owambe-ready bundle"
        subtitle="Buy the set and save 10%"
        cta={{ label: "See bundle", to: "/shop" }}
      >
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl bg-muted">
            <img
              src={lifestyle2}
              alt="Family styling"
              loading="lazy"
              width={1200}
              height={1400}
              className="aspect-[4/5] w-full object-cover md:aspect-[16/10]"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
            {bundle.map((p) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className="flex items-center gap-3 rounded-2xl bg-card p-2 border border-border hover:border-primary transition"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="size-16 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 hidden md:block">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">₦{p.price.toLocaleString("en-NG")}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* New arrivals */}
      <Section
        eyebrow="Fresh"
        title="New arrivals this week"
        cta={{ label: "Browse new", to: "/shop" }}
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Trending Nigerian styles */}
      <Section eyebrow="Trending in Lagos" title="What Naija is wearing" cta={{ label: "See more", to: "/shop" }}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {trending.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Community band */}
      <section className="mx-auto max-w-7xl px-4 mt-14">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl">
            <img src={lifestyle1} alt="Street style" loading="lazy" className="aspect-[4/5] w-full object-cover md:aspect-[4/3]" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-background">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">#StyledInNaija</p>
              <h3 className="font-display text-2xl font-black md:text-3xl">
                Share your look. Win the next drop.
              </h3>
            </div>
          </div>
          <div className="grid gap-3 rounded-3xl border border-border bg-card p-6">
            <ValueRow icon={Truck} title="Fast Lagos delivery" desc="Same day within Lagos. 24-48h nationwide." />
            <ValueRow icon={ShieldCheck} title="Size-confident buying" desc="Body-type filters, real customer photos, easy returns." />
            <ValueRow icon={MessageCircle} title="WhatsApp styling support" desc="Chat a stylist for outfit and size advice." />
          </div>
        </div>
      </section>

      <div className="h-16" />
    </AppShell>
  );
}

function Section({
  eyebrow,
  title,
  subtitle,
  cta,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: { label: string; to: string };
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
          )}
          <h2 className="mt-1 font-display text-2xl font-black md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {cta && (
          <Link
            to={cta.to}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            {cta.label} <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function ValueRow({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-accent/40">
        <Icon className="size-5 text-accent-foreground" />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
