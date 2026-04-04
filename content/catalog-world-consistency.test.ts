import { describe, expect, it } from "vitest";
import {
  ENGLISH_WORDS_GENTLE_ORDER,
  ENGLISH_WORDS_STEADY_ORDERED,
  ENGLISH_WORDS_MATCHING_GENTLE_ROUNDS,
  ENGLISH_WORDS_MATCHING_STEADY_ROUNDS,
} from "@/content/english-words/curated-catalog";
import {
  buildEmojiWordMatchingBank,
  buildListenChooseBank,
  buildPictureToWordBank,
  buildWordToPictureBank,
} from "@/content/english-words/question-factories";
import { ENGLISH_WORDS_BY_LEVEL } from "@/content/english-words/lexicon";
import {
  FLAGS_DISALLOWED_IN_GENTLE,
  FLAGS_GENTLE_ALLOWED_KEY_SET,
  FLAGS_GENTLE_CHOICE_KEYS_ORDER,
  FLAG_LABEL_HE,
} from "@/content/flags/curated-catalog";
import { flagsCountryChoiceDefinition } from "@/content/flags/flag-country-choice";
import { flagsCountryOnMapDefinition } from "@/content/flags/flags-country-on-map";
import { flagsFlagMatchingDefinition } from "@/content/flags/flag-country-matching";
import {
  SPACE_CATALOG_GENTLE_PLANET_ORDER,
  SPACE_CATALOG_STEADY_PLANET_ORDER,
  SPACE_COMPARE_MC_CURATED_GENTLE,
  SPACE_COMPARE_MC_CURATED_STEADY,
  SPACE_ORDER_MC_CURATED_GENTLE,
  SPACE_ORDER_MC_CURATED_STEADY,
} from "@/content/space/curated-catalog";
import { PLANETS_BY_LEVEL } from "@/content/space/lexicon";
import { buildPlanetCompareBank } from "@/content/space/space-compare-factories";
import { buildPlanetOrderMatchingBank, buildPlanetOrderMcBank } from "@/content/space/space-order-factories";
import { resolvePlaySessionForSlug } from "@/lib/play/resolvePlaySessionForSlug";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";
import type { MatchingQuestion } from "@/lib/game-types/matching";

const gentleEnglishSet = new Set<string>(ENGLISH_WORDS_GENTLE_ORDER);
const steadyEnglishOrder = [...ENGLISH_WORDS_STEADY_ORDERED];

function choiceKeyToWord(key: string): string {
  return key.replace(/^w_/, "").replace(/_/g, " ");
}

describe("קטלוג משותף — englishWords", () => {
  it("lexicon gentle/steady תואם לקטלוג", () => {
    expect(ENGLISH_WORDS_BY_LEVEL.gentle).toEqual([...ENGLISH_WORDS_GENTLE_ORDER]);
    expect(ENGLISH_WORDS_BY_LEVEL.steady).toEqual(steadyEnglishOrder);
  });

  it("משחקי MC gentle — אותן מילים ובאותו סדר כמו בקטלוג", () => {
    const w2p = buildWordToPictureBank();
    const p2w = buildPictureToWordBank();
    const listen = buildListenChooseBank();
    expect(w2p.gentle.length).toBe(ENGLISH_WORDS_GENTLE_ORDER.length);
    for (let i = 0; i < w2p.gentle.length; i++) {
      const word = ENGLISH_WORDS_BY_LEVEL.gentle[i]!;
      expect(w2p.gentle[i]!.instructions.endsWith(word)).toBe(true);
      expect(p2w.gentle[i]!.correctAnswer).toBe(`w_${word}`);
      expect(listen.gentle[i]!.correctAnswer).toBe(`w_${word}`);
      for (const q of [w2p.gentle[i]!, p2w.gentle[i]!, listen.gentle[i]!]) {
        for (const k of Object.keys(q.choices)) {
          expect(gentleEnglishSet.has(choiceKeyToWord(k))).toBe(true);
        }
      }
    }
  });

  it("matching gentle/steady — מילים מהקטלוג והסדר", () => {
    for (const r of ENGLISH_WORDS_MATCHING_GENTLE_ROUNDS) {
      for (const p of r.pairs) {
        expect(gentleEnglishSet.has(p.word)).toBe(true);
      }
    }
    let idx = 0;
    for (const r of ENGLISH_WORDS_MATCHING_STEADY_ROUNDS) {
      for (const p of r.pairs) {
        expect(p.word).toBe(ENGLISH_WORDS_STEADY_ORDERED[idx]);
        idx += 1;
      }
    }
    expect(idx).toBe(ENGLISH_WORDS_STEADY_ORDERED.length);
    const bank = buildEmojiWordMatchingBank();
    expect(bank.gentle.length).toBe(ENGLISH_WORDS_MATCHING_GENTLE_ROUNDS.length);
    expect(bank.steady.length).toBe(ENGLISH_WORDS_MATCHING_STEADY_ROUNDS.length);
  });
});

