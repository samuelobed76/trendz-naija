import { useEffect, useState, type ReactNode } from "react";
import { SplashArt } from "@/components/SplashArt";

const DURATION_MS = 2400;
const KEY = "stitchnaija.splash.seen";

export function SplashGate({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
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

    const fade = window.setTimeout(() => setLeaving(true), DURATION_MS);
    const timer = window.setTimeout(() => setShow(false), DURATION_MS + 450);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fade);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {children}
      {show && (
        <div
          className={`fixed inset-0 z-[100] transition-opacity duration-450 ${
            leaving ? "opacity-0" : "opacity-100"
          }`}
          role="status"
          aria-live="polite"
          aria-label="StitchNaija splash screen"
          onClick={() => setLeaving(true)}
        >
          <SplashArt progress={progress} caption="Preparing your studio" footer="Tap to continue" />
        </div>
      )}
    </>
  );
}
