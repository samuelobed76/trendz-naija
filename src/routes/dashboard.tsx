import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  MessageSquare,
  Package,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { computeStageIndex, loadOrders, STATUS_STEPS } from "@/lib/orders";
import { useConversations } from "@/lib/chat";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — StitchNaija" },
      {
        name: "description",
        content: "Your StitchNaija studio dashboard: orders, clients, messages and revenue at a glance.",
      },
      { property: "og:title", content: "Dashboard — StitchNaija" },
      { property: "og:description", content: "Manage your tailoring studio from one dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Dashboard() {
  const orders = loadOrders();
  const activeOrders = orders.filter((o) => computeStageIndex(o) < 3).slice(0, 5);
  const delivered = orders.filter((o) => computeStageIndex(o) === 3).length;
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const { items: convos } = useConversations();
  const unread = convos.reduce((n, c) => n + c.unread, 0);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald">Studio</p>
            <h1 className="mt-1 font-display text-3xl font-black md:text-4xl">Dashboard</h1>
          </div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald hover:underline"
          >
            All orders <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* KPIs */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={Package} label="Active orders" value={activeOrders.length.toString()} tone="emerald" />
          <KpiCard icon={Users} label="Total clients" value="24" tone="teal" />
          <KpiCard icon={TrendingUp} label="Revenue" value={`₦${(revenue / 1000).toFixed(0)}k`} tone="gold" />
          <KpiCard icon={MessageSquare} label="Unread messages" value={unread.toString()} tone="emerald" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Active orders pipeline */}
          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-black">Active orders</h2>
              <Link
                to="/orders"
                className="text-sm font-semibold text-emerald hover:underline"
              >
                View all
              </Link>
            </div>
            {activeOrders.length === 0 ? (
              <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-center">
                <p className="text-muted-foreground">No active orders right now.</p>
                <Link
                  to="/clients"
                  className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  <Plus className="size-4" /> Add a client
                </Link>
              </div>
            ) : (
              <ul className="mt-5 space-y-3">
                {activeOrders.map((o) => {
                  const stage = computeStageIndex(o);
                  const step = STATUS_STEPS[stage];
                  return (
                    <li key={o.id}>
                      <Link
                        to="/orders/$id"
                        params={{ id: o.id }}
                        className="flex items-center gap-4 rounded-xl border border-border p-3 hover:border-emerald/60 transition"
                      >
                        <div className="grid size-10 place-items-center rounded-full bg-emerald/10">
                          <Package className="size-5 text-emerald" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-widest text-emerald">{o.id}</p>
                          <p className="font-medium truncate">{step.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {o.contact.name} · {o.items.reduce((n, i) => n + i.qty, 0)} items
                          </p>
                        </div>
                        <div className="hidden sm:block w-24">
                          <div className="h-1.5 w-full rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-emerald"
                              style={{ width: `${((stage + 1) / 4) * 100}%` }}
                            />
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Side panel */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
              <h2 className="font-display text-xl font-black">Quick actions</h2>
              <div className="mt-4 grid gap-2">
                <QuickAction to="/clients" icon={Users} label="Add new client" />
                <QuickAction to="/measurements" icon={Clock} label="Record measurements" />
                <QuickAction to="/portfolio" icon={Plus} label="Upload new look" />
                <QuickAction to="/chat" icon={MessageSquare} label="Check messages" />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
              <h2 className="font-display text-xl font-black">This month</h2>
              <dl className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Orders completed</span>
                  <span className="font-semibold">{delivered}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">New clients</span>
                  <span className="font-semibold">6</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg. turnaround</span>
                  <span className="font-semibold">9 days</span>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "emerald" | "teal" | "gold";
}) {
  const toneClass = {
    emerald: "bg-emerald/10 text-emerald",
    teal: "bg-teal/10 text-teal",
    gold: "bg-gold/20 text-emerald",
  }[tone];
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className={`grid size-10 place-items-center rounded-full ${toneClass}`}>
        <Icon className="size-5" />
      </div>
      <p className="mt-4 font-display text-3xl font-black">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function QuickAction({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-emerald/60 transition"
    >
      <Icon className="size-5 text-emerald" />
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  );
}
