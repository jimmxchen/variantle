"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Light/dark switch. Defaults to the OS setting (next-themes `system`);
// clicking pins the opposite of whatever is currently showing, persisted
// in localStorage by next-themes.
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The resolved theme is unknowable server-side / at export time, so render
  // a stable placeholder until mounted to keep hydration clean.
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      role="switch"
      aria-checked={mounted ? isDark : undefined}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle color theme"}
      title="Toggle color theme"
      className="relative inline-flex items-center w-[46px] h-6 rounded-full border border-foreground/10
        bg-foreground/5 hover:bg-foreground/10 transition-colors
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
    >
      {/* Sliding thumb. Rests left in light mode (sun), slides right in dark
          mode (moon). Both icons are stacked and crossfade in sync with the
          slide, so the icon never swaps ahead of the thumb's travel. */}
      <span
        className={`absolute top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full
          bg-foreground text-background flex items-center justify-center
          transition-transform duration-200 ease-out ${mounted && isDark ? "translate-x-[25px]" : "translate-x-[3px]"}`}
        aria-hidden
      >
        {/* Sun — visible in light mode. Hidden until mounted to avoid a
            pre-hydration flash of the wrong icon. */}
        <svg
          width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round"
          className={`absolute transition-opacity duration-200 ${mounted && !isDark ? "opacity-100" : "opacity-0"}`}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
        {/* Moon — visible in dark mode. */}
        <svg
          width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`absolute transition-opacity duration-200 ${mounted && isDark ? "opacity-100" : "opacity-0"}`}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  );
}
