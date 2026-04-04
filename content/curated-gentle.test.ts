import { describe, expect, it } from "vitest";
import { GENTLE_CURATED_ENGLISH_WORDS } from "@/content/english-words/gentle-curated";
import { ENGLISH_WORDS_BY_LEVEL } from "@/content/english-words/lexicon";
import {
  buildListenChooseBank,
  buildWordToPictureBank,
} from "@/content/english-words/question-factories";
import { flagsCountryChoiceDefinition } from "@/content/flags/flag-country-choice";
import { flagsCountryOnMapDefinition } from "@/content/flags/flags-country-on-map";
import {
  SPACE_COMPARE_MC_CURATED_GENTLE,
  SPACE_ORDER_MC_CURATED_GENTLE,
} from "@/content/space/curated-catalog";
import { buildPlanetCompareBank } from "@/content/space/space-compare-factories";
import { buildPlanetOrderMcBank } from "@/content/space/space-order-factories";
import { orderMcTemplatesForSrs, learningItemKeyMc } from "@/lib/progress/learning-items";
import { mcQuestionToPlayableRound } from "@/lib/play/mapGameDefinitionToMultipleChoicePlayableGame";
import { resolvePlaySessionForSlug } from "@/lib/play/resolvePlaySessionForSlug";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";

const DISALLOWED_GENTLE_ENGLISH = new Set(["hat", "fish"]);

describe("שכבת gentle אוצרת — איכות למידה ראשונה", () => {
  it("englishWords: רשימת gentle תואמת את האוצר וללא מילים שהועברו ל־steady", () => {
    expect(ENGLISH_WORDS_BY_LEVEL.gentle).toEqual([...GENTLE_CURATED_ENGLISH_WORDS]);
    for (const w of ENGLISH_WORDS_BY_LEVEL.gentle) {
      expect(DISALLOWED_GENTLE_ENGLISH.has(w)).toBe(false);
    }
    expect(ENGLISH_WORDS_BY_LEVEL.steady.slice(0, 2)).toEqual(["hat", "fish"]);
  });

  it("englishWords: בנקי MC ו־SRS לא ריקים ב־gentle", () => {
    const w2p = buildWordToPictureBank();
    expect(w2p.gentle.length).toBe(GENTLE_CURATED_ENGLISH_WORDS.length);
    const templates = w2p.gentle.map(mcQuestionToPlayableRound);
    const slug = "en-words-to-picture";
    const now = new Date("2026-04-03T12:00:00.000Z");
    const dueKey = learningItemKeyMc(slug, "ew-w2p-gentle-1");
    const items = {
      [dueKey]: {
        itemId: dueKey,
        timesCorrect: 1,
        timesWrong: 0,
        nextReviewAt: new Date(now.getTime() - 1000).toISOString(),
      },
    };
    const ordered = orderMcTemplatesForSrs(templates, slug, items, now, () => 0.2);
    expect(ordered.length).toBe(templates.length);
    expect(ordered[0]!.id.startsWith("ew-w2p-gentle-1")).toBe(true);
  });

  it("flags: gentle ללא אוסטרליה ורק חמש מדינות אוצרות", () => {
    const gentle = flagsCountryChoiceDefinition.banksByLevel.gentle as MultipleChoiceQuestion[];
    expect(gentle.length).toBe(5);
    for (const q of gentle) {
      expect(q.correctAnswer).not.toBe("au");
      const labels = Object.values(q.choices).map((c) => c.label).join(" ");
      expect(labels).not.toContain("אוסטרליה");
      for (const k of Object.keys(q.choices)) {
        expect(["jp", "il", "br", "ca", "fr"]).toContain(k);
      }
    }
  });

  it("flags: map gentle מיושר לאוצר + רק יעדי מפה קיימים; resolve תקין", () => {
    const gentle = flagsCountryOnMapDefinition.banksByLevel.gentle as MultipleChoiceQuestion[];
    expect(gentle.length).toBe(5);
    const allowedChoiceKeys = new Set(["jp", "il", "br", "ca", "fr"]);
    const disallowedAnswers = new Set(["au", "eg", "it", "ie", "uk", "cl"]);
    const mappableHighlights = new Set(["japan", "israel", "brazil"]);
    for (const q of gentle) {
      expect(disallowedAnswers.has(q.correctAnswer)).toBe(false);
      for (const k of Object.keys(q.choices)) {
        expect(allowedChoiceKeys.has(k)).toBe(true);
      }
      expect(mappableHighlights.has(q.mapCountry?.highlightedShapeId ?? "")).toBe(true);
    }
    const resolved = resolvePlaySessionForSlug("flags-country-on-map");
    expect(resolved?.kind).toBe("multiple-choice-playable");
    if (resolved?.kind === "multiple-choice-playable") {
      expect(resolved.playable.banks.gentle.length).toBe(5);
    }
  });

  it("space: סדר והשוואה gentle — בנקים מהקטלוג המאוחד (אותם מזהים)", () => {
    const ord = buildPlanetOrderMcBank();
    const cmp = buildPlanetCompareBank();
    expect(ord.gentle.map((q) => q.id)).toEqual(SPACE_ORDER_MC_CURATED_GENTLE.map((s) => s.id));
    expect(cmp.gentle.map((q) => q.id)).toEqual(SPACE_COMPARE_MC_CURATED_GENTLE.map((s) => s.id));
    expect(ord.gentle.length).toBe(SPACE_ORDER_MC_CURATED_GENTLE.length);
    expect(cmp.gentle.length).toBe(SPACE_COMPARE_MC_CURATED_GENTLE.length);
  });

  it("space + listen english — שאלות תקינות למיפוי MC", () => {
    const listen = buildListenChooseBank();
    expect(listen.gentle.every((q) => q.world === "englishWords")).toBe(true);
    for (const q of buildPlanetOrderMcBank().gentle) {
      const r = mcQuestionToPlayableRound(q);
      expect(r.correctChoiceId).toBeTruthy();
      expect(r.choices.length).toBe(3);
    }
  });
});
