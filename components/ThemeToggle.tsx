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
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle color theme"}
      title="Toggle color theme"
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-foreground/10
        text-muted hover:text-foreground hover:bg-foreground/5 transition-all
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
    >
      {!mounted ? (
        // Neutral placeholder (avoids showing the wrong icon before hydration)
        <span className="w-4 h-4 rounded-full border border-current" aria-hidden />
      ) : isDark ? (
        // Sun — clicking switches to light
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Moon — clicking switches to dark
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
