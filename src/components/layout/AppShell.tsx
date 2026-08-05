import { Link, useRouterState } from "@tanstack/react-router";
import {
  Crown,
  Home,
  LayoutDashboard,
  Menu,
  MessagesSquare,
  Package,
  Ruler,
  Scissors,
  User,
  Users,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useUnreadCount } from "@/lib/chat";
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
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <button
          className="md:hidden -ml-2 rounded-md p-2 text-foreground/80 hover:bg-muted"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-full gradient-emerald text-primary-foreground font-display font-black">
            S
          </span>
          <span className="font-display text-xl font-black tracking-tight">
            Stitch<span className="text-emerald">Naija</span>
          </span>
        </Link>
        <nav className="hidden md:flex ml-6 items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-emerald transition-colors">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-emerald transition-colors">
            Dashboard
          </Link>
          <Link to="/portfolio" className="hover:text-emerald transition-colors">
            Portfolio
          </Link>
          <Link to="/orders" className="hover:text-emerald transition-colors">
            Orders
          </Link>
          <Link to="/clients" className="hover:text-emerald transition-colors">
            Clients
          </Link>
          <Link to="/chat" className="hover:text-emerald transition-colors">
            Messages
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-1">
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
            <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-muted">
              Dashboard
            </Link>
            <Link to="/portfolio" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-muted">
              Portfolio
            </Link>
            <Link to="/orders" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-muted">
              Orders
            </Link>
            <Link to="/clients" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-muted">
              Clients
            </Link>
            <Link to="/measurements" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-muted">
              Measurements
            </Link>
            <Link to="/chat" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-muted">
              Messages
            </Link>
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
  const unread = useUnreadCount();
  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/dashboard", label: "Studio", icon: LayoutDashboard },
    { to: "/portfolio", label: "Work", icon: Scissors },
    { to: "/chat", label: "Chat", icon: MessagesSquare, badge: unread },
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
                  active ? "text-emerald" : "text-muted-foreground",
                )}
              >
                <span className="relative">
                  <Icon className="size-5" />
                  {"badge" in it && it.badge && it.badge > 0 ? (
                    <span className="absolute -top-1 -right-2 grid size-4 place-items-center rounded-full bg-emerald text-primary-foreground text-[9px] font-bold">
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
            <span className="grid size-8 place-items-center rounded-full gradient-emerald text-primary-foreground font-display font-black">
              S
            </span>
            <span className="font-display text-xl font-black">
              Stitch<span className="text-emerald">Naija</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            The workspace for Nigerian tailors and fashion designers to manage clients, orders and craft.
          </p>
        </div>
        <FooterCol title="Studio" links={["Dashboard", "Portfolio", "Orders", "Clients"]} />
        <FooterCol title="Grow" links={["Prime membership", "Reviews", "Measurements", "Chat"]} />
        <FooterCol title="Company" links={["About", "Journal", "Support", "Careers"]} />
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} StitchNaija. Made in Lagos.
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
