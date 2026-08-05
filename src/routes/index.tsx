import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Ruler, Users, Package, MessageSquare, Crown } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import heroImg from "@/assets/stitchnaija-hero.jpg";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "StitchNaija — The tailor's workspace" },
      {
        name: "description",
        content:
          "StitchNaija is the workspace for Nigerian tailors and fashion designers — manage clients, orders, measurements and conversations in one elegant place.",
      },
      { property: "og:title", content: "StitchNaija — The tailor's workspace" },
      {
        property: "og:description",
        content: "Manage clients, orders, measurements and chat for your tailoring business.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const PORTFOLIO = [
  { id: "p1", image: portfolio1, title: "Aso-oke bridal gown", category: "Bridal" },
  { id: "p2", image: portfolio2, title: "Charcoal agbada set", category: "Native" },
  { id: "p3", image: portfolio3, title: "Ankara couple set", category: "Casual" },
  { id: "p4", image: portfolio4, title: "Traditional kids wear", category: "Kids" },
];

function Home() {
  return (
    <AppShell>
      {/* Magazine hero */}
      <section className="relative mx-auto max-w-7xl px-4 py-8 md:py-16">
        <div className="grid gap-8 md:grid-cols-12 md:gap-6 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald">
              <Crown className="size-3.5" /> Built for Nigerian tailors
            </span>
            <h1 className="mt-5 font-display text-4xl font-black leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Your studio,
              <br />
              <span className="text-gradient-emerald">elevated.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground leading-relaxed">
              Run your tailoring business from one place: client measurements, order timelines, chat
              and a beautiful portfolio that wins you more clients.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-emerald/20 hover:bg-emerald/90 transition"
              >
                Open your studio <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-semibold hover:bg-muted transition"
              >
                View portfolio
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { k: "3x", v: "Faster client onboarding" },
                { k: "12k+", v: "Measurements saved" },
                { k: "4.9★", v: "Tailor rating" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-2xl font-black text-emerald">{s.k}</dt>
                  <dd className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="md:col-span-7 order-1 md:order-2">
            <div className="relative overflow-hidden rounded-[2rem] bg-muted">
              <img
                src={heroImg}
                alt="Nigerian tailor arranging emerald and gold aso-oke fabric"
                width={1280}
                height={1024}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute bottom-5 left-5 right-5 md:bottom-8 md:left-8 md:right-8 rounded-2xl bg-background/95 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Featured studio
                </p>
                <p className="font-display text-lg font-black">Amaka Couture Atelier · Lagos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 mt-12 md:mt-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald">How it works</p>
          <h2 className="mt-2 font-display text-3xl font-black md:text-4xl">
            From first fitting to final delivery
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <StepCard
            n="01"
            icon={Users}
            title="Capture clients"
            desc="Store contact details, occasion dates and style preferences in one profile."
          />
          <StepCard
            n="02"
            icon={Ruler}
            title="Record measurements"
            desc="Never lose a measurement sheet again. Add, update and recall sizes instantly."
          />
          <StepCard
            n="03"
            icon={Package}
            title="Track every order"
            desc="Move orders from received to delivered with live status and client chat."
          />
        </div>
      </section>

      {/* Portfolio preview */}
      <section className="mx-auto max-w-7xl px-4 mt-16 md:mt-24">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald">Portfolio</p>
            <h2 className="mt-1 font-display text-3xl font-black md:text-4xl">
              Looks that close deals
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-emerald hover:underline"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {PORTFOLIO.map((p) => (
            <div key={p.id} className="group relative overflow-hidden rounded-2xl bg-muted">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                width={512}
                height={640}
                className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-background">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                  {p.category}
                </p>
                <p className="font-display text-lg font-black leading-tight">{p.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prime CTA */}
      <section className="mx-auto max-w-7xl px-4 mt-16 md:mt-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-emerald p-8 md:p-12 text-primary-foreground">
          <div className="relative z-10 grid gap-8 md:grid-cols-2 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                StitchNaija Prime
              </p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-black">
                Grow beyond your current clients
              </h2>
              <p className="mt-3 max-w-md opacity-90">
                Get featured to new customers, priority support, advanced analytics and a verified
                badge on your portfolio.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                to="/premium"
                className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-background/90 transition"
              >
                <Crown className="size-4" /> Join Prime
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="mx-auto max-w-7xl px-4 mt-16 md:mt-24">
        <div className="grid gap-4 md:grid-cols-3">
          <ValueRow
            icon={MessageSquare}
            title="Client chat"
            desc="Answer questions, share photos and confirm fittings in one thread."
          />
          <ValueRow
            icon={Ruler}
            title="Smart measurements"
            desc="Save once, reuse forever — with notes for every client."
          />
          <ValueRow
            icon={Package}
            title="Order pipeline"
            desc="See exactly where every piece is: cut, sewn, ready, delivered."
          />
        </div>
      </section>

      <div className="h-16" />
    </AppShell>
  );
}

function StepCard({
  n,
  icon: Icon,
  title,
  desc,
}: {
  n: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <span className="font-display text-2xl font-black text-emerald/40">{n}</span>
        <div className="grid size-10 place-items-center rounded-full bg-emerald/10">
          <Icon className="size-5 text-emerald" />
        </div>
      </div>
      <h3 className="mt-4 font-display text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
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
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-gold/20">
        <Icon className="size-5 text-emerald" />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
