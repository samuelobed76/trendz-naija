import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/splash")({
  component: SplashScreen,
});

const DURATION_MS = 2600;

function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const next = Math.min((elapsed / DURATION_MS) * 100, 100);
      setProgress(next);
      if (next < 100) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    const skipTimer = window.setTimeout(() => setShowSkip(true), 900);
    const navTimer = window.setTimeout(() => {
      navigate({ to: "/", replace: true });
    }, DURATION_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(skipTimer);
      window.clearTimeout(navTimer);
    };
  }, [navigate]);

  const goHome = () => navigate({ to: "/", replace: true });

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6 text-center"
      role="status"
      aria-live="polite"
      aria-label="StyleNaija splash screen"
    >
      <div className="flex flex-col items-center">
        <div className="relative">
          <span className="grid size-20 place-items-center rounded-3xl gradient-warm text-primary-foreground shadow-2xl shadow-primary/25 animate-pulse">
            <span className="font-display text-4xl font-black">S</span>
          </span>
          <span className="absolute -bottom-2 -right-2 grid size-7 place-items-center rounded-full bg-accent text-accent-foreground">
            <span className="block size-2.5 rounded-full bg-foreground" />
          </span>
        </div>

        <h1 className="mt-8 font-display text-3xl font-black tracking-tight">
          Style<span className="text-gradient-warm">Naija</span>
        </h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Confident fashion, made for your body, your occasion, your weather.
        </p>
      </div>

      <div className="mt-12 w-full max-w-[220px]">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-75 ease-linear"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
        <p className="mt-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Loading your styles…
        </p>
      </div>

      {showSkip && (
        <button
          onClick={goHome}
          className="mt-10 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
        >
          Tap to continue
        </button>
      )}

      <div className="absolute bottom-8 text-xs text-muted-foreground">
        Made in Lagos · {new Date().getFullYear()}
      </div>
    </div>
  );
}
