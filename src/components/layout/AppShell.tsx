import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Home, Menu, Scissors, Search, ShoppingBag, User, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/products";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}

function Header() {
  const { cartCount, wishlist } = useStore();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <button
          className="md:hidden -ml-2 rounded-md p-2 text-foreground/80 hover:bg-muted"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-full gradient-warm text-primary-foreground font-display font-black">
            S
          </span>
          <span className="font-display text-xl font-black tracking-tight">
            Style<span className="text-primary">Naija</span>
          </span>
        </Link>
        <nav className="hidden md:flex ml-6 items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/shop" className="hover:text-primary transition-colors">
            Shop
          </Link>
          <Link to="/tailors" className="hover:text-primary transition-colors">
            Tailors
          </Link>
          {CATEGORIES.slice(0, 4).map((c) => (
            <Link
              key={c}
              to="/shop"
              search={{ category: c } as never}
              className="hover:text-primary transition-colors"
            >
              {c}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Link
            to="/shop"
            className="hidden sm:grid size-10 place-items-center rounded-full hover:bg-muted"
            aria-label="Search"
          >
            <Search className="size-5" />
          </Link>
          <Link
            to="/wishlist"
            className="relative grid size-10 place-items-center rounded-full hover:bg-muted"
            aria-label="Wishlist"
          >
            <Heart className="size-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className="relative grid size-10 place-items-center rounded-full hover:bg-muted"
            aria-label="Cart"
          >
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/account"
            className="hidden sm:grid size-10 place-items-center rounded-full hover:bg-muted"
            aria-label="Account"
          >
            <User className="size-5" />
          </Link>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-3 text-sm font-medium">
            <Link to="/" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-muted">
              Home
            </Link>
            <Link to="/shop" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-muted">
              Shop all
            </Link>
            <Link to="/tailors" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-muted">
              Find tailors
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                to="/shop"
                search={{ category: c } as never}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 hover:bg-muted"
              >
                {c}
              </Link>
            ))}
            <Link to="/account" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-muted">
              Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { cartCount } = useStore();
  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/shop", label: "Shop", icon: Search },
    { to: "/tailors", label: "Tailors", icon: Scissors },
    { to: "/cart", label: "Cart", icon: ShoppingBag, badge: cartCount },
    { to: "/account", label: "Me", icon: User },
  ] as const;
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-border bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const active = it.to === "/" ? path === "/" : path.startsWith(it.to);
          const Icon = it.icon;
          return (
            <li key={it.to}>
              <Link
                to={it.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium relative",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className="relative">
                  <Icon className="size-5" />
                  {"badge" in it && it.badge && it.badge > 0 ? (
                    <span className="absolute -top-1 -right-2 grid size-4 place-items-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
                      {it.badge}
                    </span>
                  ) : null}
                </span>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="hidden md:block border-t border-border bg-muted/40 mt-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full gradient-warm text-primary-foreground font-display font-black">
              S
            </span>
            <span className="font-display text-xl font-black">
              Style<span className="text-primary">Naija</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Confident fashion made for Nigerian bodies, occasions, and weather.
          </p>
        </div>
        <FooterCol title="Shop" links={["Women", "Men", "Kids", "Shoes", "House Wears", "Suits"]} />
        <FooterCol title="Help" links={["Size guide", "Shipping", "Returns", "Track order", "WhatsApp support"]} />
        <FooterCol title="Company" links={["About", "Journal", "Sustainability", "Careers"]} />
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} StyleNaija. Made in Lagos.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-bold uppercase tracking-wider">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l}>
            <a className="hover:text-foreground transition-colors" href="#">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}