describe("קטלוג משותף — flags", () => {
  it("gentle — רק מפתחות מהליבה; בלי אסורים", () => {
    const gentleHeFromCatalog = new Set(
      FLAGS_GENTLE_CHOICE_KEYS_ORDER.map((k) => FLAG_LABEL_HE[k]),
    );
    for (const def of [
      flagsCountryChoiceDefinition,
      flagsCountryOnMapDefinition,
      flagsFlagMatchingDefinition,
    ]) {
      const gentle = def.banksByLevel.gentle as (MultipleChoiceQuestion | MatchingQuestion)[];
      for (const item of gentle) {
        if (item.type === "multiple-choice") {
          for (const k of Object.keys(item.choices)) {
            expect(FLAGS_GENTLE_ALLOWED_KEY_SET.has(k)).toBe(true);
            expect(FLAGS_DISALLOWED_IN_GENTLE.has(k)).toBe(false);
          }
        } else {
          for (const pr of item.pairs) {
            expect(gentleHeFromCatalog.has(pr.sideB.label)).toBe(true);
          }
        }
      }
    }
    const mc = flagsCountryChoiceDefinition.banksByLevel.gentle as MultipleChoiceQuestion[];
    const firstKeys = mc.map((q) => q.correctAnswer);
    expect(firstKeys).toEqual([...FLAGS_GENTLE_CHOICE_KEYS_ORDER]);
  });
});

describe("קטלוג משותף — space", () => {
  it("PLANETS_BY_LEVEL תואם לקטלוג", () => {
    expect([...PLANETS_BY_LEVEL.gentle]).toEqual([...SPACE_CATALOG_GENTLE_PLANET_ORDER]);
    expect([...PLANETS_BY_LEVEL.steady]).toEqual([...SPACE_CATALOG_STEADY_PLANET_ORDER]);
  });

  it("התאמת סדר מהשמש — בנק gentle נבנה מהקטלוג", () => {
    const bank = buildPlanetOrderMatchingBank();
    expect(bank.gentle.length).toBeGreaterThanOrEqual(2);
    expect(bank.gentle[0]!.pairs.map((p) => p.pairId)).toEqual(["so-g-e", "so-g-m"]);
  });

  it("בנקי order/compare MC gentle+steady — מזהים וטקסטים תואמים למפרט בקטלוג", () => {
    const ord = buildPlanetOrderMcBank();
    const cmp = buildPlanetCompareBank();
    for (const [bankQs, specs] of [
      [ord.gentle, SPACE_ORDER_MC_CURATED_GENTLE],
      [ord.steady, SPACE_ORDER_MC_CURATED_STEADY],
      [cmp.gentle, SPACE_COMPARE_MC_CURATED_GENTLE],
      [cmp.steady, SPACE_COMPARE_MC_CURATED_STEADY],
    ] as const) {
      expect(bankQs.map((q) => q.id)).toEqual(specs.map((s) => s.id));
      for (let i = 0; i < bankQs.length; i++) {
        expect(bankQs[i]!.instructions).toBe(specs[i]!.instructions);
        expect(bankQs[i]!.explanation).toBe(specs[i]!.explanation);
      }
    }
  });
});

describe("play resolve — לא נשבר אחרי הקטלוגים", () => {
  it("מסלול דגלים ומילים נפתח", () => {
    expect(resolvePlaySessionForSlug("flags-country-choice")?.kind).toBe("multiple-choice-playable");
    expect(resolvePlaySessionForSlug("en-words-to-picture")?.kind).toBe("multiple-choice-playable");
    expect(resolvePlaySessionForSlug("flags-country-on-map")?.kind).toBe("multiple-choice-playable");
  });
});
