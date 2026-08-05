import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, PackageSearch, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { formatNaira } from "@/lib/products";
import { computeStageIndex, loadOrders, STATUS_STEPS, type Order } from "@/lib/orders";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  head: () => ({
    meta: [
      { title: "Orders — StitchNaija" },
      { name: "description", content: "Manage every order in your StitchNaija studio." },
      { property: "og:title", content: "Orders — StitchNaija" },
      { property: "og:description", content: "Track and manage client orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
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
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-black md:text-4xl">Orders</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Every piece, from first cut to final delivery.
            </p>
          </div>
          <Link
            to="/clients"
            className="inline-flex items-center gap-1 rounded-full bg-emerald px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> New order
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <PackageSearch className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-4 font-display text-xl font-black">No orders yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a client and create your first order.
            </p>
            <Link
              to="/clients"
              className="mt-6 inline-flex rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Add a client
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
                    className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition hover:border-emerald/60 hover:shadow-sm"
                  >
                    <div className="flex -space-x-2">
                      {o.items.slice(0, 3).map((i) => (
                        <span
                          key={i.productId + i.size}
                          className="size-12 shrink-0 overflow-hidden rounded-full border-2 border-card bg-muted"
                        />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-widest text-emerald">
                        {o.id}
                      </p>
                      <p className="truncate font-display text-lg font-black">{step.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        · {o.contact.name} · {o.items.reduce((n, i) => n + i.qty, 0)} items ·{" "}
                        {formatNaira(o.total)}
                      </p>
                      <div className="mt-2 flex gap-1">
                        {STATUS_STEPS.map((_, i) => (
                          <span
                            key={i}
                            className={`h-1.5 flex-1 rounded-full ${
                              i <= stage ? "bg-emerald" : "bg-muted"
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
