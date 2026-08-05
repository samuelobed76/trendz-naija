import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Banknote, CreditCard, Truck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { formatNaira, getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";
import { createOrder } from "@/lib/orders";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({ meta: [{ title: "Checkout — StitchNaija" }] }),
});

type Pay = "card" | "transfer" | "cod";

function Checkout() {
  const { cart, clearCart } = useStore();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const items = cart
    .map((i) => ({ ...i, product: getProduct(i.productId) }))
    .filter((i): i is typeof i & { product: NonNullable<typeof i.product> } => !!i.product);

  const [pay, setPay] = useState<Pay>("card");
  const [state, setState] = useState("Lagos");
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = state === "Lagos" ? (subtotal > 50000 ? 0 : 2500) : 5500;
  const total = subtotal + shipping;

  const onPlace = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const order = createOrder({
      items: items.map((i) => ({
        productId: i.productId,
        size: i.size,
        qty: i.qty,
        priceAtPurchase: i.product.price,
      })),
      subtotal,
      shipping,
      total,
      contact: {
        name: String(fd.get("name") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        email: String(fd.get("email") ?? ""),
      },
      address: {
        street: String(fd.get("street") ?? ""),
        city: String(fd.get("city") ?? ""),
        state,
      },
      payment: pay,
    });
    toast.success("Order placed!", {
      description: `Tracking ${order.id} — updates on the way.`,
    });
    clearCart();
    void navigate({ to: "/orders/$id", params: { id: order.id } });
  };

  if (items.length === 0) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-black">Your bag is empty</h1>
          <p className="mt-2 text-muted-foreground">Add items before checking out.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <h1 className="font-display text-3xl font-black md:text-4xl">Checkout</h1>
        <form ref={formRef} onSubmit={onPlace} className="mt-6 grid gap-8 md:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card title="Contact">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Full name" name="name" placeholder="Adaeze Okafor" required />
                <Field label="Phone" name="phone" placeholder="+234 801 234 5678" required />
                <div className="md:col-span-2">
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
            </Card>

            <Card title="Delivery address">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Field
                    label="Street address"
                    name="street"
                    placeholder="14 Awolowo Road"
                    required
                  />
                </div>
                <Field label="City" name="city" placeholder="Ikoyi" required />
                <label className="grid gap-1 text-sm">
                  <span className="font-medium">State</span>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
                  >
                    {["Lagos", "Abuja", "Rivers", "Oyo", "Kano", "Enugu", "Kaduna"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="mt-3 flex items-center gap-2 rounded-lg bg-accent/30 p-3 text-xs">
                <Truck className="size-4 text-primary" />
                {state === "Lagos"
                  ? "Same-day delivery available in Lagos for orders before 2pm."
                  : `Nationwide delivery to ${state}: 2–4 business days.`}
              </p>
            </Card>

            <Card title="Payment">
              <div className="grid gap-2">
                <PayOption
                  id="card"
                  value={pay}
                  onChange={setPay}
                  icon={CreditCard}
                  title="Card"
                  desc="Secure card payment via Paystack"
                />
                <PayOption
                  id="transfer"
                  value={pay}
                  onChange={setPay}
                  icon={Banknote}
                  title="Bank transfer"
                  desc="Pay to a one-time account, order ships on confirmation"
                />
                <PayOption
                  id="cod"
                  value={pay}
                  onChange={setPay}
                  icon={Truck}
                  title="Cash on delivery"
                  desc="Pay when your order arrives (Lagos only)"
                />
              </div>
            </Card>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5 md:sticky md:top-20">
            <h2 className="font-display text-xl font-black">Summary</h2>
            <ul className="space-y-3 max-h-64 overflow-auto">
              {items.map((i) => (
                <li key={i.productId + i.size} className="flex gap-3">
                  <img src={i.product.image} alt="" className="size-14 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="truncate font-medium">{i.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Size {i.size} · Qty {i.qty}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{formatNaira(i.product.price * i.qty)}</p>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-border pt-3 text-sm">
              <Row label="Subtotal" value={formatNaira(subtotal)} />
              <Row label="Shipping" value={shipping === 0 ? "Free" : formatNaira(shipping)} />
              <Row label="Total" value={formatNaira(total)} bold />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
            >
              Place order · {formatNaira(total)}
            </button>
            <p className="text-center text-xs text-muted-foreground">SSL secured checkout</p>
          </aside>
        </form>
      </div>
    </AppShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="font-display text-lg font-black">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  type = "text",
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <input
        type={type}
        className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        {...rest}
      />
    </label>
  );
}

function PayOption({
  id,
  value,
  onChange,
  icon: Icon,
  title,
  desc,
}: {
  id: Pay;
  value: Pay;
  onChange: (v: Pay) => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  const active = value === id;
  return (
    <button
      type="button"
      onClick={() => onChange(id)}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition",
        active ? "border-primary bg-primary/5" : "border-border hover:border-primary/60",
      )}
    >
      <span
        className={cn(
          "grid size-10 place-items-center rounded-full",
          active ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
      <span
        className={cn(
          "grid size-5 place-items-center rounded-full border",
          active ? "border-primary bg-primary" : "border-border",
        )}
      >
        {active && <span className="size-2 rounded-full bg-primary-foreground" />}
      </span>
    </button>
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
