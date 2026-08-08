import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Plus, X } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, EmptyState, Field, inputCls, PageHeader } from "@/components/studio/Bits";
import {
  addJob,
  balanceOf,
  dueBadge,
  formatNaira,
  JOB_STAGES,
  paidTotal,
  prettyDate,
  updateJob,
  useStudio,
  type JobStatus,
} from "@/lib/studio";

export const Route = createFileRoute("/jobs")({
  component: Jobs,
  head: () => ({
    meta: [
      { title: "Work board — StitchNaija" },
      {
        name: "description",
        content:
          "Track every tailoring job from enquiry to delivery, with deposits, balances and deadlines.",
      },
      { property: "og:title", content: "Work board — StitchNaija" },
      { property: "og:description", content: "Your studio pipeline, stage by stage." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Jobs() {
  const { data } = useStudio();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<JobStatus | "all">("all");

  const jobs = data.jobs
    .filter((j) => filter === "all" || j.status === filter)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const overdue = data.jobs.filter((j) => j.status !== "delivered" && dueBadge(j).tone === "danger");

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <PageHeader
          eyebrow="Pipeline"
          title="Work board"
          subtitle="Every job, its stage, its money and its deadline."
          action={
            <button
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-emerald/90"
            >
              {open ? <X className="size-4" /> : <Plus className="size-4" />}
              {open ? "Cancel" : "New job"}
            </button>
          }
        />

        {overdue.length > 0 ? (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
            <AlertTriangle className="mt-0.5 size-5 text-destructive" />
            <p className="text-sm">
              <span className="font-bold">{overdue.length} job(s) past due.</span>{" "}
              {overdue.map((j) => j.title).join(", ")} — call the client or update the stage.
            </p>
          </div>
        ) : null}

        {open ? (
          <form
            className="mt-5 grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              addJob({
                clientId: String(f.get("clientId")),
                title: String(f.get("title")),
                garment: String(f.get("garment") ?? ""),
                price: Number(f.get("price") ?? 0),
                dueDate: String(f.get("dueDate")),
                status: String(f.get("status")) as JobStatus,
                fabric: String(f.get("fabric") ?? ""),
                notes: String(f.get("notes") ?? ""),
              });
              setOpen(false);
            }}
          >
            <Field label="Client">
              <select required name="clientId" className={inputCls}>
                {data.clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Job title">
              <input required name="title" className={inputCls} placeholder="Ankara peplum gown" />
            </Field>
            <Field label="Garment type">
              <input name="garment" className={inputCls} placeholder="Gown" />
            </Field>
            <Field label="Price (₦)">
              <input required type="number" name="price" className={inputCls} placeholder="85000" />
            </Field>
            <Field label="Due date">
              <input required type="date" name="dueDate" className={inputCls} />
            </Field>
            <Field label="Stage">
              <select name="status" className={inputCls} defaultValue="enquiry">
                {JOB_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Fabric">
              <input name="fabric" className={inputCls} placeholder="Ankara wax — 6 yards" />
            </Field>
            <Field label="Notes">
              <input name="notes" className={inputCls} placeholder="Lined bodice, hidden zip" />
            </Field>
            <button className="rounded-xl bg-emerald px-4 py-2.5 text-sm font-semibold text-primary-foreground sm:col-span-2">
              Create job
            </button>
          </form>
        ) : null}

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {(["all", ...JOB_STAGES.map((s) => s.id)] as const).map((f) => {
            const label = f === "all" ? "All" : JOB_STAGES.find((s) => s.id === f)?.label;
            const count = f === "all" ? data.jobs.length : data.jobs.filter((j) => j.status === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                  filter === f
                    ? "border-emerald bg-emerald text-primary-foreground"
                    : "border-border bg-card hover:border-emerald/60"
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-3">
          {jobs.length === 0 ? (
            <EmptyState title="No jobs here" hint="Create a job or pick another stage." />
          ) : (
            jobs.map((j) => {
              const badge = dueBadge(j);
              const client = data.clients.find((c) => c.id === j.clientId);
              const pct = j.price ? Math.min(100, Math.round((paidTotal(j) / j.price) * 100)) : 0;
              return (
                <div key={j.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex flex-wrap items-start gap-3">
                    <Link to="/jobs/$id" params={{ id: j.id }} className="min-w-0 flex-1">
                      <p className="font-semibold">{j.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {client?.name ?? "Unknown client"} · {j.garment || "Garment"} · due{" "}
                        {prettyDate(j.dueDate)}
                      </p>
                    </Link>
                    <Badge tone={badge.tone}>{badge.label}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="min-w-40 flex-1">
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-emerald" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatNaira(paidTotal(j))} paid · {formatNaira(balanceOf(j))} balance
                      </p>
                    </div>
                    <select
                      value={j.status}
                      onChange={(e) => updateJob(j.id, { status: e.target.value as JobStatus })}
                      className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold outline-none focus:border-emerald"
                    >
                      {JOB_STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}