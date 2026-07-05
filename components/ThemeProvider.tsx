"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Client wrapper so the server root layout can mount next-themes.
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
