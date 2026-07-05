import ThemeToggle from "@/components/ThemeToggle";

export default function SiteHeader() {
  return (
    <header className="w-full border-b border-foreground/10">
      <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-3">
        <span className="text-lg font-bold font-space tracking-tight select-none">
          Variantle
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
