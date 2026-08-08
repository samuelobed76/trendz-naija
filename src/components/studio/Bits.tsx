import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-emerald">{eyebrow}</p>
        <h1 className="mt-1 font-display text-3xl font-black md:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Stat({
  icon: Icon,
  label,
  value,
  sub,
  tone = "emerald",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  tone?: "emerald" | "gold" | "teal";
}) {
  const tones = {
    emerald: "bg-emerald/10 text-emerald",
    gold: "bg-gold/15 text-gold",
    teal: "bg-teal/10 text-teal",
  } as const;
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className={cn("grid size-10 place-items-center rounded-xl", tones[tone])}>
        <Icon className="size-5" />
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="font-display text-2xl font-black">{value}</p>
      {sub ? <p className="text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-emerald";

export function Badge({
  tone,
  children,
}: {
  tone: "danger" | "warn" | "ok" | "muted" | "gold";
  children: ReactNode;
}) {
  const tones = {
    danger: "bg-destructive/10 text-destructive",
    warn: "bg-gold/20 text-gold",
    ok: "bg-emerald/10 text-emerald",
    muted: "bg-muted text-muted-foreground",
    gold: "bg-gold/20 text-gold",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
      <p className="font-display text-lg font-bold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}