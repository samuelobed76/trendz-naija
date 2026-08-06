export type MeasurementField = {
  key: string;
  label: string;
  placeholder: string;
  unit?: string;
};

export type MeasurementTemplate = {
  id: string;
  name: string;
  description: string;
  fields: MeasurementField[];
};

const f = (key: string, label: string, placeholder: string): MeasurementField => ({
  key,
  label,
  placeholder,
  unit: "in",
});

export const TEMPLATES: MeasurementTemplate[] = [
  {
    id: "female-dress",
    name: "Female dress / gown",
    description: "Bust, waist, hip and length set for dresses and gowns.",
    fields: [
      f("bust", "Bust", "36"),
      f("underBust", "Under bust", "32"),
      f("waist", "Waist", "30"),
      f("hip", "Hip", "40"),
      f("shoulder", "Shoulder width", "16"),
      f("sleeveLength", "Sleeve length", "24"),
      f("roundSleeve", "Round sleeve", "12"),
      f("dressLength", "Dress length", "52"),
      f("nipToNip", "Nip to nip", "8"),
      f("shoulderToNip", "Shoulder to nip", "10"),
    ],
  },
  {
    id: "male-native",
    name: "Male native (Kaftan / Agbada)",
    description: "Full flowing native set including agbada width and cap.",
    fields: [
      f("chest", "Chest", "40"),
      f("stomach", "Stomach", "38"),
      f("shoulder", "Shoulder width", "18"),
      f("topLength", "Top length", "44"),
      f("sleeveLength", "Sleeve length", "24"),
      f("roundSleeve", "Round sleeve", "14"),
      f("agbadaWidth", "Agbada width", "60"),
      f("trouserWaist", "Trouser waist", "34"),
      f("trouserLength", "Trouser length", "40"),
      f("thigh", "Thigh", "24"),
      f("cap", "Cap size", "22"),
    ],
  },
  {
    id: "suit",
    name: "Suit / two-piece",
    description: "Jacket and trouser measurements for tailored suits.",
    fields: [
      f("chest", "Chest", "40"),
      f("waist", "Waist", "34"),
      f("hip", "Hip", "40"),
      f("shoulder", "Shoulder width", "18"),
      f("jacketLength", "Jacket length", "30"),
      f("sleeveLength", "Sleeve length", "25"),
      f("bicep", "Bicep", "14"),
      f("neck", "Neck", "16"),
      f("trouserWaist", "Trouser waist", "34"),
      f("inseam", "Inseam", "31"),
      f("trouserLength", "Trouser length", "41"),
    ],
  },
  {
    id: "shirt-trouser",
    name: "Shirt & trouser",
    description: "Everyday casual and corporate shirt plus trouser fit.",
    fields: [
      f("neck", "Neck", "16"),
      f("chest", "Chest", "40"),
      f("stomach", "Stomach", "38"),
      f("shoulder", "Shoulder width", "18"),
      f("shirtLength", "Shirt length", "30"),
      f("sleeveLength", "Sleeve length", "25"),
      f("cuff", "Cuff", "9"),
      f("trouserWaist", "Trouser waist", "34"),
      f("seat", "Seat", "40"),
      f("inseam", "Inseam", "31"),
    ],
  },
  {
    id: "skirt-blouse",
    name: "Skirt & blouse",
    description: "Two-piece Iro & buba style or corporate skirt suit.",
    fields: [
      f("bust", "Bust", "36"),
      f("waist", "Waist", "30"),
      f("hip", "Hip", "40"),
      f("shoulder", "Shoulder width", "16"),
      f("blouseLength", "Blouse length", "24"),
      f("sleeveLength", "Sleeve length", "20"),
      f("roundSleeve", "Round sleeve", "12"),
      f("skirtLength", "Skirt length", "38"),
      f("knee", "Knee", "20"),
    ],
  },
];

export function getTemplate(id: string) {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

export type MeasurementSheet = {
  id: string;
  clientName: string;
  phone: string;
  templateId: string;
  values: Record<string, string>;
  notes: string;
  createdAt: string;
};

const KEY = "stitchnaija.measurements.v1";

export function loadSheets(): MeasurementSheet[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MeasurementSheet[]) : [];
  } catch {
    return [];
  }
}

export function saveSheets(sheets: MeasurementSheet[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(sheets));
}

export function addSheet(sheet: Omit<MeasurementSheet, "id" | "createdAt">): MeasurementSheet[] {
  const created: MeasurementSheet = {
    ...sheet,
    id: `ms_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const next = [created, ...loadSheets()];
  saveSheets(next);
  return next;
}

export function removeSheet(id: string): MeasurementSheet[] {
  const next = loadSheets().filter((s) => s.id !== id);
  saveSheets(next);
  return next;
}

export type FieldDiff = {
  key: string;
  label: string;
  a: string;
  b: string;
  delta: number | null;
};

/** Compare two sheets field by field. Uses the union of both templates' fields. */
export function diffSheets(a: MeasurementSheet, b: MeasurementSheet): FieldDiff[] {
  const fields = [...getTemplate(a.templateId).fields];
  for (const field of getTemplate(b.templateId).fields) {
    if (!fields.some((x) => x.key === field.key)) fields.push(field);
  }
  return fields.map((field) => {
    const av = a.values[field.key] ?? "";
    const bv = b.values[field.key] ?? "";
    const an = Number.parseFloat(av);
    const bn = Number.parseFloat(bv);
    const delta = Number.isFinite(an) && Number.isFinite(bn) ? Number((bn - an).toFixed(2)) : null;
    return { key: field.key, label: field.label, a: av, b: bv, delta };
  });
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
