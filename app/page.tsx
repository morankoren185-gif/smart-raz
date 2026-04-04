import { HomeLevelProgress } from "@/components/home/HomeLevelProgress";
import { HomeStarsBadge } from "@/components/home/HomeStarsBadge";
import { WORLDS } from "@/content/worlds";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_#312e81_0%,_#0f172a_50%,_#020617_100%)] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.14) 0 2px, transparent 3px), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.1) 0 1px, transparent 2px)",
          backgroundSize: "100% 100%",
        }}
      />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col px-4 pb-10 pt-8 sm:px-8">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-amber-200/90">מסע קצר ובין־כוכבי</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">כוכב הבית</h1>
            <p className="mt-2 max-w-md text-base text-white/85">
              בוחרים עולם — ומשחקים קצר שמחזק ביטחון. הכל בקצב שלך.
            </p>
            <Link
              href="/map"
              className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-teal-400/50 bg-teal-600/25 px-4 text-sm font-bold text-teal-50 hover:bg-teal-500/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
            >
              <span aria-hidden>🗺️</span>
              מפת המסע — פותחים מדינות בכוכבים
            </Link>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
            <HomeLevelProgress />
            <HomeStarsBadge />
          </div>
        </header>

        <nav aria-label="עולמות למידה" className="flex flex-1 flex-col gap-5">
          {WORLDS.map((w) => (
            <Link
              key={w.id}
              href={`/world/${w.id}`}
              className={`group relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-l ${w.gradient} p-6 shadow-xl backdrop-blur transition hover:border-amber-300/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 text-right">
                  <h2 className="text-2xl font-bold">{w.title}</h2>
                  <p className="mt-1 text-sm text-white/80">{w.metaphor}</p>
                </div>
                <span
                  className="shrink-0 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold group-hover:bg-white/20"
                  aria-hidden
                >
                  כניסה
                </span>
              </div>
            </Link>
          ))}
        </nav>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/70">
          <p>לחיצות גדולות, משחקים קצרים, חיוך במסע.</p>
          <Link
            href="/parent"
            className="rounded-full border border-white/20 px-4 py-2 font-medium text-amber-100 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
          >
            לאזור ההורה
          </Link>
        </footer>
      </div>
    </div>
  );
}
