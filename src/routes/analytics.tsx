import { createFileRoute } from "@tanstack/react-router";
import { Banknote, Clock, Star, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, EmptyState, PageHeader, Stat } from "@/components/studio/Bits";
import {
  formatNaira,
  JOB_STAGES,
  revenueByMonth,
  studioStats,
  topClients,
  useStudio,
} from "@/lib/studio";

export const Route = createFileRoute("/analytics")({
  component: Analytics,
  head: () => ({
    meta: [
      { title: "Studio analytics — StitchNaija" },
      {
        name: "description",
        content:
          "See revenue trends, outstanding balances, pipeline value and your best clients at a glance.",
      },
      { property: "og:title", content: "Studio analytics — StitchNaija" },
      { property: "og:description", content: "Revenue, pipeline and client insights for your studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Analytics() {
  const { data } = useStudio();
  const s = studioStats(data);
  const months = revenueByMonth(data.jobs, 6);
  const peak = Math.max(1, ...months.map((m) => m.revenue));
  const best = topClients(data, 5);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <PageHeader
          eyebrow="Insights"
          title="Studio analytics"
          subtitle="Where the money is coming from and what is still owed."
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Banknote} label="Collected" value={formatNaira(s.collected)} />
          <Stat icon={Clock} label="Outstanding" value={formatNaira(s.outstanding)} tone="gold" />
          <Stat icon={TrendingUp} label="Pipeline value" value={formatNaira(s.pipelineValue)} tone="teal" />
          <Stat
            icon={Star}
            label="Avg rating"
            value={s.rating ? s.rating.toFixed(1) : "—"}
            sub={`${data.reviews.length} reviews`}
            tone="gold"
          />
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-xl font-bold">Revenue, last 6 months</h2>
          <div className="mt-6 flex h-40 items-end gap-3">
            {months.map((m) => (
              <div key={m.key} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {m.revenue ? `${Math.round(m.revenue / 1000)}k` : ""}
                </span>
                <div
                  className="w-full rounded-t-lg gradient-emerald"
                  style={{ height: `${Math.max(4, (m.revenue / peak) * 100)}%` }}
                />
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-xl font-bold">Pipeline by stage</h2>
            <ul className="mt-4 space-y-3">
              {JOB_STAGES.map((st) => {
                const jobs = data.jobs.filter((j) => j.status === st.id);
                const value = jobs.reduce((n, j) => n + j.price, 0);
                return (
                  <li key={st.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{st.label}</p>
                      <div className="mt-1 h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-emerald"
                          style={{
                            width: `${data.jobs.length ? (jobs.length / data.jobs.length) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold">
                      {jobs.length} · {formatNaira(value)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-xl font-bold">Best clients</h2>
            {best.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No client spend yet" hint="Record a payment on a job to see rankings." />
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {best.map((b, i) => (
                  <li key={b.client.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold/20 text-xs font-black text-gold">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{b.client.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {b.jobs} job{b.jobs > 1 ? "s" : ""} · {b.client.city}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold">{formatNaira(b.spend)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-xl font-bold">Attention needed</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone={s.overdue.length ? "danger" : "ok"}>{s.overdue.length} overdue</Badge>
            <Badge tone={s.dueSoon.length ? "warn" : "ok"}>{s.dueSoon.length} due within 3 days</Badge>
            <Badge tone={s.fabricLow.length ? "warn" : "ok"}>{s.fabricLow.length} fabrics low</Badge>
            <Badge tone="muted">{s.completed.length} delivered all time</Badge>
          </div>
        </section>
      </div>
    </AppShell>
  );
}