import Link from "next/link";

type KidShellProps = {
  title: string;
  subtitle?: string;
  backHref: string;
  backLabel?: string;
  children: React.ReactNode;
  /** כיוון תוכן פנימי — רוב המסכים RTL */
  contentDir?: "rtl" | "ltr";
};

export function KidShell({
  title,
  subtitle,
  backHref,
  backLabel = "חזרה",
  children,
  contentDir = "rtl",
}: KidShellProps) {
  return (
    <div
      className="relative min-h-dvh overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_#1e1b4b_0%,_#0f172a_45%,_#020617_100%)] text-white"
      dir={contentDir}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage: [
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.12) 0 2px, transparent 3px)",
            "radial-gradient(circle at 70% 20%, rgba(255,255,255,0.1) 0 1px, transparent 2px)",
            "radial-gradient(circle at 50% 80%, rgba(147,197,253,0.15) 0 2px, transparent 4px)",
          ].join(", "),
          backgroundSize: "120% 120%",
        }}
      />
      <header className="relative z-10 flex items-center gap-3 px-4 pb-2 pt-4 sm:px-8">
        <Link
          href={backHref}
          className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 text-base font-medium text-white shadow-md backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
        >
          ← {backLabel}
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">{title}</h1>
          {subtitle ? (
            <p className="truncate text-sm text-white/80">{subtitle}</p>
          ) : null}
        </div>
      </header>
      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-10 sm:px-6">
        {children}
      </main>
    </div>
  );
}
