import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TAILORS, NIGERIAN_CITIES, CITY_COORDS, distanceKm, type Tailor } from "@/lib/tailors";
import { MapPin, Star, MessageCircle, Loader2, Navigation, Scissors, MessagesSquare } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tailors")({
  head: () => ({
    meta: [
      { title: "Find Tailors & Designers Near You — StitchNaija" },
      {
        name: "description",
        content:
          "Discover trusted Nigerian tailors and fashion designers close to you. Filter by specialty, city and distance, then message on WhatsApp.",
      },
      { property: "og:title", content: "Find Tailors & Designers Near You — StitchNaija" },
      {
        property: "og:description",
        content:
          "Bespoke aso-ebi, suits, adire, kaftans and shoes from vetted Nigerian designers near your location.",
      },
    ],
  }),
  component: TailorsPage,
});

type Coords = { lat: number; lng: number };

function TailorsPage() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locStatus, setLocStatus] = useState<"idle" | "loading" | "granted" | "denied">("idle");
  const [city, setCity] = useState<string>("");
  const [specialty, setSpecialty] = useState<string>("");

  const specialties = useMemo(
    () => Array.from(new Set(TAILORS.flatMap((t) => t.tags))).sort(),
    [],
  );

  useEffect(() => {
    // Auto-attempt geolocation once on mount
    if (typeof window === "undefined" || !("geolocation" in navigator)) return;
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function requestLocation() {
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus("granted");
        toast.success("Location detected — showing tailors nearest to you");
      },
      () => {
        setLocStatus("denied");
        toast.error("Couldn't get location — pick your city instead");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  }

  const origin: Coords | null = coords ?? (city ? CITY_COORDS[city] ?? null : null);

  const results = useMemo(() => {
    let list: (Tailor & { distance?: number })[] = TAILORS.map((t) => ({
      ...t,
      distance: origin ? distanceKm(origin, { lat: t.lat, lng: t.lng }) : undefined,
    }));
    if (city) list = list.filter((t) => t.city === city);
    if (specialty) list = list.filter((t) => t.tags.includes(specialty));
    if (origin) list.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
    return list;
  }, [origin, city, specialty]);

  return (
    <AppShell>
      {/* Hero */}
      <section className="gradient-emerald text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Scissors className="size-3.5" /> Bespoke & Local
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-black leading-tight max-w-2xl">
            Find tailors & designers near you
          </h1>
          <p className="mt-3 max-w-xl text-sm md:text-base text-primary-foreground/90">
            From aso-ebi in Lagos to kaftans in Abuja — connect with vetted Nigerian designers,
            sorted by distance from you.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              onClick={requestLocation}
              className="inline-flex items-center gap-2 rounded-full bg-white text-foreground px-4 py-2 text-sm font-semibold hover:bg-white/90"
            >
              {locStatus === "loading" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Navigation className="size-4" />
              )}
              {coords ? "Location on" : "Use my location"}
            </button>
            {locStatus === "denied" && (
              <span className="text-xs text-primary-foreground/90">
                Location blocked — filter by city below.
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-background sticky top-16 z-30">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 py-3">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-full border border-input bg-background px-4 py-2 text-sm font-medium"
          >
            <option value="">All cities</option>
            {NIGERIAN_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="rounded-full border border-input bg-background px-4 py-2 text-sm font-medium"
          >
            <option value="">All specialties</option>
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="ml-auto text-sm text-muted-foreground self-center">
            {results.length} designer{results.length === 1 ? "" : "s"}
            {origin ? " · sorted by distance" : ""}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground">No designers match those filters yet.</p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((t) => (
              <TailorCard key={t.id} t={t} />
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}

function TailorCard({ t }: { t: Tailor & { distance?: number } }) {
  return (
    <li className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={t.image}
          alt={t.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {t.distance !== undefined && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
            {t.distance < 1 ? "<1" : t.distance.toFixed(1)} km away
          </span>
        )}
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-foreground/85 px-2.5 py-1 text-xs font-semibold text-background">
          <Star className="size-3 fill-current" /> {t.rating}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold leading-tight">{t.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{t.specialty}</p>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" /> {t.address}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {t.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground/80"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
          <div className="text-sm">
            <div className="font-semibold">
              from ₦{t.priceFrom.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">{t.turnaround} · {t.reviews} reviews</div>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href={`https://wa.me/${t.whatsapp}?text=${encodeURIComponent(
                `Hi ${t.name}, I found you on StyleNaija and would love to discuss a piece.`,
              )}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`Chat ${t.name} on WhatsApp`}
              className="grid size-9 place-items-center rounded-full border border-border hover:bg-muted"
            >
              <MessageCircle className="size-4" />
            </a>
            <Link
              to="/chat/$tailorId"
              params={{ tailorId: t.id }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <MessagesSquare className="size-3.5" /> Message
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}