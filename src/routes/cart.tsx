import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { formatNaira, getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Your bag — StitchNaija" }] }),
});

function CartPage() {
  const { cart, updateQty, removeFromCart } = useStore();
  const items = cart
    .map((i) => ({ ...i, product: getProduct(i.productId) }))
    .filter((i): i is typeof i & { product: NonNullable<typeof i.product> } => !!i.product);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal > 50000 ? 0 : subtotal > 0 ? 2500 : 0;
  const total = subtotal + shipping;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <h1 className="font-display text-3xl font-black md:text-4xl">Your bag</h1>
        {items.length === 0 ? (
          <div className="mt-10 grid place-items-center rounded-3xl border border-dashed border-border py-20 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <p className="mt-3 font-semibold">Your bag is empty</p>
            <p className="text-sm text-muted-foreground">Add pieces from the shop to get started.</p>
            <Link
              to="/shop"
              className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 md:grid-cols-[1fr_360px]">
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.productId + i.size} className="flex gap-4 rounded-2xl border border-border bg-card p-3 md:p-4">
                  <Link to="/product/$id" params={{ id: i.productId }} className="shrink-0">
                    <img
                      src={i.product.image}
                      alt={i.product.name}
                      loading="lazy"
                      className="size-24 rounded-xl object-cover md:size-28"
                    />
                  </Link>
                  <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{i.product.brand}</p>
                      <Link to="/product/$id" params={{ id: i.productId }} className="block truncate font-semibold hover:text-primary">
                        {i.product.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">Size {i.size}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center rounded-full border border-border">
                          <button
                            className="grid size-8 place-items-center hover:bg-muted rounded-l-full"
                            onClick={() => updateQty(i.productId, i.size, i.qty - 1)}
                            aria-label="Decrease"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold">{i.qty}</span>
                          <button
                            className="grid size-8 place-items-center hover:bg-muted rounded-r-full"
                            onClick={() => updateQty(i.productId, i.size, i.qty + 1)}
                            aria-label="Increase"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(i.productId, i.size)}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-bold">{formatNaira(i.product.price * i.qty)}</p>
                      <p className="text-xs text-muted-foreground">{formatNaira(i.product.price)} each</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-2xl border border-border bg-card p-5 md:sticky md:top-20">
              <h2 className="font-display text-xl font-black">Order summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={formatNaira(subtotal)} />
                <Row
                  label="Shipping (Lagos)"
                  value={shipping === 0 ? "Free" : formatNaira(shipping)}
                />
                <div className="my-3 border-t border-border" />
                <Row label="Total" value={formatNaira(total)} bold />
              </dl>
              <Link
                to="/checkout"
                className="mt-5 block rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
              >
                Checkout · {formatNaira(total)}
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Secure payment · Card, Transfer, or Cash on Delivery
              </p>
            </aside>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</dt>
      <dd className={bold ? "font-display text-lg font-black" : "font-medium"}>{value}</dd>
    </div>
  );
}