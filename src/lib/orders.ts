import { useCallback, useEffect, useState } from "react";
import type { Product } from "./products";
import { getProduct } from "./products";

export type OrderStatus = "received" | "packed" | "shipped" | "delivered";

export const STATUS_STEPS: {
  id: OrderStatus;
  label: string;
  desc: string;
}[] = [
  { id: "received", label: "Order received", desc: "We got your order and payment is confirmed." },
  { id: "packed", label: "Packed", desc: "Your items are packed and ready for pickup." },
  { id: "shipped", label: "Shipped", desc: "Out with the courier, on the way to you." },
  { id: "delivered", label: "Delivered", desc: "Enjoy your new fit! ✨" },
];

export interface OrderItem {
  productId: string;
  size: string;
  qty: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  createdAt: number;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  contact: { name: string; phone: string; email: string };
  address: { street: string; city: string; state: string };
  payment: "card" | "transfer" | "cod";
  // stage advance interval (ms) — short so it feels alive in the prototype
  stageMs: number;
  courier: { name: string; trackingCode: string };
  // one-off manual overrides
  manualStage?: number;
}

const ORDERS_KEY = "stylenaija.orders.v1";
const NOTIF_KEY = "stylenaija.notif.v1";

export interface NotifPrefs {
  push: boolean;
  whatsapp: boolean;
  whatsappNumber: string;
}

const DEFAULT_NOTIF: NotifPrefs = { push: false, whatsapp: true, whatsappNumber: "" };

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, val: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(val));
}

export function loadOrders(): Order[] {
  return read<Order[]>(ORDERS_KEY, []).sort((a, b) => b.createdAt - a.createdAt);
}
export function saveOrders(orders: Order[]) {
  write(ORDERS_KEY, orders);
}
export function getOrder(id: string): Order | undefined {
  return loadOrders().find((o) => o.id === id);
}
export function createOrder(o: Omit<Order, "id" | "createdAt" | "courier" | "stageMs">): Order {
  const order: Order = {
    ...o,
    id: "SN-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    createdAt: Date.now(),
    stageMs: 25_000, // ~25s per stage in the prototype
    courier: {
      name: ["GIG Logistics", "Kwik", "Sendbox", "DHL Nigeria"][Math.floor(Math.random() * 4)],
      trackingCode: "NG" + Math.random().toString().slice(2, 12),
    },
  };
  const all = loadOrders();
  saveOrders([order, ...all]);
  return order;
}

export function computeStageIndex(o: Order, now = Date.now()): number {
  const auto = Math.min(3, Math.floor((now - o.createdAt) / o.stageMs));
  return Math.max(auto, o.manualStage ?? 0);
}

export function advanceStage(id: string) {
  const all = loadOrders();
  const idx = all.findIndex((o) => o.id === id);
  if (idx < 0) return;
  const current = computeStageIndex(all[idx]);
  all[idx] = { ...all[idx], manualStage: Math.min(3, current + 1) };
  saveOrders(all);
}

export function stageTimestamps(o: Order): (number | null)[] {
  const stage = computeStageIndex(o);
  return STATUS_STEPS.map((_, i) =>
    i <= stage ? o.createdAt + i * o.stageMs : null,
  );
}

export function loadNotifPrefs(): NotifPrefs {
  return read<NotifPrefs>(NOTIF_KEY, DEFAULT_NOTIF);
}
export function saveNotifPrefs(p: NotifPrefs) {
  write(NOTIF_KEY, p);
}

export function useNotifPrefs() {
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT_NOTIF);
  useEffect(() => setPrefs(loadNotifPrefs()), []);
  const update = useCallback((patch: Partial<NotifPrefs>) => {
    setPrefs((p) => {
      const next = { ...p, ...patch };
      saveNotifPrefs(next);
      return next;
    });
  }, []);
  return [prefs, update] as const;
}

export async function requestPushPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const res = await Notification.requestPermission();
  return res === "granted";
}

export function sendPush(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/favicon.ico", badge: "/favicon.ico" });
  } catch {
    /* ignore */
  }
}

export function buildWhatsAppLink(number: string, message: string): string {
  const cleaned = number.replace(/[^\d]/g, "");
  const base = cleaned ? `https://wa.me/${cleaned}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function orderItemsWithProducts(o: Order): (OrderItem & { product: Product | undefined })[] {
  return o.items.map((i) => ({ ...i, product: getProduct(i.productId) }));
}
