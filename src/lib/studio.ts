import { useCallback, useEffect, useState } from "react";

/* ---------------------------------- types --------------------------------- */

export type Client = {
  id: string;
  name: string;
  phone: string;
  city: string;
  occasion: string;
  notes: string;
  createdAt: string;
};

export type JobStatus = "enquiry" | "cutting" | "sewing" | "fitting" | "ready" | "delivered";

export const JOB_STAGES: { id: JobStatus; label: string; hint: string }[] = [
  { id: "enquiry", label: "Enquiry", hint: "Discussing style and price" },
  { id: "cutting", label: "Cutting", hint: "Fabric marked and cut" },
  { id: "sewing", label: "Sewing", hint: "On the machine" },
  { id: "fitting", label: "Fitting", hint: "Client tried it on" },
  { id: "ready", label: "Ready", hint: "Finished, awaiting pickup" },
  { id: "delivered", label: "Delivered", hint: "Handed over and paid" },
];

export type Payment = {
  id: string;
  amount: number;
  method: string;
  at: string;
  reference?: string;
};

export type Job = {
  id: string;
  clientId: string;
  title: string;
  garment: string;
  price: number;
  payments: Payment[];
  dueDate: string; // yyyy-mm-dd
  status: JobStatus;
  fabric: string;
  notes: string;
  createdAt: string;
};

export type Appointment = {
  id: string;
  clientId: string;
  date: string; // yyyy-mm-dd
  time: string;
  kind: "measurement" | "fitting" | "pickup" | "consultation";
  notes: string;
};

export type Fabric = {
  id: string;
  name: string;
  color: string;
  yards: number;
  costPerYard: number;
  reorderAt: number;
  supplier: string;
};

export type Review = {
  id: string;
  clientName: string;
  rating: number;
  text: string;
  at: string;
};

export type PortfolioPiece = {
  id: string;
  title: string;
  category: string;
  image: string;
  at: string;
};

export type StudioProfile = {
  studioName: string;
  tagline: string;
  whatsapp: string;
  city: string;
  slug: string;
};

export type StudioData = {
  profile: StudioProfile;
  clients: Client[];
  jobs: Job[];
  appointments: Appointment[];
  fabrics: Fabric[];
  reviews: Review[];
  portfolio: PortfolioPiece[];
};

/* ---------------------------------- seed ---------------------------------- */

const iso = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
};
const stamp = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

