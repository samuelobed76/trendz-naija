import { createFileRoute } from "@tanstack/react-router";
import { Save, Ruler } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/measurements")({
  component: Measurements,
  head: () => ({
    meta: [
      { title: "Measurements — StitchNaija" },
      {
        name: "description",
        content: "Record and recall client measurements for perfect fits every time.",
      },
      { property: "og:title", content: "Measurements — StitchNaija" },
      { property: "og:description", content: "Never lose a measurement sheet again." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Measurements() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-emerald/10">
            <Ruler className="size-5 text-emerald" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald">Fit library</p>
            <h1 className="font-display text-3xl font-black md:text-4xl">Measurements</h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Save once, reuse forever. Pick a client or add a new set of measurements.
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Client name" placeholder="e.g. Amaka Okafor" />
            <Field label="Phone" placeholder="0801 234 5678" />
            <Field label="Bust / Chest (inches)" placeholder="36" />
            <Field label="Waist (inches)" placeholder="30" />
            <Field label="Hip (inches)" placeholder="40" />
            <Field label="Shoulder width (inches)" placeholder="16" />
            <Field label="Sleeve length (inches)" placeholder="24" />
            <Field label="Dress / Top length (inches)" placeholder="28" />
            <Field label="Trouser length (inches)" placeholder="40" />
            <Field label="Inseam (inches)" placeholder="30" />
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              rows={3}
              placeholder="Posture notes, preferred fit, fabric preferences..."
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald"
            />
          </div>
          <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-emerald/90 transition">
            <Save className="size-4" /> Save measurements
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald"
      />
    </div>
  );
}
