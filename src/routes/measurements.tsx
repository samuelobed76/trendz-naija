import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Save, Ruler, Trash2, GitCompareArrows, LayoutTemplate, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import {
  TEMPLATES,
  addSheet,
  diffSheets,
  formatDate,
  getTemplate,
  loadSheets,
  removeSheet,
  type MeasurementSheet,
} from "@/lib/measurements";

export const Route = createFileRoute("/measurements")({
  component: Measurements,
  head: () => ({
    meta: [
      { title: "Measurement Templates — StitchNaija" },
      {
        name: "description",
        content:
          "Reusable measurement templates for kaftans, gowns, suits and more — record, save and compare client measurements.",
      },
      { property: "og:title", content: "Measurement Templates — StitchNaija" },
      {
        property: "og:description",
        content: "Record once, reuse forever, and compare fits over time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Measurements() {
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [sheets, setSheets] = useState<MeasurementSheet[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSheets(loadSheets());
  }, []);

  const template = getTemplate(templateId);

  const compareSheets = useMemo(
    () => compare.map((id) => sheets.find((s) => s.id === id)).filter(Boolean) as MeasurementSheet[],
    [compare, sheets],
  );
  const diffs = compareSheets.length === 2 ? diffSheets(compareSheets[0], compareSheets[1]) : [];

  function onSave() {
    if (!clientName.trim()) return;
    setSheets(addSheet({ clientName: clientName.trim(), phone, templateId, values, notes }));
    setValues({});
    setNotes("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  function toggleCompare(id: string) {
    setCompare((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-2),
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
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
          Pick a template, record the numbers once, then reuse and compare them for every client.
        </p>

        {/* Template picker */}
        <div className="mt-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <LayoutTemplate className="size-4 text-emerald" /> Templates
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {TEMPLATES.map((t) => {
              const active = t.id === templateId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplateId(t.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-emerald bg-emerald/5 ring-1 ring-emerald/40"
                      : "border-border bg-card hover:border-emerald/50"
                  }`}
                >
                  <p className="font-semibold">{t.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-emerald">
                    {t.fields.length} fields
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
          <h2 className="font-display text-xl font-black">{template.name}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field
              label="Client name"
              placeholder="e.g. Amaka Okafor"
              value={clientName}
              onChange={setClientName}
            />
            <Field
              label="Phone"
              placeholder="0801 234 5678"
              value={phone}
              onChange={setPhone}
            />
            {template.fields.map((f) => (
              <Field
                key={f.key}
                label={`${f.label} (inches)`}
                placeholder={f.placeholder}
                value={values[f.key] ?? ""}
                onChange={(v) => setValues((prev) => ({ ...prev, [f.key]: v }))}
              />
            ))}
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Posture notes, preferred fit, fabric preferences..."
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald"
            />
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={onSave}
              disabled={!clientName.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-emerald/90 disabled:opacity-50"
            >
              <Save className="size-4" /> Save measurements
            </button>
            {saved && <span className="text-sm font-medium text-emerald">Saved to fit library</span>}
          </div>
        </div>

        {/* Saved sheets */}
        <div className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-display text-2xl font-black">Saved sheets</h2>
            <p className="text-xs text-muted-foreground">
              Select two sheets to compare measurements
            </p>
          </div>

          {sheets.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              No sheets yet. Record a client's measurements above and they'll appear here.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {sheets.map((s) => {
                const selected = compare.includes(s.id);
                return (
                  <li
                    key={s.id}
                    className={`flex items-center gap-3 rounded-2xl border bg-card p-4 transition ${
                      selected ? "border-emerald ring-1 ring-emerald/40" : "border-border"
                    }`}
                  >
                    <div className="grid size-11 place-items-center rounded-full bg-emerald/10 font-display text-lg font-black text-emerald">
                      {s.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{s.clientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {getTemplate(s.templateId).name} · {formatDate(s.createdAt)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleCompare(s.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        selected
                          ? "border-emerald bg-emerald text-primary-foreground"
                          : "border-border hover:border-emerald/60"
                      }`}
                    >
                      {selected ? "Selected" : "Compare"}
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${s.clientName} sheet`}
                      onClick={() => {
                        setSheets(removeSheet(s.id));
                        setCompare((prev) => prev.filter((x) => x !== s.id));
                      }}
                      className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-muted"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Comparison */}
        {compareSheets.length === 2 && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <GitCompareArrows className="size-5 text-emerald" />
                <h2 className="font-display text-xl font-black">Comparison</h2>
              </div>
              <button
                type="button"
                onClick={() => setCompare([])}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
              >
                <X className="size-3.5" /> Clear
              </button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 pr-3 font-bold">Measurement</th>
                    <th className="py-2 pr-3 font-bold">{compareSheets[0].clientName}</th>
                    <th className="py-2 pr-3 font-bold">{compareSheets[1].clientName}</th>
                    <th className="py-2 font-bold">Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {diffs.map((d) => (
                    <tr key={d.key} className="border-b border-border/60 last:border-0">
                      <td className="py-2 pr-3 font-medium">{d.label}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{d.a || "—"}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{d.b || "—"}</td>
                      <td
                        className={`py-2 font-semibold ${
                          d.delta === null || d.delta === 0 ? "text-muted-foreground" : "text-gold"
                        }`}
                      >
                        {d.delta === null
                          ? "—"
                          : d.delta > 0
                            ? `+${d.delta}"`
                            : `${d.delta}"`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald"
      />
    </div>
  );
}
