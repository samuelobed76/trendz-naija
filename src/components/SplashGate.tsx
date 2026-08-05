import { useEffect, useState, type ReactNode } from "react";

const DURATION_MS = 2200;
const KEY = "stitchnaija.splash.seen";

export function SplashGate({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.sessionStorage.getItem(KEY)) return;
    window.sessionStorage.setItem(KEY, "1");
    setShow(true);

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const next = Math.min(((now - start) / DURATION_MS) * 100, 100);
      setProgress(next);
      if (next < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const timer = window.setTimeout(() => setShow(false), DURATION_MS);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {children}
      {show && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background px-6 text-center"
          role="status"
          aria-live="polite"
          aria-label="StitchNaija splash screen"
          onClick={() => setShow(false)}
        >
          <span className="grid size-20 place-items-center rounded-3xl gradient-emerald text-primary-foreground shadow-2xl shadow-emerald/25 animate-pulse">
            <span className="font-display text-4xl font-black">S</span>
          </span>
          <h1 className="mt-8 font-display text-3xl font-black tracking-tight">
            Stitch<span className="text-emerald">Naija</span>
          </h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            The workspace for Nigerian tailors and fashion designers.
          </p>
          <div className="mt-10 w-full max-w-[220px]">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald transition-[width] duration-75 ease-linear"
                style={{ width: `${progress}%` }}
                aria-hidden="true"
              />
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Preparing your studio…
            </p>
          </div>
          <div className="absolute bottom-8 text-xs text-muted-foreground">
            Tap to continue · Made in Lagos
          </div>
        </div>
      )}
    </>
  );
}
