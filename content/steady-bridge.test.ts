import { describe, expect, it } from "vitest";
import {
  ENGLISH_WORDS_BY_LEVEL,
} from "@/content/english-words/lexicon";
import {
  STEADY_NEAR_GENTLE_ENGLISH_WORDS,
  STEADY_ORDERED_ENGLISH_WORDS,
} from "@/content/english-words/steady-bridge-english";
import { buildEmojiWordMatchingBank, buildWordToPictureBank } from "@/content/english-words/question-factories";
import { flagsCountryChoiceDefinition } from "@/content/flags/flag-country-choice";
import { flagsCountryOnMapDefinition } from "@/content/flags/flags-country-on-map";
import { flagsFlagMatchingDefinition } from "@/content/flags/flag-country-matching";
import {
  SPACE_COMPARE_MC_CURATED_STEADY,
  SPACE_ORDER_MC_CURATED_STEADY,
} from "@/content/space/curated-catalog";
import { buildPlanetOrderMcBank } from "@/content/space/space-order-factories";
import { buildPlanetCompareBank } from "@/content/space/space-compare-factories";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";

describe("גשר gentle → steady", () => {
  it("englishWords: steady מתחיל כמו המפרט (hat, fish, apple, tree) ואז מתרחב", () => {
    expect(ENGLISH_WORDS_BY_LEVEL.steady.slice(0, 4)).toEqual([...STEADY_NEAR_GENTLE_ENGLISH_WORDS]);
    expect(ENGLISH_WORDS_BY_LEVEL.steady).toEqual([...STEADY_ORDERED_ENGLISH_WORDS]);
    const w2p = buildWordToPictureBank();
    expect(w2p.steady[0]?.instructions.endsWith("hat")).toBe(true);
  });

  it("englishWords: matching steady מתחיל ב-hat ולא ב-apple", () => {
    const m = buildEmojiWordMatchingBank();
    expect(m.steady.length).toBe(3);
    expect(m.steady[0]?.pairs.some((p) => p.sideB.label === "hat")).toBe(true);
  });

  it("flags: steady MC — חמש מוכרות ואז AU בלבד כחדש", () => {
    const st = flagsCountryChoiceDefinition.banksByLevel.steady as MultipleChoiceQuestion[];
    expect(st.length).toBe(6);
    expect(st[0]?.correctAnswer).toBe("jp");
    const newish = st.filter((q) => !["jp", "il", "br", "ca", "fr"].includes(q.correctAnswer));
    expect(newish.map((q) => q.correctAnswer)).toEqual(["au"]);
  });

  it("flags: steady map מתחיל בחיזור יפן ולא במצרים", () => {
    const st = flagsCountryOnMapDefinition.banksByLevel.steady as MultipleChoiceQuestion[];
    expect(st[0]?.mapCountry?.highlightedShapeId).toBe("japan");
    expect(st.some((q) => q.correctAnswer === "gb")).toBe(false);
  });

  it("flags: steady matching — קודם ארבע המוכרות+קנדה", () => {
    const st = flagsFlagMatchingDefinition.banksByLevel.steady;
    const labels = st[0]!.pairs.map((p) => p.sideB.label);
    expect(labels).toContain("יפן");
    expect(labels).toContain("קנדה");
    expect(st[0]!.pairs.length).toBe(4);
  });

  it("space: steady order/compare נשענים על הקטלוג המאוחד", () => {
    const ord = buildPlanetOrderMcBank().steady;
    const cmp = buildPlanetCompareBank().steady;
    expect(ord.map((q) => q.id)).toEqual(SPACE_ORDER_MC_CURATED_STEADY.map((s) => s.id));
    expect(cmp.map((q) => q.id)).toEqual(SPACE_COMPARE_MC_CURATED_STEADY.map((s) => s.id));
  });

  it("space: steady compare בלי earlier/later (רק מילות closer/farther)", () => {
    for (const q of buildPlanetCompareBank().steady) {
      expect(q.instructions.toLowerCase()).not.toContain("earlier");
      expect(q.instructions.toLowerCase()).not.toContain("later");
    }
  });
});
