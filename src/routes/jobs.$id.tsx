import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, EmptyState, Field, inputCls, PageHeader, Stat } from "@/components/studio/Bits";
import { Banknote, Scissors } from "lucide-react";
import {
  addPayment,
  balanceOf,
  dueBadge,
  formatNaira,
  JOB_STAGES,
  paidTotal,
  prettyDate,
  removeJob,
  updateJob,
  useStudio,
  waLink,
  type JobStatus,
} from "@/lib/studio";

export const Route = createFileRoute("/jobs/$id")({
  component: JobDetail,
  head: () => ({
    meta: [
      { title: "Job details — StitchNaija" },
      {
        name: "description",
        content: "Job stage, fabric, deposits, balance and client contact in one place.",
      },
      { property: "og:title", content: "Job details — StitchNaija" },
      { property: "og:description", content: "Track one tailoring job end to end." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function JobDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data } = useStudio();
  const job = data.jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-16">
          <EmptyState title="Job not found" hint="It may have been deleted from your board." />
          <Link to="/jobs" className="mt-4 inline-block text-sm font-semibold text-emerald">
            Back to work board
          </Link>
        </div>
      </AppShell>
    );
  }

  const client = data.clients.find((c) => c.id === job.clientId);
  const badge = dueBadge(job);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-emerald"
        >
          <ArrowLeft className="size-4" /> Work board
        </Link>

        <div className="mt-4">
          <PageHeader
            eyebrow={client?.name ?? "Client"}
            title={job.title}
            subtitle={`${job.garment || "Garment"} · due ${prettyDate(job.dueDate)}`}
            action={<Badge tone={badge.tone}>{badge.label}</Badge>}
          />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Stat icon={Banknote} label="Price" value={formatNaira(job.price)} />
          <Stat icon={Banknote} label="Paid" value={formatNaira(paidTotal(job))} tone="gold" />
          <Stat icon={Banknote} label="Balance" value={formatNaira(balanceOf(job))} tone="teal" />
        </div>

        <div className="mt-5 grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
          <Field label="Stage">
            <select
              value={job.status}
              onChange={(e) => updateJob(job.id, { status: e.target.value as JobStatus })}
              className={inputCls}
            >
              {JOB_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Due date">
            <input
              type="date"
              value={job.dueDate}
              onChange={(e) => updateJob(job.id, { dueDate: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Fabric">
            <input
              value={job.fabric}
              onChange={(e) => updateJob(job.id, { fabric: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Price (₦)">
            <input
              type="number"
              value={job.price}
              onChange={(e) => updateJob(job.id, { price: Number(e.target.value) })}
              className={inputCls}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes">
              <textarea
                value={job.notes}
                onChange={(e) => updateJob(job.id, { notes: e.target.value })}
                className={`${inputCls} min-h-24`}
              />
            </Field>
          </div>
        </div>

        {/* Payments */}
        <section className="mt-8">
          <h2 className="font-display text-xl font-black">Payments</h2>
          <form
            className="mt-3 flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-4"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              addPayment(job.id, Number(f.get("amount") ?? 0), String(f.get("method")));
              e.currentTarget.reset();
            }}
          >
            <input
              required
              type="number"
              name="amount"
              placeholder="Amount"
              className={`${inputCls} flex-1 min-w-32`}
            />
            <select name="method" className={`${inputCls} w-36`} defaultValue="Transfer">
              <option>Transfer</option>
              <option>Cash</option>
              <option>POS</option>
              <option>Paystack</option>
            </select>
            <button className="rounded-xl bg-emerald px-4 py-2.5 text-sm font-semibold text-primary-foreground">
              Record
            </button>
          </form>
          <ul className="mt-3 space-y-2">
            {job.payments.length === 0 ? (
              <li>
                <EmptyState title="No payments yet" hint="Record the deposit once it lands." />
              </li>
            ) : (
              job.payments.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm"
                >
                  <span className="font-semibold">{formatNaira(p.amount)}</span>
                  <span className="text-muted-foreground">{p.method}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{prettyDate(p.at)}</span>
                </li>
              ))
            )}
          </ul>
        </section>

        <div className="mt-8 flex flex-wrap gap-2">
          {client ? (
            <>
              <Link
                to="/clients/$id"
                params={{ id: client.id }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
              >
                <Scissors className="size-4" /> Client profile
              </Link>
              <a
                href={waLink(
                  client.phone,
                  `Hi ${client.name.split(" ")[0]}, update on your ${job.title}: it is now at the ${
                    JOB_STAGES.find((s) => s.id === job.status)?.label
                  } stage. Balance ${formatNaira(balanceOf(job))}.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-emerald/90"
              >
                <MessageCircle className="size-4" /> Send update
              </a>
            </>
          ) : null}
          <button
            onClick={() => {
              removeJob(job.id);
              navigate({ to: "/jobs" });
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" /> Delete job
          </button>
        </div>
      </div>
    </AppShell>
  );
}