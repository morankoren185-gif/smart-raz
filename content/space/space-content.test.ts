import { describe, expect, it } from "vitest";
import { WORLDS } from "@/content/worlds";
import { getGameDefinitionsForWorld } from "@/content/game-definitions";
import { illustrationDisplayMode } from "@/lib/ui/illustrationDisplayMode";
import { mcQuestionToPlayableRound } from "@/lib/play/mapGameDefinitionToMultipleChoicePlayableGame";
import { resolvePlaySessionForSlug } from "@/lib/play/resolvePlaySessionForSlug";
import {
  PLANET_VISUALS,
  PLANETS_BY_LEVEL,
  SOLAR_PLANETS_FROM_SUN,
  visualForPlanet,
  type PlanetId,
} from "./lexicon";
import {
  buildNameToPlanetBank,
  buildPlanetMatchingBank,
  buildPlanetToNameBank,
} from "./question-factories";
import { buildPlanetOrderMatchingBank, buildPlanetOrderMcBank } from "./space-order-factories";
import { buildPlanetCompareBank } from "./space-compare-factories";
import { SPACE_GAME_DEFINITIONS } from "./space-games";

describe("space world content", () => {
  it("עולם space מופיע ב-WORLDS ובקטלוג המשחקים", () => {
    expect(WORLDS.some((w) => w.id === "space")).toBe(true);
    const games = getGameDefinitionsForWorld("space");
    expect(games.length).toBe(6);
    expect(SPACE_GAME_DEFINITIONS.map((g) => g.slug).sort()).toEqual(
      [
        "space-name-to-planet",
        "space-planet-compare",
        "space-planet-matching",
        "space-planet-order-matching",
        "space-planet-order-mc",
        "space-planet-to-name",
      ].sort(),
    );
  });

  it("משחקי space נפתחים דרך resolve (MC + matching)", () => {
    const mc1 = resolvePlaySessionForSlug("space-planet-to-name");
    const mc2 = resolvePlaySessionForSlug("space-name-to-planet");
    const m = resolvePlaySessionForSlug("space-planet-matching");
    const ordMc = resolvePlaySessionForSlug("space-planet-order-mc");
    const ordM = resolvePlaySessionForSlug("space-planet-order-matching");
    const cmp = resolvePlaySessionForSlug("space-planet-compare");
    expect(mc1?.kind).toBe("multiple-choice-playable");
    expect(mc2?.kind).toBe("multiple-choice-playable");
    expect(m?.kind).toBe("matching-playable");
    expect(ordMc?.kind).toBe("multiple-choice-playable");
    expect(ordM?.kind).toBe("matching-playable");
    expect(cmp?.kind).toBe("multiple-choice-playable");
    if (mc1?.kind === "multiple-choice-playable") {
      expect(mc1.playable.worldId).toBe("space");
    }
    if (m?.kind === "matching-playable") {
      expect(m.playable.worldId).toBe("space");
    }
    if (ordMc?.kind === "multiple-choice-playable") {
      expect(ordMc.playable.slug).toBe("space-planet-order-mc");
    }
    if (cmp?.kind === "multiple-choice-playable") {
      expect(cmp.playable.slug).toBe("space-planet-compare");
    }
  });

  it("חלוקת כוכבים לרמות לפי המפרט", () => {
    expect(PLANETS_BY_LEVEL.gentle).toEqual(["Earth", "Mars", "Jupiter", "Saturn"]);
    expect(PLANETS_BY_LEVEL.steady).toEqual([
      "Earth",
      "Mars",
      "Jupiter",
      "Saturn",
      "Venus",
      "Neptune",
    ]);
    expect(PLANETS_BY_LEVEL.spark).toEqual([
      "Mercury",
      "Venus",
      "Earth",
      "Mars",
      "Jupiter",
      "Saturn",
      "Uranus",
      "Neptune",
    ]);
  });

  it("בנקים לא ריקים בכל רמה", () => {
    const p2n = buildPlanetToNameBank();
    const n2p = buildNameToPlanetBank();
    const mat = buildPlanetMatchingBank();
    const ordMc = buildPlanetOrderMcBank();
    const ordMat = buildPlanetOrderMatchingBank();
    const cmp = buildPlanetCompareBank();
    for (const level of ["gentle", "steady", "spark"] as const) {
      expect(p2n[level].length).toBe(PLANETS_BY_LEVEL[level].length);
      expect(n2p[level].length).toBe(PLANETS_BY_LEVEL[level].length);
      expect(mat[level].length).toBeGreaterThan(0);
      expect(ordMc[level].length).toBeGreaterThan(0);
      expect(ordMat[level].length).toBeGreaterThan(0);
      expect(cmp[level].length).toBeGreaterThan(0);
      expect(p2n[level].every((q) => q.world === "space")).toBe(true);
    }
  });

  it("השוואת מרחק — Earth קרובה יותר מ־Jupiter", () => {
    const bank = buildPlanetCompareBank();
    const q = bank.gentle.find(
      (x) =>
        x.instructions.includes("closer") &&
        x.instructions.includes("Earth") &&
        x.instructions.includes("Jupiter"),
    );
    expect(q).toBeDefined();
    expect(q!.choices[q!.correctAnswer]!.label).toBe("Earth");
    expect(q!.promptVisual?.emoji).toBe("☀️");
  });

  it("השוואה — מיפוי ל-playable תקין", () => {
    const q = buildPlanetCompareBank().steady[0]!;
    const round = mcQuestionToPlayableRound(q);
    expect(round.choices.length).toBeGreaterThanOrEqual(3);
    expect(round.promptVisual?.emoji).toBe("☀️");
  });

  it("SOLAR_PLANETS_FROM_SUN תואם את סדר מערכת השמש", () => {
    expect(SOLAR_PLANETS_FROM_SUN).toEqual([
      "Mercury",
      "Venus",
      "Earth",
      "Mars",
      "Jupiter",
      "Saturn",
      "Uranus",
      "Neptune",
    ]);
  });

  it("שאלת סדר — אחרי מאדים התשובה צדק", () => {
    const bank = buildPlanetOrderMcBank();
    const q = bank.gentle.find((x) => x.instructions.includes("after Mars"));
    expect(q).toBeDefined();
    const label = q!.choices[q!.correctAnswer]!.label;
    expect(label).toBe("Jupiter");
  });

  it("matching סדר — מאדים מזווג למקום #4", () => {
    const g = buildPlanetOrderMatchingBank().gentle[0]!;
    const marsPair = g.pairs.find((p) => p.sideB.label === "#4");
    expect(marsPair).toBeDefined();
    expect(marsPair!.sideA.emoji).toBe(PLANET_VISUALS.Mars.emoji);
  });

  it("שאלת planet-to-name כוללת promptVisual ומיפוי ל-playable", () => {
    const q = buildPlanetToNameBank().gentle[0]!;
    expect(q.promptVisual?.emoji).toBeTruthy();
    expect(q.promptVisual?.imageSrc).toMatch(/^\/illustrations\/space\/[a-z]+\.svg$/);
    const round = mcQuestionToPlayableRound(q);
    expect(round.promptVisual?.emoji).toBe(q.promptVisual?.emoji);
    expect(round.promptVisual?.imageSrc).toBe(q.promptVisual?.imageSrc);
  });

  it("לכל כוכב בלקסיקון יש imageSrc תחת public/illustrations/space", () => {
    const ids = Object.keys(PLANET_VISUALS) as PlanetId[];
    expect(ids).toHaveLength(8);
    for (const id of ids) {
      const v = PLANET_VISUALS[id];
      expect(v.imageSrc).toMatch(/^\/illustrations\/space\/[a-z]+\.svg$/);
      expect(v.emoji.length).toBeGreaterThan(0);
      expect(v.altHe?.length).toBeGreaterThan(0);
    }
  });

  it("visualForPlanet ללא קטלוג — בלי imageSrc, עם emoji", () => {
    const v = visualForPlanet("Pluto");
    expect(v.imageSrc).toBeUndefined();
    expect(v.emoji).toBeTruthy();
  });

  it("illustrationDisplayMode: נתיב space + כשל טעינה → emoji", () => {
    expect(illustrationDisplayMode("/illustrations/space/earth.svg", true)).toBe("emoji");
    expect(illustrationDisplayMode("/illustrations/space/mars.svg", false)).toBe("image");
  });

  it("name-to-planet — בחירות מעבירות imageSrc ל־playable", () => {
    const q = buildNameToPlanetBank().gentle[0]!;
    const keys = Object.keys(q.choices);
    for (const k of keys) {
      const c = q.choices[k]!;
      expect(c.imageSrc).toMatch(/^\/illustrations\/space\//);
      expect(c.emoji).toBeTruthy();
    }
    const round = mcQuestionToPlayableRound(q);
    expect(round.choices.every((ch) => Boolean(ch.imageSrc || ch.emoji))).toBe(true);
  });

  it("matching — זוגות עם imageSrc ו־emoji מקטלוג", () => {
    const bank = buildPlanetMatchingBank().gentle[0]!;
    for (const pair of bank.pairs) {
      const picSide = pair.sideA.label.trim() === "" ? pair.sideA : pair.sideB;
      expect(picSide.imageSrc).toMatch(/^\/illustrations\/space\//);
      expect(picSide.emoji).toBeTruthy();
      expect(picSide.altHe).toBeTruthy();
    }
  });
});
