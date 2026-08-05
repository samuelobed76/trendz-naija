import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Plus, Ruler, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { ProductCard } from "@/components/store/ProductCard";
import { formatNaira, getProduct, relatedProducts, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product, related: relatedProducts(params.id) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — StitchNaija` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — StitchNaija` },
          { property: "og:description", content: loaderData.product.description },
        ]
      : [{ title: "Product — StitchNaija" }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-black">Product not found</h1>
        <p className="mt-2 text-muted-foreground">This piece may be sold out or unavailable.</p>
        <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
          Back to shop
        </Link>
      </div>
    </AppShell>
  ),
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const { addToCart, toggleWishlist, isWished } = useStore();
  const [size, setSize] = useState(product.sizes[Math.min(1, product.sizes.length - 1)]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);

  const wished = isWished(product.id);

  const onAdd = () => {
    addToCart(product.id, size, qty);
    toast.success(`Added to bag`, {
      description: `${product.name} · Size ${size} · Qty ${qty}`,
    });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link> ·{" "}
          <Link to="/shop" className="hover:text-primary">Shop</Link> ·{" "}
          <Link to="/shop" search={{ category: product.category } as never} className="hover:text-primary">
            {product.category}
          </Link>
        </nav>

        <div className="mt-4 grid gap-8 md:grid-cols-2">
          <div>
            <button
              onClick={() => setZoom((z) => !z)}
              className="relative block w-full overflow-hidden rounded-3xl bg-muted"
              aria-label="Zoom image"
            >
              <img
                src={product.image}
                alt={product.name}
                width={900}
                height={1100}
                className={cn(
                  "aspect-[4/5] w-full object-cover transition-transform duration-500",
                  zoom && "scale-150",
                )}
              />
              <span className="absolute bottom-3 right-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
                {zoom ? "Tap to shrink" : "Tap to zoom"}
              </span>
            </button>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[product.image, product.image, product.image, product.image].map((src, i) => (
                <div key={i} className="relative overflow-hidden rounded-xl bg-muted">
                  <img src={src} alt="" loading="lazy" className="aspect-square w-full object-cover" />
                  {i === 3 && (
                    <div className="absolute inset-0 grid place-items-center bg-foreground/40 text-xs font-semibold text-background">
                      ▶ Fabric video
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">{product.brand}</p>
            <h1 className="mt-1 font-display text-3xl font-black md:text-4xl">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 text-foreground">
                <Star className="size-4 fill-accent text-accent" /> {product.rating}
              </span>
              <span>({product.reviews} reviews)</span>
              <span>·</span>
              <span className={cn(product.stock < 10 ? "text-primary font-semibold" : "")}>
                {product.stock < 10 ? `Only ${product.stock} left` : "In stock"}
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-3xl font-black">{formatNaira(product.price)}</span>
              {product.compareAt && (
                <span className="text-base text-muted-foreground line-through">
                  {formatNaira(product.compareAt)}
                </span>
              )}
              {product.compareAt && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  Save {Math.round((1 - product.price / product.compareAt) * 100)}%
                </span>
              )}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Color · {color.name}</span>
              </div>
              <div className="mt-2 flex gap-2">
                {product.colors.map((c: { name: string; hex: string }) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c)}
                    className={cn(
                      "size-9 rounded-full border-2 transition",
                      color.name === c.name ? "border-primary" : "border-transparent",
                    )}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Size</span>
                <button className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                  <Ruler className="size-3.5" /> Size guide
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "min-w-12 rounded-lg border px-3 py-2 text-sm font-medium transition",
                      size === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button className="mt-3 inline-flex items-center gap-2 rounded-lg bg-accent/40 px-3 py-2 text-xs font-semibold text-accent-foreground hover:bg-accent/60">
                <Sparkles className="size-3.5" /> Try Virtual Fit — get your size
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-full border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid size-10 place-items-center hover:bg-muted rounded-l-full"
                  aria-label="Decrease"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="grid size-10 place-items-center hover:bg-muted rounded-r-full"
                  aria-label="Increase"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <button
                onClick={onAdd}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
              >
                Add to bag · {formatNaira(product.price * qty)}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label="Wishlist"
                className={cn(
                  "grid size-12 place-items-center rounded-full border border-border hover:border-primary",
                  wished && "bg-primary/10 border-primary",
                )}
              >
                <Heart className={cn("size-5", wished && "fill-primary text-primary")} />
              </button>
            </div>

            <ul className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-4 text-sm">
              <li className="flex items-center gap-3">
                <Truck className="size-4 text-primary" /> Free Lagos delivery over ₦50,000
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="size-4 text-primary" /> 14-day returns · easy exchange
              </li>
              <li className="flex items-center gap-3">
                <Sparkles className="size-4 text-primary" /> Made in Nigeria · {product.material}
              </li>
            </ul>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-black">What customers are saying</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {SAMPLE_REVIEWS.map((r) => (
              <div key={r.name} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("size-4", i < r.stars ? "fill-accent" : "text-muted")} />
                  ))}
                </div>
                <p className="mt-2 text-sm">{r.text}</p>
                <p className="mt-3 text-xs font-semibold">{r.name} · {r.location}</p>
                <p className="text-[11px] text-muted-foreground">Size purchased: {r.size}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-black">You may also love</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

const SAMPLE_REVIEWS = [
  {
    name: "Ngozi A.",
    location: "Lekki, Lagos",
    stars: 5,
    size: "M",
    text: "Fabric quality is unreal. I wore this to my sister's introduction and got so many compliments.",
  },
  {
    name: "Tolu O.",
    location: "Ikeja, Lagos",
    stars: 4,
    size: "L",
    text: "Fits true to size. The color pops even more in real life.",
  },
  {
    name: "Chinedu M.",
    location: "Abuja",
    stars: 5,
    size: "XL",
    text: "Arrived in 2 days. Packaging was beautiful and the piece was worth every naira.",
  },
];