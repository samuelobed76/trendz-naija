import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Heart, LogIn, MapPin, Package, Ruler, User } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({ meta: [{ title: "Account — StyleNaija" }] }),
});

function AccountPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
        <div className="rounded-3xl gradient-warm p-6 text-primary-foreground md:p-10">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-full bg-background/20 backdrop-blur">
              <User className="size-7" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Welcome</p>
              <h1 className="font-display text-2xl font-black md:text-3xl">Sign in to StyleNaija</h1>
              <p className="text-sm opacity-90">Save your sizes, addresses and reorder in seconds.</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-2.5 text-sm font-semibold text-foreground">
              <LogIn className="size-4" /> Sign in
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-background/60 px-5 py-2.5 text-sm font-semibold">
              Create account
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Tile icon={Package} title="Orders" desc="Track and reorder past pieces" />
          <Tile icon={Ruler} title="My sizes" desc="Save your measurements for accurate fits" />
          <Tile icon={MapPin} title="Addresses" desc="Manage delivery locations" />
          <Tile icon={Heart} title="Wishlist" desc="Your saved styles" href="/wishlist" />
          <Tile icon={Bell} title="Notifications" desc="New drops, sales and order updates" />
        </div>
      </div>
    </AppShell>
  );
}

function Tile({
  icon: Icon,
  title,
  desc,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary transition">
      <div className="grid size-11 place-items-center rounded-full bg-accent/40">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
  return href ? <Link to={href}>{inner}</Link> : <button className="text-left">{inner}</button>;
}