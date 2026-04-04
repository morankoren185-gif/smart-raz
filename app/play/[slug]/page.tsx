import { PlayGameClient } from "@/components/game/PlayGameClient";
import { resolvePlaySessionForSlug } from "@/lib/play/resolvePlaySessionForSlug";
import { notFound } from "next/navigation";

export default async function PlayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = resolvePlaySessionForSlug(slug);
  if (!resolved) notFound();
  if (resolved.kind === "multiple-choice-playable") {
    return <PlayGameClient playableMultipleChoice={resolved.playable} />;
  }
  if (resolved.kind === "matching-playable") {
    return <PlayGameClient playableMatching={resolved.playable} />;
  }
  return <PlayGameClient legacyModule={resolved.module} />;
}
