/**
 * Shared visual for the StitchNaija splash surfaces.
 * Deep emerald canvas, gold stitch ring drawing itself around the monogram,
 * and a thread-pull progress bar.
 */
export function SplashArt({
  progress,
  caption = "Setting up your studio",
  footer,
  children,
}: {
  progress: number;
  caption?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gradient-splash px-6 text-center">
      {/* Fabric weave texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, oklch(0.97 0.01 95) 0 1px, transparent 1px 9px), repeating-linear-gradient(-45deg, oklch(0.97 0.01 95) 0 1px, transparent 1px 9px)",
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(75% 55% at 50% 42%, transparent, oklch(0.08 0.02 155 / 0.75))",
        }}
      />

      <div className="relative flex flex-col items-center">
        {/* Stitch rings + monogram */}
        <div className="relative grid size-44 place-items-center">
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 splash-ring-spin"
            aria-hidden="true"
          >
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="oklch(0.75 0.13 85 / 0.55)"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="splash-stitch-path"
            />
            <circle
              cx="100"
              cy="100"
              r="78"
              fill="none"
              stroke="oklch(0.97 0.01 95 / 0.14)"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
          </svg>
          <svg viewBox="0 0 200 200" className="absolute inset-0" aria-hidden="true">
            <circle
              cx="100"
              cy="100"
              r="64"
              fill="none"
              stroke="oklch(0.5 0.1 160 / 0.6)"
              strokeWidth="1.5"
              strokeDasharray="10 12"
            />
          </svg>

          <span className="relative grid size-24 place-items-center overflow-hidden rounded-[1.75rem] gradient-emerald splash-breathe ring-1 ring-gold/40">
            <span className="font-display text-5xl font-black text-cream">S</span>
            <span
              aria-hidden="true"
              className="absolute inset-y-0 -left-1/2 w-1/2 splash-sheen bg-cream/25 blur-md"
            />
          </span>

          {/* Needle bead */}
          <span
            aria-hidden="true"
            className="absolute right-1 top-4 size-2.5 rounded-full bg-gold shadow-[0_0_14px_3px_oklch(0.75_0.13_85/0.5)]"
          />
        </div>

        <h1
          className="mt-9 font-display text-4xl font-black tracking-tight text-cream splash-rise"
          style={{ animationDelay: "120ms" }}
        >
          Stitch<span className="text-gradient-gold">Naija</span>
        </h1>
        <span
          aria-hidden="true"
          className="mt-3 block h-[2px] w-24 rounded-full splash-rise"
          style={{
            animationDelay: "220ms",
            background:
              "linear-gradient(90deg, transparent, var(--gold), transparent)",
          }}
        />
        <p
          className="mt-4 max-w-[17rem] text-sm leading-relaxed text-cream/70 splash-rise"
          style={{ animationDelay: "300ms" }}
        >
          The tailor's workspace — clients, orders, measurements and growth in one place.
        </p>
      </div>

      {/* Thread progress */}
      <div
        className="relative mt-12 w-full max-w-[240px] splash-rise"
        style={{ animationDelay: "400ms" }}
      >
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-cream/12">
          <div
            className="h-full rounded-full gradient-gold transition-[width] duration-75 ease-linear"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-cream/55">
          {caption}
        </p>
      </div>

      {children}

      <div className="absolute bottom-8 text-[11px] uppercase tracking-[0.22em] text-cream/40">
        {footer ?? "Made in Lagos"}
      </div>
    </div>
  );
}
