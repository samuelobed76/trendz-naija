import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, PackageSearch } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { formatNaira } from "@/lib/products";
import {
  computeStageIndex,
  loadOrders,
  STATUS_STEPS,
  type Order,
} from "@/lib/orders";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  head: () => ({ meta: [{ title: "My orders — StyleNaija" }] }),
});

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    setOrders(loadOrders());
    const t = setInterval(() => setOrders(loadOrders()), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
        <h1 className="font-display text-3xl font-black md:text-4xl">My orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track every drop in real time.
        </p>

        {orders.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <PackageSearch className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-4 font-display text-xl font-black">No orders yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Place an order and it'll appear here with live tracking.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {orders.map((o) => {
              const stage = computeStageIndex(o);
              const step = STATUS_STEPS[stage];
              return (
                <li key={o.id}>
                  <Link
                    to="/orders/$id"
                    params={{ id: o.id }}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/60 hover:shadow-sm"
                  >
                    <div className="flex -space-x-2">
                      {o.items.slice(0, 3).map((i) => (
                        <span
                          key={i.productId + i.size}
                          className="size-12 shrink-0 overflow-hidden rounded-full border-2 border-card bg-muted"
                        >
                          {/* image lookup happens on the detail page */}
                        </span>
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                        {o.id}
                      </p>
                      <p className="truncate font-display text-lg font-black">
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        · {o.items.reduce((n, i) => n + i.qty, 0)} items ·{" "}
                        {formatNaira(o.total)}
                      </p>
                      <div className="mt-2 flex gap-1">
                        {STATUS_STEPS.map((_, i) => (
                          <span
                            key={i}
                            className={`h-1.5 flex-1 rounded-full ${
                              i <= stage ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="size-5 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
