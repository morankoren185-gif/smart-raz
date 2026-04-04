import { englishWordShuttle } from "./english/word-shuttle";
import { hebrewLetterOrbit } from "./hebrew/letter-orbit";
import { mathStarCount } from "./math/star-count";
import type { GameModule, WorldId } from "./types";

export * from "./types";
export { WORLDS, getWorldMeta } from "./worlds";

export const ALL_GAMES: GameModule[] = [
  englishWordShuttle,
  hebrewLetterOrbit,
  mathStarCount,
];

export function getGameBySlug(slug: string): GameModule | undefined {
  return ALL_GAMES.find((g) => g.slug === slug);
}

export function getGamesForWorld(worldId: WorldId): GameModule[] {
  return ALL_GAMES.filter((g) => g.worldId === worldId);
}
