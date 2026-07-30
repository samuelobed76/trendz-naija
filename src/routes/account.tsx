import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, Crown, Heart, LogIn, LogOut, MapPin, MessagesSquare, Package, Ruler, User } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({ meta: [{ title: "Account — StyleNaija" }] }),
});

function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const name =
    (user?.user_metadata?.full_name as string | undefined) || user?.email?.split("@")[0] || "";

  const onSignOut = async () => {
    await signOut();
    toast("Signed out", { description: "See you soon 👋" });
    navigate({ to: "/", replace: true });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
        <div className="rounded-3xl gradient-warm p-6 text-primary-foreground md:p-10">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-full bg-background/20 backdrop-blur">
              <User className="size-7" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
                {user ? "Signed in" : "Welcome"}
              </p>
              <h1 className="truncate font-display text-2xl font-black md:text-3xl">
                {user ? `Hey, ${name}` : "Sign in to StyleNaija"}
              </h1>
              <p className="truncate text-sm opacity-90">
                {user ? user.email : "Save your sizes, addresses and reorder in seconds."}
              </p>
            </div>
          </div>
          {!loading && (
            <div className="mt-5 flex flex-wrap gap-2">
              {user ? (
                <button
                  onClick={onSignOut}
                  className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-2.5 text-sm font-semibold text-foreground"
                >
                  <LogOut className="size-4" /> Sign out
                </button>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-2.5 text-sm font-semibold text-foreground"
                  >
                    <LogIn className="size-4" /> Sign in
                  </Link>
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-2 rounded-full border border-background/60 px-5 py-2.5 text-sm font-semibold"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Tile icon={Package} title="Orders" desc="Track and reorder past pieces" href="/orders" />
          <Tile icon={Crown} title="StyleNaija Prime" desc="Free delivery, priority chat, early drops" href="/premium" />
          <Tile icon={MessagesSquare} title="Messages" desc="Chat your tailors and designers" href="/chat" />
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