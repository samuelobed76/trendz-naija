import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SplashArt } from "@/components/SplashArt";

export const Route = createFileRoute("/splash")({
  component: SplashScreen,
  head: () => ({
    meta: [
      { title: "Welcome to StitchNaija" },
      {
        name: "description",
        content:
          "StitchNaija is loading — the workspace for Nigerian tailors and fashion designers.",
      },
      { property: "og:title", content: "Welcome to StitchNaija" },
      {
        property: "og:description",
        content: "The workspace for Nigerian tailors and fashion designers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
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
      const next = Math.min(((now - start) / DURATION_MS) * 100, 100);
      setProgress(next);
      if (next < 100) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    const skipTimer = window.setTimeout(() => setShowSkip(true), 900);
    const navTimer = window.setTimeout(() => navigate({ to: "/", replace: true }), DURATION_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(skipTimer);
      window.clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div
      className="fixed inset-0 z-50"
      role="status"
      aria-live="polite"
      aria-label="StitchNaija splash screen"
    >
      <SplashArt
        progress={progress}
        caption="Setting up your studio"
        footer={`Made in Lagos · ${new Date().getFullYear()}`}
      >
        {showSkip && (
          <button
            onClick={() => navigate({ to: "/", replace: true })}
            className="mt-9 rounded-full border border-cream/25 px-6 py-2.5 text-sm font-semibold text-cream/90 backdrop-blur transition hover:border-gold/60 hover:text-gold"
          >
            Enter studio
          </button>
        )}
      </SplashArt>
    </div>
  );
}
