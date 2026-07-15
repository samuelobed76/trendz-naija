import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { formatNaira, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { isWished, toggleWishlist } = useStore();
  const wished = isWished(product.id);
  return (
    <div className="group flex flex-col">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="relative block overflow-hidden rounded-2xl bg-muted"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={900}
          height={1100}
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.new && (
            <span className="rounded-full bg-background/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              New
            </span>
          )}
          {product.onSale && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              Sale
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-background/90 backdrop-blur hover:bg-background"
        >
          <Heart className={cn("size-4", wished && "fill-primary text-primary")} />
        </button>
      </Link>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {product.brand}
          </p>
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            className="mt-0.5 block truncate text-sm font-semibold hover:text-primary"
          >
            {product.name}
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm font-bold">{formatNaira(product.price)}</span>
            {product.compareAt && (
              <span className="text-xs text-muted-foreground line-through">
                {formatNaira(product.compareAt)}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right text-[11px] text-muted-foreground">
          ★ {product.rating}
          <div>({product.reviews})</div>
        </div>
      </div>
    </div>
  );
}