import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProductCard } from "@/components/store/ProductCard";
import { PRODUCTS } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({ meta: [{ title: "Saved — StitchNaija" }] }),
});

function WishlistPage() {
  const { wishlist } = useStore();
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
        <h1 className="font-display text-3xl font-black md:text-4xl">Saved for later</h1>
        <p className="text-sm text-muted-foreground">{items.length} pieces</p>

        {items.length === 0 ? (
          <div className="mt-10 grid place-items-center rounded-3xl border border-dashed border-border py-20 text-center">
            <Heart className="size-10 text-muted-foreground" />
            <p className="mt-3 font-semibold">No saves yet</p>
            <p className="text-sm text-muted-foreground">Tap the heart on any piece to save it here.</p>
            <Link to="/shop" className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
              Explore the shop
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}