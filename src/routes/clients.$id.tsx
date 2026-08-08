import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Phone, Plus, Ruler, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, EmptyState, Field, inputCls, PageHeader, Stat } from "@/components/studio/Bits";
import { formatDate, loadSheets } from "@/lib/measurements";
import {
  addAppointment,
  balanceOf,
  dueBadge,
  formatNaira,
  paidTotal,
  prettyDate,
  removeClient,
  updateClient,
  useStudio,
  waLink,
} from "@/lib/studio";

export const Route = createFileRoute("/clients/$id")({
  component: ClientDetail,
  head: () => ({
    meta: [
      { title: "Client profile — StitchNaija" },
      {
        name: "description",
        content: "Full client history: orders, measurements, fittings, payments and notes.",
      },
      { property: "og:title", content: "Client profile — StitchNaija" },
      { property: "og:description", content: "Everything about one client in one place." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function ClientDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data } = useStudio();
  const client = data.clients.find((c) => c.id === id);
  const [notes, setNotes] = useState<string | null>(null);
  const [apptOpen, setApptOpen] = useState(false);

  if (!client) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-16">
          <EmptyState title="Client not found" hint="They may have been removed from your directory." />
          <Link to="/clients" className="mt-4 inline-block text-sm font-semibold text-emerald">
            Back to clients
          </Link>
        </div>
      </AppShell>
    );
  }

  const jobs = data.jobs.filter((j) => j.clientId === client.id);
  const sheets = loadSheets().filter(
    (s) => s.clientName.trim().toLowerCase() === client.name.trim().toLowerCase(),
  );
  const appts = data.appointments
    .filter((a) => a.clientId === client.id)
    .sort((a, b) => a.date.localeCompare(b.date));
  const spend = jobs.reduce((n, j) => n + paidTotal(j), 0);
  const owed = jobs.reduce((n, j) => n + balanceOf(j), 0);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <Link
          to="/clients"
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-emerald"
        >
          <ArrowLeft className="size-4" /> Clients
        </Link>

        <div className="mt-4 flex flex-wrap items-start gap-4 rounded-2xl border border-border bg-card p-5">
          <div className="grid size-16 place-items-center rounded-full bg-emerald/10 font-display text-2xl font-black text-emerald">
            {client.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-black md:text-3xl">{client.name}</h1>
            <p className="text-sm text-muted-foreground">
              {client.city} · {client.occasion || "No occasion set"} · Client since{" "}
              {prettyDate(client.createdAt)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={`tel:${client.phone}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
              >
                <Phone className="size-3.5" /> {client.phone}
              </a>
              <a
                href={waLink(client.phone, `Hi ${client.name.split(" ")[0]}, this is ${data.profile.studioName}.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-emerald/90"
              >
                <MessageCircle className="size-3.5" /> WhatsApp
              </a>
              <Link
                to="/measurements"
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
              >
                <Ruler className="size-3.5" /> New measurement
              </Link>
              <button
                onClick={() => {
                  removeClient(client.id);
                  navigate({ to: "/clients" });
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-3.5" /> Remove
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat icon={Ruler} label="Jobs" value={jobs.length.toString()} />
          <Stat icon={Plus} label="Lifetime spend" value={formatNaira(spend)} tone="gold" />
          <Stat icon={Plus} label="Outstanding" value={formatNaira(owed)} tone="teal" />
        </div>

        {/* Jobs */}
        <section className="mt-8">
          <h2 className="font-display text-xl font-black">Order history</h2>
          <div className="mt-3 space-y-3">
            {jobs.length === 0 ? (
              <EmptyState title="No jobs yet" hint="Create a job from the Work board." />
            ) : (
              jobs.map((j) => {
                const badge = dueBadge(j);
                return (
                  <Link
                    key={j.id}
                    to="/jobs/$id"
                    params={{ id: j.id }}
                    className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-emerald/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{j.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {j.garment} · due {prettyDate(j.dueDate)} · {formatNaira(paidTotal(j))} of{" "}
                        {formatNaira(j.price)} paid
                      </p>
                    </div>
                    <Badge tone={badge.tone}>{badge.label}</Badge>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        {/* Measurements */}
        <section className="mt-8">
          <h2 className="font-display text-xl font-black">Measurement sheets</h2>
          <div className="mt-3 space-y-3">
            {sheets.length === 0 ? (
              <EmptyState
                title="No measurements saved"
                hint="Save a sheet under this exact client name to see it here."
              />
            ) : (
              sheets.map((s) => (
                <div key={s.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{s.templateId.replace(/-/g, " ")}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(s.createdAt)}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {Object.entries(s.values)
                      .filter(([, v]) => v)
                      .slice(0, 8)
                      .map(([k, v]) => (
                        <span key={k} className="rounded-full bg-muted px-2 py-1">
                          {k}: {v}"
                        </span>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Appointments */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-black">Fittings & appointments</h2>
            <button
              onClick={() => setApptOpen((o) => !o)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald"
            >
              <Plus className="size-4" /> Book
            </button>
          </div>
          {apptOpen ? (
            <form
              className="mt-3 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                addAppointment({
                  clientId: client.id,
                  date: String(f.get("date")),
                  time: String(f.get("time")),
                  kind: String(f.get("kind")) as "fitting",
                  notes: String(f.get("notes") ?? ""),
                });
                setApptOpen(false);
              }}
            >
              <Field label="Date">
                <input required type="date" name="date" className={inputCls} />
              </Field>
              <Field label="Time">
                <input required type="time" name="time" defaultValue="10:00" className={inputCls} />
              </Field>
              <Field label="Type">
                <select name="kind" className={inputCls} defaultValue="fitting">
                  <option value="measurement">Measurement</option>
                  <option value="fitting">Fitting</option>
                  <option value="pickup">Pickup</option>
                  <option value="consultation">Consultation</option>
                </select>
              </Field>
              <Field label="Notes">
                <input name="notes" className={inputCls} placeholder="Optional" />
              </Field>
              <button className="rounded-xl bg-emerald px-4 py-2.5 text-sm font-semibold text-primary-foreground sm:col-span-2">
                Save appointment
              </button>
            </form>
          ) : null}
          <div className="mt-3 space-y-2">
            {appts.length === 0 ? (
              <EmptyState title="Nothing booked" hint="Schedule the next fitting to stay ahead." />
            ) : (
              appts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm"
                >
                  <span className="font-semibold capitalize">{a.kind}</span>
                  <span className="text-muted-foreground">
                    {prettyDate(a.date)} at {a.time}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">{a.notes}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Notes */}
        <section className="mt-8">
          <h2 className="font-display text-xl font-black">Style notes</h2>
          <textarea
            className={`${inputCls} mt-3 min-h-28`}
            value={notes ?? client.notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => {
              if (notes !== null) updateClient(client.id, { notes });
            }}
            placeholder="Fabric preferences, fit quirks, family sizes…"
          />
        </section>
      </div>
    </AppShell>
  );
}