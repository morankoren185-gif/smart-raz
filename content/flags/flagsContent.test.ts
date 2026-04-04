import { describe, expect, it } from "vitest";
import { WORLDS } from "@/content/worlds";
import {
  ALL_GAME_DEFINITIONS,
  getGameDefinitionBySlug,
  getGameDefinitionsForWorld,
} from "@/content/game-definitions";
import { FLAG_MISSIONS } from "./flag-missions";
import { flagsCountryChoiceDefinition } from "./flag-country-choice";
import { flagsFlagMatchingDefinition } from "./flag-country-matching";
import { flagsCountryOnMapDefinition } from "./flags-country-on-map";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";
import { resolvePlaySessionForSlug } from "@/lib/play/resolvePlaySessionForSlug";
import {
  mapGameDefinitionToMultipleChoicePlayableGame,
  mcQuestionToPlayableRound,
} from "@/lib/play/mapGameDefinitionToMultipleChoicePlayableGame";
import { mapGameDefinitionToMatchingPlayableGame } from "@/lib/play/mapGameDefinitionToMatchingPlayableGame";
import { getRegionMapDefinition } from "./region-map-assets";

describe("עולם דגלים ומדינות", () => {
  it("מופיע ברשימת העולמות ובקטלוג המשחקים", () => {
    expect(WORLDS.some((w) => w.id === "flags")).toBe(true);
    const flagsGames = getGameDefinitionsForWorld("flags");
    expect(flagsGames.length).toBeGreaterThanOrEqual(3);
    expect(ALL_GAME_DEFINITIONS.some((g) => g.slug === "flags-country-choice")).toBe(true);
    expect(ALL_GAME_DEFINITIONS.some((g) => g.slug === "flags-flag-matching")).toBe(true);
  });

  it("flags-country-choice נפתח כ־multiple-choice playable", () => {
    const resolved = resolvePlaySessionForSlug("flags-country-choice");
    expect(resolved?.kind).toBe("multiple-choice-playable");
    if (resolved?.kind === "multiple-choice-playable") {
      expect(resolved.playable.worldId).toBe("flags");
      expect(resolved.playable.banks.gentle.length).toBeGreaterThanOrEqual(5);
      expect(resolved.playable.banks.steady.length).toBeGreaterThanOrEqual(6);
      expect(resolved.playable.banks.spark.length).toBeGreaterThanOrEqual(6);
    }
  });

  it("flags-flag-matching נפתח כ־matching playable", () => {
    const resolved = resolvePlaySessionForSlug("flags-flag-matching");
    expect(resolved?.kind).toBe("matching-playable");
    if (resolved?.kind === "matching-playable") {
      expect(resolved.playable.worldId).toBe("flags");
      expect(resolved.playable.banks.gentle.length).toBeGreaterThanOrEqual(2);
      expect(resolved.playable.banks.gentle[0]?.pairs.length).toBeGreaterThanOrEqual(2);
      expect(
        resolved.playable.banks.spark.some((q) => (q.pairs?.length ?? 0) >= 5),
      ).toBe(true);
    }
  });

  it("מיפוי MC: רמה עדינה מתחילה מדגל ברור (יפן) וכוללת גם צרפת", () => {
    const playable = mapGameDefinitionToMultipleChoicePlayableGame(flagsCountryChoiceDefinition);
    const first = playable.banks.gentle[0]!;
    expect(first.instructions).toContain("מדינה");
    expect(first.correctAnswer).toBe("jp");
    expect(first.promptVisual?.imageSrc).toMatch(/jp\.svg$/);
    expect(first.promptVisual?.altHe).toMatch(/יפן/);
    const frQ = playable.banks.gentle.find((q) => q.correctAnswer === "fr");
    expect(frQ).toBeDefined();
    expect(frQ!.promptVisual?.imageSrc).toMatch(/fr\.svg$/);
  });

  it("flags-country-on-map רשום בעולם flags ונפתח כ־multiple-choice playable", () => {
    const flagsGames = getGameDefinitionsForWorld("flags");
    const mapGame = flagsGames.find((g) => g.slug === "flags-country-on-map");
    expect(mapGame).toBeDefined();
    expect(mapGame?.world).toBe("flags");
    const resolved = resolvePlaySessionForSlug("flags-country-on-map");
    expect(resolved?.kind).toBe("multiple-choice-playable");
    if (resolved?.kind === "multiple-choice-playable") {
      expect(resolved.playable.banks.gentle.length).toBeGreaterThanOrEqual(5);
      expect(resolved.playable.banks.steady.length).toBeGreaterThanOrEqual(6);
      expect(resolved.playable.banks.spark.length).toBeGreaterThanOrEqual(6);
    }
  });

  it("שאלות map-country מפות לצורות קיימות ב־region-map-assets", () => {
    for (const level of ["gentle", "steady", "spark"] as const) {
      for (const q of flagsCountryOnMapDefinition.banksByLevel[level]) {
        if (q.type !== "multiple-choice") continue;
        const mc = q as MultipleChoiceQuestion;
        expect(mc.presentationSubtype).toBe("map-country");
        const mapId = mc.mapCountry?.mapId;
        const shapeId = mc.mapCountry?.highlightedShapeId;
        expect(mapId && shapeId).toBeTruthy();
        const mapDef = getRegionMapDefinition(mapId!);
        expect(mapDef?.shapes[shapeId!], `${level} ${mc.id}`).toBeDefined();
      }
    }
  });

  it("משימת המסע המשולב עדיין קיימת ועודכנה בניסוח", () => {
    const journey = FLAG_MISSIONS.find((m) => m.id === "flags-m-4-journey");
    expect(journey).toBeDefined();
    expect(journey?.title).toContain("מסע");
    expect(journey?.steps.length).toBe(3);
  });

  it("שאלת map-country ממופה לסיבוב עם mapCountry (gentle מתחיל כמו דגלים — יפן)", () => {
    const def = getGameDefinitionBySlug("flags-country-on-map");
    expect(def).toBeDefined();
    const playable = mapGameDefinitionToMultipleChoicePlayableGame(def!);
    const q = playable.banks.gentle[0]!;
    expect(q.presentationSubtype).toBe("map-country");
    expect(q.mapCountry?.mapId).toBe("asia-pacific");
    expect(q.mapCountry?.highlightedShapeId).toBe("japan");
    expect(q.correctAnswer).toBe("jp");
    const round = mcQuestionToPlayableRound(q);
    expect(round.mapCountry).toEqual({
      mapId: "asia-pacific",
      highlightedShapeId: "japan",
    });
  });

  it("מיפוי matching: זוגות עם תמונת דגל + אימוג׳י גיבוי", () => {
    const playable = mapGameDefinitionToMatchingPlayableGame(flagsFlagMatchingDefinition);
    const q = playable.banks.gentle[0]!;
    expect(q.pairs.every((p) => p.sideA.imageSrc?.endsWith(".svg"))).toBe(true);
    expect(q.pairs.every((p) => p.sideA.emoji && p.sideA.emoji.trim().length > 0)).toBe(true);
    expect(q.pairs.some((p) => p.sideB.label.includes("יפן") || p.sideB.label.includes("ישראל"))).toBe(
      true,
    );
    const gentleFr = playable.banks.gentle.flatMap((mq) => mq.pairs).find((p) => p.sideB.label === "צרפת");
    expect(gentleFr).toBeDefined();
  });
});
