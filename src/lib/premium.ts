import { useCallback, useEffect, useState } from "react";

export type PlanId = "monthly" | "yearly";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  period: string;
  note: string;
  save?: string;
}

export const PLANS: Plan[] = [
  {
    id: "monthly",
    name: "Prime Monthly",
    price: 4500,
    period: "/month",
    note: "Cancel anytime, no wahala.",
  },
  {
    id: "yearly",
    name: "Prime Yearly",
    price: 39000,
    period: "/year",
    note: "Billed once a year.",
    save: "Save ₦15,000",
  },
];

export const PREMIUM_PERKS = [
  {
    title: "Free nationwide delivery",
    desc: "Unlimited free shipping on every order, Lagos to Kano.",
  },
  {
    title: "Priority tailor chat",
    desc: "Your messages jump the queue — designers reply you first.",
  },
  {
    title: "Early access to drops",
    desc: "Shop owambe collections 48 hours before everyone else.",
  },
  {
    title: "Free personal styling",
    desc: "Monthly 1-on-1 session with a StitchNaija stylist.",
  },
  {
    title: "Prime pricing",
    desc: "Extra 10% off sale items and bespoke tailoring fees.",
  },
  {
    title: "Free size & fit re-check",
    desc: "Complimentary alterations on any Prime purchase.",
  },
];

export interface Membership {
  active: boolean;
  plan: PlanId | null;
  since: number | null;
  renewsAt: number | null;
}

const KEY = "stylenaija.premium.v1";
const INACTIVE: Membership = { active: false, plan: null, since: null, renewsAt: null };

export function loadMembership(): Membership {
  if (typeof window === "undefined") return INACTIVE;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Membership) : INACTIVE;
  } catch {
    return INACTIVE;
  }
}

function save(m: Membership) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(m));
  window.dispatchEvent(new CustomEvent("stylenaija:premium"));
}

export function subscribe(plan: PlanId): Membership {
  const now = Date.now();
  const days = plan === "yearly" ? 365 : 30;
  const m: Membership = {
    active: true,
    plan,
    since: now,
    renewsAt: now + days * 86_400_000,
  };
  save(m);
  return m;
}

export function cancelMembership() {
  save(INACTIVE);
}

export function usePremium() {
  const [membership, setMembership] = useState<Membership>(INACTIVE);
  useEffect(() => {
    setMembership(loadMembership());
    const sync = () => setMembership(loadMembership());
    window.addEventListener("stylenaija:premium", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("stylenaija:premium", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const start = useCallback((plan: PlanId) => setMembership(subscribe(plan)), []);
  const stop = useCallback(() => {
    cancelMembership();
    setMembership(INACTIVE);
  }, []);

  return { membership, start, stop } as const;
}