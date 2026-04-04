import { getWorldMeta } from "@/content";
import { ALL_GAME_DEFINITIONS, getGameDefinitionsForWorld } from "@/content/game-definitions";
import type { WorldId } from "@/content/types";
import Link from "next/link";
import { notFound } from "next/navigation";

const WORLD_IDS: WorldId[] = ["english", "hebrew", "math", "flags", "englishWords", "space"];

function isWorldId(v: string): v is WorldId {
  return (WORLD_IDS as string[]).includes(v);
}

export default async function WorldPage({
  params,
}: {
  params: Promise<{ worldId: string }>;
}) {
  const { worldId: raw } = await params;
  if (!isWorldId(raw)) notFound();

  const meta = getWorldMeta(raw);
  const games = getGameDefinitionsForWorld(raw);
  if (!meta) notFound();

  return (
    <div className="relative min-h-dvh bg-[radial-gradient(ellipse_at_top,_#1e1b4b_0%,_#0f172a_55%,_#020617_100%)] text-white">
      <header className="border-b border-white/10 bg-black/20 px-4 py-5 backdrop-blur sm:px-8">
        <Link
          href="/"
          className="inline-flex min-h-12 items-center rounded-2xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
        >
          ← חזרה לכוכב הבית
        </Link>
        <h1 className="mt-4 text-3xl font-bold">{meta.title}</h1>
        <p className="mt-2 text-white/80">{meta.metaphor}</p>
        <p className="mt-3 text-sm text-white/65">{games.length} משחקים במסלול</p>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 py-8 sm:px-6">
        {games.map((g) => (
          <Link
            key={g.id}
            href={`/play/${g.slug}`}
            className="block rounded-3xl border border-white/15 bg-white/10 p-5 shadow-lg backdrop-blur transition hover:border-amber-300/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
          >
            <h2 className="text-xl font-bold">{g.title}</h2>
            <p className="mt-2 text-sm text-white/80">{g.tagline}</p>
            <p className="mt-4 text-sm font-semibold text-amber-200">למשחק ←</p>
          </Link>
        ))}
        {games.length === 0 ? (
          <p className="text-center text-white/70">בקרוב יגיעו עוד משימות לעולם הזה.</p>
        ) : null}
      </main>

      <footer className="px-4 pb-8 pt-2 text-center text-xs text-white/45 sm:px-8">
        סך הכל {ALL_GAME_DEFINITIONS.length} משחקים באפליקציה
      </footer>
    </div>
  );
}