function seed(): StudioData {
  const clients: Client[] = [
    { id: "c1", name: "Amaka Okafor", phone: "08012345671", city: "Lagos", occasion: "Wedding guest", notes: "Loves structured shoulders. Prefers Ankara.", createdAt: stamp(120) },
    { id: "c2", name: "Tunde Balogun", phone: "08023456782", city: "Lagos", occasion: "Corporate", notes: "Slim fit kaftans, no embroidery.", createdAt: stamp(90) },
    { id: "c3", name: "Chioma Nwosu", phone: "08034567893", city: "Enugu", occasion: "Traditional wedding", notes: "Gold aso-oke. Needs early fittings.", createdAt: stamp(200) },
    { id: "c4", name: "Efe Adeyemi", phone: "08045678904", city: "Port Harcourt", occasion: "Birthday shoot", notes: "Bold colours, dramatic sleeves.", createdAt: stamp(40) },
    { id: "c5", name: "Halima Yusuf", phone: "08056789015", city: "Abuja", occasion: "Eid", notes: "Long abaya cuts, modest sleeves.", createdAt: stamp(65) },
    { id: "c6", name: "Bola Johnson", phone: "08067890126", city: "Lagos", occasion: "Church", notes: "Two-piece skirt and blouse.", createdAt: stamp(15) },
  ];

  const jobs: Job[] = [
    { id: "j1", clientId: "c1", title: "Ankara peplum gown", garment: "Gown", price: 85000, payments: [{ id: "p1", amount: 40000, method: "Transfer", at: stamp(10) }], dueDate: iso(4), status: "sewing", fabric: "Ankara wax — 6 yards", notes: "Peplum with lined bodice.", createdAt: stamp(12) },
    { id: "j2", clientId: "c2", title: "Navy kaftan set", garment: "Native", price: 65000, payments: [{ id: "p2", amount: 65000, method: "Cash", at: stamp(5) }], dueDate: iso(-2), status: "ready", fabric: "Cashmere navy — 4 yards", notes: "Pickup at studio.", createdAt: stamp(20) },
    { id: "j3", clientId: "c3", title: "Aso-oke bridal set", garment: "Traditional", price: 240000, payments: [{ id: "p3", amount: 100000, method: "Transfer", at: stamp(25) }], dueDate: iso(12), status: "cutting", fabric: "Gold aso-oke — 10 yards", notes: "Includes gele and ipele.", createdAt: stamp(26) },
    { id: "j4", clientId: "c4", title: "Statement sleeve dress", garment: "Dress", price: 55000, payments: [], dueDate: iso(9), status: "enquiry", fabric: "Silk crepe — TBD", notes: "Awaiting fabric choice.", createdAt: stamp(3) },
    { id: "j5", clientId: "c5", title: "Embellished abaya", garment: "Abaya", price: 90000, payments: [{ id: "p5", amount: 90000, method: "Transfer", at: stamp(30) }], dueDate: iso(-14), status: "delivered", fabric: "Nida crepe — 5 yards", notes: "Delivered before Eid.", createdAt: stamp(45) },
    { id: "j6", clientId: "c6", title: "Lace skirt & blouse", garment: "Two-piece", price: 70000, payments: [{ id: "p6", amount: 35000, method: "POS", at: stamp(2) }], dueDate: iso(1), status: "fitting", fabric: "French lace — 5 yards", notes: "Adjust waist after fitting.", createdAt: stamp(8) },
    { id: "j7", clientId: "c1", title: "Office shift dress", garment: "Dress", price: 45000, payments: [{ id: "p7", amount: 45000, method: "Cash", at: stamp(60) }], dueDate: iso(-50), status: "delivered", fabric: "Stretch cotton — 3 yards", notes: "", createdAt: stamp(70) },
  ];

  const appointments: Appointment[] = [
    { id: "a1", clientId: "c1", date: iso(1), time: "10:30", kind: "fitting", notes: "First fitting for peplum gown." },
    { id: "a2", clientId: "c3", date: iso(2), time: "14:00", kind: "measurement", notes: "Re-measure bust and hip." },
    { id: "a3", clientId: "c2", date: iso(0), time: "16:00", kind: "pickup", notes: "Kaftan pickup." },
    { id: "a4", clientId: "c4", date: iso(5), time: "11:00", kind: "consultation", notes: "Fabric selection." },
  ];

  const fabrics: Fabric[] = [
    { id: "f1", name: "Ankara wax print", color: "Multi", yards: 18, costPerYard: 3500, reorderAt: 10, supplier: "Balogun Market" },
    { id: "f2", name: "French lace", color: "Ivory", yards: 6, costPerYard: 12000, reorderAt: 8, supplier: "Lekki Fabrics" },
    { id: "f3", name: "Aso-oke", color: "Gold", yards: 12, costPerYard: 9000, reorderAt: 6, supplier: "Iseyin Weavers" },
    { id: "f4", name: "Cashmere suiting", color: "Navy", yards: 4, costPerYard: 6500, reorderAt: 6, supplier: "Kano Textiles" },
    { id: "f5", name: "Nida crepe", color: "Black", yards: 22, costPerYard: 4200, reorderAt: 10, supplier: "Abuja Souk" },
  ];

  const reviews: Review[] = [
    { id: "r1", clientName: "Amaka Okafor", rating: 5, text: "The gown fit like a glove and she delivered two days early.", at: stamp(30) },
    { id: "r2", clientName: "Tunde Balogun", rating: 5, text: "Cleanest kaftan finishing I have worn. Very neat stitching.", at: stamp(12) },
    { id: "r3", clientName: "Halima Yusuf", rating: 4, text: "Beautiful abaya, communication could be a little faster.", at: stamp(50) },
  ];

  return {
    profile: {
      studioName: "StitchNaija Atelier",
      tagline: "Bespoke Nigerian tailoring, finished to the last stitch.",
      whatsapp: "2348012345678",
      city: "Lagos",
      slug: "stitchnaija-atelier",
    },
    clients,
    jobs,
    appointments,
    fabrics,
    reviews,
    portfolio: [],
  };
}

