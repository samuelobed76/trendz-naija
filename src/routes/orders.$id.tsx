import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  BellOff,
  Check,
  ChevronRight,
  MapPin,
  MessageCircle,
  Package,
  PackageCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { formatNaira } from "@/lib/products";
import {
  advanceStage,
  buildWhatsAppLink,
  computeStageIndex,
  getOrder,
  orderItemsWithProducts,
  requestPushPermission,
  sendPush,
  stageTimestamps,
  STATUS_STEPS,
  useNotifPrefs,
  type Order,
  type OrderStatus,
} from "@/lib/orders";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders/$id")({
  component: TrackOrder,
  head: () => ({
    meta: [
      { title: "Track order — StitchNaija" },
      { name: "description", content: "Track a client order through the StitchNaija studio pipeline." },
      { property: "og:title", content: "Track order — StitchNaija" },
      { property: "og:description", content: "Live order status from received to delivered." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const STAGE_ICONS: Record<OrderStatus, LucideIcon> = {
  received: Check,
  packed: Package,
  shipped: Truck,
  delivered: PackageCheck,
};

function TrackOrder() {
  const { id } = Route.useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | undefined>(() => getOrder(id));
  const [now, setNow] = useState(Date.now());
  const [prefs, setPrefs] = useNotifPrefs();
  const lastStageRef = useRef<number>(order ? computeStageIndex(order) : -1);

  useEffect(() => {
    if (!order) return;
    const t = setInterval(() => {
      setOrder(getOrder(id));
      setNow(Date.now());
    }, 2000);
    return () => clearInterval(t);
  }, [id, order]);

  useEffect(() => {
    if (!order) return;
    const stage = computeStageIndex(order, now);
    if (stage > lastStageRef.current && lastStageRef.current >= 0) {
      const step = STATUS_STEPS[stage];
      if (prefs.push) sendPush(`Order ${order.id} · ${step.label}`, step.desc);
      toast.success(step.label, { description: step.desc });
    }
    lastStageRef.current = stage;
  }, [now, order, prefs.push]);

  if (!order) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-black">Order not found</h1>
          <p className="mt-2 text-muted-foreground">
            We couldn't find order {id}. It may be on another device.
          </p>
          <Link
            to="/orders"
            className="mt-6 inline-flex rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            See all orders
          </Link>
        </div>
      </AppShell>
    );
  }

  const stage = computeStageIndex(order, now);
  const items = orderItemsWithProducts(order);
  const timestamps = stageTimestamps(order);
  const nextIn = stage < 3 ? Math.max(0, order.stageMs - ((now - order.createdAt) % order.stageMs)) : 0;
  const eta = new Date(order.createdAt + 3 * order.stageMs + 24 * 60 * 60 * 1000);

  const togglePush = async () => {
    if (prefs.push) {
      setPrefs({ push: false });
      toast("Push notifications turned off");
      return;
    }
    const ok = await requestPushPermission();
    if (!ok) {
      toast.error("Push blocked", {
        description: "Enable notifications for this site in your browser settings.",
      });
      return;
    }
    setPrefs({ push: true });
    sendPush("Notifications on", `We'll ping you as ${order.id} moves along.`);
  };

  const onAdvance = () => {
    advanceStage(order.id);
    const updated = getOrder(order.id);
    setOrder(updated);
    setNow(Date.now());
  };

  const step = STATUS_STEPS[stage];
  const waMessage = `Hi 👋 checking on order ${order.id} (status: ${step.label}). Tracking: ${order.courier.trackingCode}`;
  const waHref = buildWhatsAppLink(prefs.whatsappNumber || "2348000000000", waMessage);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <button
          onClick={() => router.history.back()}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </button>

        <header className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald">
              Order {order.id}
            </p>
            <h1 className="font-display text-3xl font-black md:text-4xl">{step.label}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.courier.name} · Tracking {order.courier.trackingCode}
            </p>
          </div>
          <div className="rounded-2xl bg-gold/20 px-4 py-3 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Estimated delivery
            </p>
            <p className="font-display text-lg font-black">
              {eta.toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric" })}
            </p>
          </div>
        </header>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            {/* Timeline */}
            <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-black">Live tracking</h2>
                {stage < 3 && (
                  <span className="text-xs text-muted-foreground">
                    Next update in ~{Math.ceil(nextIn / 1000)}s
                  </span>
                )}
              </div>

              <ol className="relative mt-6">
                <div className="absolute left-4 top-2 bottom-2 w-px bg-border" aria-hidden />
                <div
                  className="absolute left-4 top-2 w-px bg-emerald transition-all"
                  style={{ height: `calc(${(stage / 3) * 100}% - 8px)` }}
                  aria-hidden
                />
                {STATUS_STEPS.map((s, i) => {
                  const Icon = STAGE_ICONS[s.id];
                  const done = i <= stage;
                  const active = i === stage;
                  const ts = timestamps[i];
                  return (
                    <li key={s.id} className="relative flex gap-4 pl-0 pb-6 last:pb-0">
                      <span
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-full border-2 transition",
                          done
                            ? "border-emerald bg-emerald text-primary-foreground"
                            : "border-border bg-background text-muted-foreground",
                          active && "ring-4 ring-emerald/20",
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1 pt-1">
                        <p className={cn("font-semibold", !done && "text-muted-foreground")}>
                          {s.label}
                          {active && (
                            <span className="ml-2 rounded-full bg-emerald/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald">
                              Now
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{s.desc}</p>
                        {ts && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(ts).toLocaleString("en-NG", {
                              weekday: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>

              {stage < 3 && (
                <button
                  onClick={onAdvance}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald hover:underline"
                >
                  Simulate next update <ChevronRight className="size-3" />
                </button>
              )}
            </div>

            {/* Items */}
            <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
              <h2 className="font-display text-lg font-black">In this order</h2>
              <ul className="mt-4 space-y-3">
                {items.map((i) => (
                  <li key={i.productId + i.size} className="flex gap-3">
                    <img
                      src={i.product?.image}
                      alt=""
                      className="size-16 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{i.product?.name ?? "Item"}</p>
                      <p className="text-xs text-muted-foreground">
                        Size {i.size} · Qty {i.qty}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatNaira(i.priceAtPurchase * i.qty)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
                <Row label="Subtotal" value={formatNaira(order.subtotal)} />
                <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatNaira(order.shipping)} />
                <Row label="Total" value={formatNaira(order.total)} bold />
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            {/* Notification prefs */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display text-lg font-black">Stay updated</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Get pinged the moment this order moves.
              </p>

              <button
                onClick={togglePush}
                className={cn(
                  "mt-4 flex w-full items-center gap-3 rounded-xl border p-3 text-left transition",
                  prefs.push
                    ? "border-emerald bg-emerald/5"
                    : "border-border hover:border-emerald/60",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-full",
                    prefs.push ? "bg-emerald text-primary-foreground" : "bg-muted",
                  )}
                >
                  {prefs.push ? <Bell className="size-4" /> : <BellOff className="size-4" />}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">Push notifications</span>
                  <span className="block text-xs text-muted-foreground">
                    {prefs.push ? "Enabled on this device" : "Tap to enable browser alerts"}
                  </span>
                </span>
              </button>

              <div className="mt-3 rounded-xl border border-border p-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={prefs.whatsapp}
                    onChange={(e) => setPrefs({ whatsapp: e.target.checked })}
                    className="size-4 accent-emerald"
                  />
                  <span className="text-sm font-semibold">WhatsApp updates</span>
                </label>
                {prefs.whatsapp && (
                  <input
                    type="tel"
                    value={prefs.whatsappNumber}
                    onChange={(e) => setPrefs({ whatsappNumber: e.target.value })}
                    placeholder="+234 801 234 5678"
                    className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40"
                  />
                )}
              </div>

              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-2.5 text-sm font-semibold text-white hover:brightness-95"
              >
                <MessageCircle className="size-4" />
                Chat client on WhatsApp
              </a>
            </div>

            {/* Delivery */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display text-lg font-black flex items-center gap-2">
                <MapPin className="size-4 text-emerald" /> Delivery to
              </h2>
              <p className="mt-3 text-sm">
                <span className="font-semibold">{order.contact.name}</span>
                <br />
                {order.address.street}
                <br />
                {order.address.city}, {order.address.state}
                <br />
                <span className="text-muted-foreground">{order.contact.phone}</span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <span className={bold ? "font-display text-lg font-black" : "font-medium"}>{value}</span>
    </div>
  );
}
