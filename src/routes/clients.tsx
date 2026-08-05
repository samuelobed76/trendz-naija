import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Ruler, Phone } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/clients")({
  component: Clients,
  head: () => ({
    meta: [
      { title: "Clients — StitchNaija" },
      { name: "description", content: "Manage your client list, measurements and order history on StitchNaija." },
      { property: "og:title", content: "Clients — StitchNaija" },
      { property: "og:description", content: "Your tailoring client directory." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const CLIENTS = [
  { id: "c1", name: "Amaka Okafor", phone: "0801 234 5671", orders: 4, last: "2 days ago", city: "Lagos" },
  { id: "c2", name: "Tunde Balogun", phone: "0802 345 6782", orders: 2, last: "1 week ago", city: "Lagos" },
  { id: "c3", name: "Chioma Nwosu", phone: "0803 456 7893", orders: 7, last: "3 days ago", city: "Enugu" },
  { id: "c4", name: "Efe Adeyemi", phone: "0804 567 8904", orders: 1, last: "2 weeks ago", city: "Port Harcourt" },
  { id: "c5", name: "Halima Yusuf", phone: "0805 678 9015", orders: 3, last: "Yesterday", city: "Abuja" },
  { id: "c6", name: "Bola Johnson", phone: "0806 789 0126", orders: 5, last: "5 days ago", city: "Lagos" },
];

function Clients() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald">Directory</p>
            <h1 className="mt-1 font-display text-3xl font-black md:text-4xl">Clients</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Everyone you've measured, sewn for and delivered to.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-emerald/90 transition">
            <Plus className="size-4" /> Add client
          </button>
        </div>

        {/* Search */}
        <div className="mt-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search clients by name or phone"
            className="w-full rounded-2xl border border-border bg-card py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald"
          />
        </div>

        {/* List */}
        <ul className="mt-6 space-y-3">
          {CLIENTS.map((c) => (
            <li key={c.id}>
              <Link
                to="/measurements"
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-emerald/60 transition"
              >
                <div className="grid size-12 place-items-center rounded-full bg-emerald/10 font-display text-lg font-black text-emerald">
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.city} · {c.orders} orders · Last active {c.last}</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="size-4" />
                  {c.phone}
                </div>
                <div className="grid size-10 place-items-center rounded-full border border-border hover:bg-muted">
                  <Ruler className="size-4 text-emerald" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