/* --------------------------------- store ---------------------------------- */

const KEY = "stitchnaija.studio.v1";
const listeners = new Set<() => void>();
let cache: StudioData | null = null;

export function loadStudio(): StudioData {
  if (typeof window === "undefined") return seed();
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? ({ ...seed(), ...(JSON.parse(raw) as StudioData) }) : seed();
  } catch {
    cache = seed();
  }
  return cache;
}

export function saveStudio(next: StudioData) {
  cache = next;
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

export function updateStudio(patch: (d: StudioData) => StudioData) {
  saveStudio(patch(loadStudio()));
}

export function useStudio() {
  const [data, setData] = useState<StudioData>(() => seed());
  useEffect(() => {
    setData(loadStudio());
    const l = () => setData({ ...loadStudio() });
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  const mutate = useCallback((patch: (d: StudioData) => StudioData) => updateStudio(patch), []);
  return { data, mutate };
}

const id = (p: string) => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/* -------------------------------- mutations -------------------------------- */

export function addClient(c: Omit<Client, "id" | "createdAt">) {
  const client: Client = { ...c, id: id("c"), createdAt: new Date().toISOString() };
  updateStudio((d) => ({ ...d, clients: [client, ...d.clients] }));
  return client;
}
export function updateClient(cid: string, patch: Partial<Client>) {
  updateStudio((d) => ({ ...d, clients: d.clients.map((c) => (c.id === cid ? { ...c, ...patch } : c)) }));
}
export function removeClient(cid: string) {
  updateStudio((d) => ({
    ...d,
    clients: d.clients.filter((c) => c.id !== cid),
    jobs: d.jobs.filter((j) => j.clientId !== cid),
    appointments: d.appointments.filter((a) => a.clientId !== cid),
  }));
}

export function addJob(j: Omit<Job, "id" | "createdAt" | "payments">) {
  const job: Job = { ...j, id: id("j"), payments: [], createdAt: new Date().toISOString() };
  updateStudio((d) => ({ ...d, jobs: [job, ...d.jobs] }));
  return job;
}
export function updateJob(jid: string, patch: Partial<Job>) {
  updateStudio((d) => ({ ...d, jobs: d.jobs.map((j) => (j.id === jid ? { ...j, ...patch } : j)) }));
}
export function removeJob(jid: string) {
  updateStudio((d) => ({ ...d, jobs: d.jobs.filter((j) => j.id !== jid) }));
}
export function addPayment(
  jid: string,
  amount: number,
  method: string,
  extra?: { reference?: string; at?: string },
) {
  updateStudio((d) => ({
    ...d,
    jobs: d.jobs.map((j) => {
      if (j.id !== jid) return j;
      // never double-count the same Paystack transaction
      if (extra?.reference && j.payments.some((p) => p.reference === extra.reference)) return j;
      return {
        ...j,
        payments: [
          ...j.payments,
          {
            id: id("p"),
            amount,
            method,
            at: extra?.at ?? new Date().toISOString(),
            ...(extra?.reference ? { reference: extra.reference } : {}),
          },
        ],
      };
    }),
  }));
}

export function addAppointment(a: Omit<Appointment, "id">) {
  updateStudio((d) => ({ ...d, appointments: [...d.appointments, { ...a, id: id("a") }] }));
}
export function removeAppointment(aid: string) {
  updateStudio((d) => ({ ...d, appointments: d.appointments.filter((a) => a.id !== aid) }));
}

export function addFabric(f: Omit<Fabric, "id">) {
  updateStudio((d) => ({ ...d, fabrics: [{ ...f, id: id("f") }, ...d.fabrics] }));
}
export function updateFabric(fid: string, patch: Partial<Fabric>) {
  updateStudio((d) => ({ ...d, fabrics: d.fabrics.map((f) => (f.id === fid ? { ...f, ...patch } : f)) }));
}
export function removeFabric(fid: string) {
  updateStudio((d) => ({ ...d, fabrics: d.fabrics.filter((f) => f.id !== fid) }));
}

export function addReview(r: Omit<Review, "id" | "at">) {
  updateStudio((d) => ({ ...d, reviews: [{ ...r, id: id("r"), at: new Date().toISOString() }, ...d.reviews] }));
}
export function removeReview(rid: string) {
  updateStudio((d) => ({ ...d, reviews: d.reviews.filter((r) => r.id !== rid) }));
}

export function updateProfile(patch: Partial<StudioProfile>) {
  updateStudio((d) => ({ ...d, profile: { ...d.profile, ...patch } }));
}

/* -------------------------------- selectors ------------------------------- */

export const paidTotal = (j: Job) => j.payments.reduce((n, p) => n + p.amount, 0);
export const balanceOf = (j: Job) => Math.max(0, j.price - paidTotal(j));
export const isActive = (j: Job) => j.status !== "delivered";

export function daysUntil(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dateStr}T00:00:00`);
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

export function dueBadge(j: Job): { label: string; tone: "danger" | "warn" | "ok" | "muted" } {
  if (j.status === "delivered") return { label: "Delivered", tone: "muted" };
  const d = daysUntil(j.dueDate);
  if (d < 0) return { label: `${Math.abs(d)}d overdue`, tone: "danger" };
  if (d === 0) return { label: "Due today", tone: "danger" };
  if (d <= 3) return { label: `Due in ${d}d`, tone: "warn" };
  return { label: `Due in ${d}d`, tone: "ok" };
}

export function clientOf(d: StudioData, clientId: string) {
  return d.clients.find((c) => c.id === clientId);
}

export function formatNaira(n: number) {
  return `₦${Math.round(n).toLocaleString("en-NG")}`;
}

export function prettyDate(dateStr: string) {
  return new Date(dateStr.length <= 10 ? `${dateStr}T00:00:00` : dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export type MonthPoint = { key: string; label: string; revenue: number; jobs: number };

export function revenueByMonth(jobs: Job[], months = 6): MonthPoint[] {
  const out: MonthPoint[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    out.push({ key, label: d.toLocaleDateString("en-NG", { month: "short" }), revenue: 0, jobs: 0 });
  }
  for (const j of jobs) {
    for (const p of j.payments) {
      const key = p.at.slice(0, 7);
      const point = out.find((o) => o.key === key);
      if (point) point.revenue += p.amount;
    }
    const jk = j.createdAt.slice(0, 7);
    const jp = out.find((o) => o.key === jk);
    if (jp) jp.jobs += 1;
  }
  return out;
}

export function topClients(d: StudioData, limit = 5) {
  return d.clients
    .map((c) => {
      const jobs = d.jobs.filter((j) => j.clientId === c.id);
      return {
        client: c,
        jobs: jobs.length,
        spend: jobs.reduce((n, j) => n + paidTotal(j), 0),
      };
    })
    .filter((r) => r.jobs > 0)
    .sort((a, b) => b.spend - a.spend)
    .slice(0, limit);
}

export function studioStats(d: StudioData) {
  const active = d.jobs.filter(isActive);
  const collected = d.jobs.reduce((n, j) => n + paidTotal(j), 0);
  const outstanding = d.jobs.reduce((n, j) => n + balanceOf(j), 0);
  const completed = d.jobs.filter((j) => j.status === "delivered");
  const aov = d.jobs.length ? d.jobs.reduce((n, j) => n + j.price, 0) / d.jobs.length : 0;
  const overdue = active.filter((j) => daysUntil(j.dueDate) < 0);
  const dueSoon = active.filter((j) => {
    const n = daysUntil(j.dueDate);
    return n >= 0 && n <= 3;
  });
  const fabricLow = d.fabrics.filter((f) => f.yards <= f.reorderAt);
  const rating = d.reviews.length
    ? d.reviews.reduce((n, r) => n + r.rating, 0) / d.reviews.length
    : 0;
  return {
    active,
    collected,
    outstanding,
    completed,
    aov,
    overdue,
    dueSoon,
    fabricLow,
    rating,
    pipelineValue: active.reduce((n, j) => n + j.price, 0),
  };
}

export function upcomingAppointments(d: StudioData, days = 14) {
  return d.appointments
    .filter((a) => {
      const n = daysUntil(a.date);
      return n >= 0 && n <= days;
    })
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function waLink(phone: string, message: string) {
  const cleaned = phone.replace(/\D/g, "").replace(/^0/, "234");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}