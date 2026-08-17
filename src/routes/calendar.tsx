import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, EmptyState, Field, inputCls, PageHeader } from "@/components/studio/Bits";
import {
  addAppointment,
  clientOf,
  daysUntil,
  prettyDate,
  removeAppointment,
  useStudio,
  waLink,
  type Appointment,
} from "@/lib/studio";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
  head: () => ({
    meta: [
      { title: "Fittings calendar — StitchNaija" },
      {
        name: "description",
        content:
          "Schedule measurements, fittings and pickups, and send WhatsApp reminders to your clients.",
      },
      { property: "og:title", content: "Fittings calendar — StitchNaija" },
      {
        property: "og:description",
        content: "Every measurement, fitting and pickup in one studio calendar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const KINDS: Appointment["kind"][] = ["measurement", "fitting", "pickup", "consultation"];

function CalendarPage() {
  const { data } = useStudio();
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState(data.clients[0]?.id ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("10:00");
  const [kind, setKind] = useState<Appointment["kind"]>("fitting");
  const [notes, setNotes] = useState("");

  const sorted = [...data.appointments].sort((a, b) =>
    (a.date + a.time).localeCompare(b.date + b.time),
  );
  const groups = sorted.reduce<Record<string, Appointment[]>>((acc, a) => {
    (acc[a.date] ||= []).push(a);
    return acc;
  }, {});

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <PageHeader
          eyebrow="Schedule"
          title="Fittings calendar"
          subtitle="Measurements, fittings and pickups — grouped by day."
          action={
            <button
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-full gradient-emerald px-4 py-2.5 text-sm font-bold text-primary-foreground"
            >
              <Plus className="size-4" /> New booking
            </button>
          }
        />

        {open ? (
          <form
            className="mt-6 grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!clientId) return;
              addAppointment({ clientId, date, time, kind, notes });
              setNotes("");
              setOpen(false);
            }}
          >
            <Field label="Client">
              <select
                className={inputCls}
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
                {data.clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Type">
              <select
                className={inputCls}
                value={kind}
                onChange={(e) => setKind(e.target.value as Appointment["kind"])}
              >
                {KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date">
              <input
                type="date"
                className={inputCls}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>
            <Field label="Time">
              <input
                type="time"
                className={inputCls}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Notes">
                <input
                  className={inputCls}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What is this booking for?"
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <button className="rounded-full gradient-emerald px-5 py-2.5 text-sm font-bold text-primary-foreground">
                Save booking
              </button>
            </div>
          </form>
        ) : null}

        <div className="mt-8 space-y-6">
          {sorted.length === 0 ? (
            <EmptyState
              title="No bookings yet"
              hint="Add a fitting or pickup so nothing slips through the week."
            />
          ) : null}
          {Object.entries(groups).map(([day, items]) => {
            const n = daysUntil(day);
            return (
              <section key={day}>
                <div className="flex items-center gap-3">
                  <CalendarDays className="size-4 text-emerald" />
                  <h2 className="font-display text-lg font-bold">{prettyDate(day)}</h2>
                  <Badge tone={n < 0 ? "muted" : n === 0 ? "danger" : n <= 3 ? "warn" : "ok"}>
                    {n < 0 ? "Past" : n === 0 ? "Today" : `In ${n}d`}
                  </Badge>
                </div>
                <ul className="mt-3 space-y-2">
                  {items.map((a) => {
                    const c = clientOf(data, a.clientId);
                    return (
                      <li
                        key={a.id}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {a.time} · {c?.name ?? "Client"}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">
                            <span className="capitalize">{a.kind}</span>
                            {a.notes ? ` — ${a.notes}` : ""}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {c ? (
                            <a
                              href={waLink(
                                c.phone,
                                `Hi ${c.name}, reminder for your ${a.kind} on ${prettyDate(a.date)} at ${a.time}.`,
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-emerald"
                            >
                              Remind
                            </a>
                          ) : null}
                          {c ? (
                            <Link
                              to="/clients/$id"
                              params={{ id: c.id }}
                              className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-emerald"
                            >
                              Profile
                            </Link>
                          ) : null}
                          <button
                            aria-label="Delete booking"
                            onClick={() => removeAppointment(a.id)}
                            className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}