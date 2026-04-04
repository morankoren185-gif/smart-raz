import { EnglishWordsWorldHub } from "@/components/world/EnglishWordsWorldHub";
import { getWorldMeta } from "@/content";
import Link from "next/link";

export default function EnglishWordsWorldPage() {
  const meta = getWorldMeta("englishWords");
  if (!meta) {
    return null;
  }

  return (
    <div className="relative min-h-dvh bg-[radial-gradient(ellipse_at_top,_#1e3a5f_0%,_#0f172a_55%,_#020617_100%)] text-white">
      <header className="border-b border-white/10 bg-black/20 px-4 py-5 backdrop-blur sm:px-8">
        <Link
          href="/"
          className="inline-flex min-h-12 items-center rounded-2xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
        >
          ← חזרה לכוכב הבית
        </Link>
        <h1 className="mt-4 text-3xl font-bold">{meta.title}</h1>
        <p className="mt-2 text-white/80">{meta.metaphor}</p>
        <p className="mt-3 text-sm text-sky-100/85">מסלול עם משימות קצרות — ואז כל המשחקים בנפרד.</p>
      </header>

      <main className="mx-auto max-w-lg px-4 py-8 sm:px-6">
        <EnglishWordsWorldHub />
      </main>

      <footer className="px-4 pb-8 pt-2 text-center text-xs text-white/45 sm:px-8">
        <Link href="/map" className="text-sky-200/90 underline-offset-2 hover:underline">
          למפת המסע
        </Link>
      </footer>
    </div>
  );
}
