import { WorldMapView } from "@/components/map/WorldMapView";
import Link from "next/link";

export default function MapPage() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_#134e4a_0%,_#0f172a_45%,_#020617_100%)] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 0 2px, transparent 3px)",
          backgroundSize: "120% 120%",
        }}
      />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col px-4 pb-10 pt-8 sm:px-8">
        <header className="mb-6">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center rounded-2xl border border-white/25 bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
          >
            ← חזרה לכוכב הבית
          </Link>
          <h1 className="mt-5 text-3xl font-bold tracking-tight">מפת המסע 🗺️</h1>
          <p className="mt-2 max-w-md text-base text-white/85">
            לוחצים על מדינה פתוחה כדי לגלות משחקים. תחנות נעולות יפתחו אחרי שמצברים עוד כוכבים במסלול.
          </p>
        </header>

        <main className="flex flex-1 flex-col">
          <WorldMapView />
        </main>

        <footer className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/55">
          המפה רגועה — אין חופזת; הכול בקצב שלך.
        </footer>
      </div>
    </div>
  );
}
