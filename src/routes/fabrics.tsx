import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, EmptyState, Field, inputCls, PageHeader, Stat } from "@/components/studio/Bits";
import { Boxes, Coins } from "lucide-react";
import { addFabric, formatNaira, removeFabric, updateFabric, useStudio } from "@/lib/studio";

export const Route = createFileRoute("/fabrics")({
  component: Fabrics,
  head: () => ({
    meta: [
      { title: "Fabric inventory — StitchNaija" },
      {
        name: "description",
        content:
          "Track fabric yards, cost per yard, suppliers and reorder alerts for your tailoring studio.",
      },
      { property: "og:title", content: "Fabric inventory — StitchNaija" },
      { property: "og:description", content: "Know what is on the shelf before you cut." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Fabrics() {
  const { data } = useStudio();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    color: "",
    yards: "0",
    costPerYard: "0",
    reorderAt: "5",
    supplier: "",
  });

  const totalYards = data.fabrics.reduce((n, f) => n + f.yards, 0);
  const stockValue = data.fabrics.reduce((n, f) => n + f.yards * f.costPerYard, 0);
  const low = data.fabrics.filter((f) => f.yards <= f.reorderAt);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <PageHeader
          eyebrow="Store room"
          title="Fabric inventory"
          subtitle="Yards on hand, stock value and reorder alerts."
          action={
            <button
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-full gradient-emerald px-4 py-2.5 text-sm font-bold text-primary-foreground"
            >
              <Plus className="size-4" /> Add fabric
            </button>
          }
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat icon={Boxes} label="Yards on hand" value={`${totalYards}`} />
          <Stat icon={Coins} label="Stock value" value={formatNaira(stockValue)} tone="gold" />
          <Stat
            icon={AlertTriangle}
            label="Needs reorder"
            value={`${low.length}`}
            tone="teal"
            sub={low.map((f) => f.name).join(", ") || "All good"}
          />
        </div>

        {open ? (
          <form
            className="mt-6 grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.name.trim()) return;
              addFabric({
                name: form.name.trim(),
                color: form.color.trim(),
                yards: Number(form.yards) || 0,
                costPerYard: Number(form.costPerYard) || 0,
                reorderAt: Number(form.reorderAt) || 0,
                supplier: form.supplier.trim(),
              });
              setForm({ name: "", color: "", yards: "0", costPerYard: "0", reorderAt: "5", supplier: "" });
              setOpen(false);
            }}
          >
            <Field label="Fabric name">
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="French lace"
              />
            </Field>
            <Field label="Colour">
              <input
                className={inputCls}
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="Ivory"
              />
            </Field>
            <Field label="Yards">
              <input
                type="number"
                className={inputCls}
                value={form.yards}
                onChange={(e) => setForm({ ...form, yards: e.target.value })}
              />
            </Field>
            <Field label="Cost per yard (₦)">
              <input
                type="number"
                className={inputCls}
                value={form.costPerYard}
                onChange={(e) => setForm({ ...form, costPerYard: e.target.value })}
              />
            </Field>
            <Field label="Reorder at (yards)">
              <input
                type="number"
                className={inputCls}
                value={form.reorderAt}
                onChange={(e) => setForm({ ...form, reorderAt: e.target.value })}
              />
            </Field>
            <Field label="Supplier">
              <input
                className={inputCls}
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                placeholder="Balogun Market"
              />
            </Field>
            <div className="sm:col-span-2">
              <button className="rounded-full gradient-emerald px-5 py-2.5 text-sm font-bold text-primary-foreground">
                Save fabric
              </button>
            </div>
          </form>
        ) : null}

        <div className="mt-8 space-y-3">
          {data.fabrics.length === 0 ? (
            <EmptyState title="No fabric yet" hint="Add your first roll to start tracking yards." />
          ) : null}
          {data.fabrics.map((f) => (
            <div key={f.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-bold">{f.name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {f.color || "—"} · {f.supplier || "No supplier"} · {formatNaira(f.costPerYard)}/yd
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {f.yards <= f.reorderAt ? <Badge tone="danger">Reorder</Badge> : <Badge tone="ok">In stock</Badge>}
                  <button
                    aria-label="Delete fabric"
                    onClick={() => removeFabric(f.id)}
                    className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => updateFabric(f.id, { yards: Math.max(0, f.yards - 1) })}
                  className="size-8 rounded-full border border-border font-bold hover:border-emerald"
                >
                  −
                </button>
                <span className="font-display text-xl font-black">{f.yards}</span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">yards</span>
                <button
                  onClick={() => updateFabric(f.id, { yards: f.yards + 1 })}
                  className="size-8 rounded-full border border-border font-bold hover:border-emerald"
                >
                  +
                </button>
                <span className="ml-auto text-sm font-semibold">
                  {formatNaira(f.yards * f.costPerYard)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}