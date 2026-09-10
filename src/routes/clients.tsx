import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { MessageCircle, Phone, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState, Field, inputCls, PageHeader } from "@/components/studio/Bits";
import {
  addClient,
  balanceOf,
  formatNaira,
  paidTotal,
  useStudio,
  waLink,
} from "@/lib/studio";

export const Route = createFileRoute("/clients")({
  component: Clients,
  head: () => ({
    meta: [
      { title: "Clients — StitchNaija" },
      {
        name: "description",
        content: "Manage your client list, measurements and order history on StitchNaija.",
      },
      { property: "og:title", content: "Clients — StitchNaija" },
      { property: "og:description", content: "Your tailoring client directory." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Clients() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path !== "/clients") return <Outlet />;

  const { data } = useStudio();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return data.clients
      .map((c) => {
        const jobs = data.jobs.filter((j) => j.clientId === c.id);
        return {
          client: c,
          jobs: jobs.length,
          spend: jobs.reduce((n, j) => n + paidTotal(j), 0),
          owed: jobs.reduce((n, j) => n + balanceOf(j), 0),
        };
      })
      .filter(
        (r) =>
          !term ||
          r.client.name.toLowerCase().includes(term) ||
          r.client.phone.includes(term) ||
          r.client.city.toLowerCase().includes(term),
      );
  }, [data, q]);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <PageHeader
          eyebrow="Directory"
          title="Clients"
          subtitle="Everyone you've measured, sewn for and delivered to."
          action={
            <button
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-emerald/90 transition"
            >
              {open ? <X className="size-4" /> : <Plus className="size-4" />}
              {open ? "Cancel" : "Add client"}
            </button>
          }
        />

        {open ? (
          <form
            className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              addClient({
                name: String(f.get("name")),
                phone: String(f.get("phone")),
                city: String(f.get("city") ?? ""),
                occasion: String(f.get("occasion") ?? ""),
                notes: String(f.get("notes") ?? ""),
              });
              setOpen(false);
            }}
          >
            <Field label="Full name">
              <input required name="name" className={inputCls} placeholder="Amaka Okafor" />
            </Field>
            <Field label="Phone">
              <input required name="phone" className={inputCls} placeholder="08012345678" />
            </Field>
            <Field label="City">
              <input name="city" className={inputCls} placeholder="Lagos" />
            </Field>
            <Field label="Occasion">
              <input name="occasion" className={inputCls} placeholder="Wedding guest" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Notes">
                <textarea name="notes" className={inputCls} placeholder="Fit preferences, fabric taste…" />
              </Field>
            </div>
            <button className="rounded-xl bg-emerald px-4 py-2.5 text-sm font-semibold text-primary-foreground sm:col-span-2">
              Save client
            </button>
          </form>
        ) : null}

        <div className="mt-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="text"
            placeholder="Search clients by name, phone or city"
            className="w-full rounded-2xl border border-border bg-card py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald"
          />
        </div>

        <ul className="mt-6 space-y-3">
          {rows.length === 0 ? (
            <li>
              <EmptyState title="No clients found" hint="Try a different search, or add a new client." />
            </li>
          ) : (
            rows.map(({ client: c, jobs, spend, owed }) => (
              <li key={c.id} className="rounded-2xl border border-border bg-card p-4 hover:border-emerald/60 transition">
                <div className="flex items-center gap-4">
                  <Link to="/clients/$id" params={{ id: c.id }} className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="grid size-12 shrink-0 place-items-center rounded-full bg-emerald/10 font-display text-lg font-black text-emerald">
                      {c.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.city || "—"} · {jobs} jobs · {formatNaira(spend)} spent
                        {owed > 0 ? ` · ${formatNaira(owed)} owing` : ""}
                      </p>
                    </div>
                  </Link>
                  <a
                    href={`tel:${c.phone}`}
                    className="hidden sm:grid size-10 place-items-center rounded-full border border-border hover:bg-muted"
                    aria-label={`Call ${c.name}`}
                  >
                    <Phone className="size-4" />
                  </a>
                  <a
                    href={waLink(c.phone, `Hi ${c.name.split(" ")[0]}, quick update on your outfit.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="grid size-10 place-items-center rounded-full bg-emerald/10 hover:bg-emerald/20"
                    aria-label={`WhatsApp ${c.name}`}
                  >
                    <MessageCircle className="size-4 text-emerald" />
                  </a>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </AppShell>
  );
}
