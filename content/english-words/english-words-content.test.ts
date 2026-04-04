import { describe, expect, it } from "vitest";
import {
  ENGLISH_WORDS_BY_LEVEL,
  englishWordIllustrationSrc,
  visualForEnglishWord,
} from "./lexicon";
import { ENGLISH_WORDS_MATCHING_SPARK_ROUNDS, ENGLISH_WORDS_SPARK_ORDERED } from "./curated-catalog";
import { GENTLE_CURATED_ENGLISH_WORDS } from "./gentle-curated";
import { STEADY_ORDERED_ENGLISH_WORDS } from "./steady-bridge-english";
import {
  buildEmojiWordMatchingBank,
  buildListenChooseBank,
  buildPictureToWordBank,
  buildWordToPictureBank,
} from "./question-factories";
import { buildMatchingPlayableCards } from "@/lib/play/buildMatchingPlayableCards";
import { mcQuestionToPlayableRound } from "@/lib/play/mapGameDefinitionToMultipleChoicePlayableGame";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";
import { ENGLISH_WORDS_GAME_DEFINITIONS } from "./english-words-games";
import { ENGLISH_WORD_MISSIONS, getEnglishWordMissionById } from "./english-word-missions";
import { getGameDefinitionsForWorld } from "@/content/game-definitions";
import { resolvePlaySessionForSlug } from "@/lib/play/resolvePlaySessionForSlug";

describe("English Words content", () => {
  it("מילים מתחלקות לפי שלוש רמות לפי המפרט", () => {
    expect(ENGLISH_WORDS_BY_LEVEL.gentle).toEqual([...GENTLE_CURATED_ENGLISH_WORDS]);
    expect(ENGLISH_WORDS_BY_LEVEL.steady).toEqual([...STEADY_ORDERED_ENGLISH_WORDS]);
    expect(ENGLISH_WORDS_BY_LEVEL.spark).toEqual([...ENGLISH_WORDS_SPARK_ORDERED]);
  });

  it("בנקי MC נולדים לכל רמה ומצביעים על עולם englishWords", () => {
    const b = buildWordToPictureBank();
    for (const level of ["gentle", "steady", "spark"] as const) {
      expect(b[level].length).toBe(ENGLISH_WORDS_BY_LEVEL[level].length);
      expect(b[level].every((q) => q.world === "englishWords")).toBe(true);
    }
    const listen = buildListenChooseBank();
    expect(listen.gentle[0]?.instructions).toContain("Listen");
  });

  it("המשחקים רשומים ב-registry וב-play", () => {
    const worldGames = getGameDefinitionsForWorld("englishWords");
    expect(worldGames.length).toBe(ENGLISH_WORDS_GAME_DEFINITIONS.length);
    for (const g of worldGames) {
      const resolved = resolvePlaySessionForSlug(g.slug);
      expect(resolved).toBeDefined();
      if (!resolved) throw new Error("expected resolved session");
      if (g.supportedQuestionTypes.includes("matching")) {
        expect(resolved.kind).toBe("matching-playable");
      } else {
        expect(resolved.kind).toBe("multiple-choice-playable");
      }
      expect(
        resolved.kind === "multiple-choice-playable"
          ? resolved.playable.worldId
          : resolved.kind === "matching-playable"
            ? resolved.playable.worldId
            : null,
      ).toBe("englishWords");
    }
  });

  it("קטלוג משימות — מסע אחרון חוזר על slugs ומזוהה", () => {
    const journey = getEnglishWordMissionById("ew-m-5-journey");
    expect(journey).toBeDefined();
    const slugs = journey!.steps.map((s) => s.gameSlug);
    expect(slugs.filter((s) => s === "en-words-to-picture").length).toBe(1);
    expect(slugs.filter((s) => s === "en-words-listen-choose").length).toBe(1);
    expect(ENGLISH_WORD_MISSIONS.length).toBe(5);
  });

  it("לקסיקון ויזואלי — imageSrc לסט ראשון, fallback למילים בלי איור", () => {
    expect(englishWordIllustrationSrc("cat")).toBe("/illustrations/english-words/cat.svg");
    const cat = visualForEnglishWord("cat");
    expect(cat.emoji).toBeTruthy();
    expect(cat.illustrationKey).toContain("cat");
    expect(cat.imageSrc).toBe("/illustrations/english-words/cat.svg");
    expect(visualForEnglishWord("mom").imageSrc).toBeUndefined();
    expect(visualForEnglishWord("unknownLex999").emoji).toBe("⭐");
  });

  it("תמונה-למילה: promptVisual + מיפוי לסיבוב משחק (כולל imageSrc אם קיים)", () => {
    const bank = buildPictureToWordBank();
    const q = bank.gentle[0]!;
    expect(q.promptVisual?.emoji).toBeTruthy();
    expect(q.promptVisual?.imageSrc).toContain("/illustrations/english-words/");
    expect(q.instructions).not.toContain("\n");
    const round = mcQuestionToPlayableRound(q);
    expect(round.promptVisual?.emoji).toBe(q.promptVisual?.emoji);
    expect(round.promptVisual?.imageSrc).toBe(q.promptVisual?.imageSrc);
  });

  it("מילה→תמונה: בחירות עם imageSrc נשענות על הלקסיקון", () => {
    const b = buildWordToPictureBank();
    const q = b.gentle.find((x) => x.id === "ew-w2p-gentle-0")!;
    expect(q.instructions.endsWith("cat")).toBe(true);
    const catKey = Object.keys(q.choices).find((k) => q.choices[k]?.altHe === "חתול");
    expect(catKey).toBeDefined();
    expect(q.choices[catKey!]?.imageSrc).toBe("/illustrations/english-words/cat.svg");
  });

  it("spark: matching נבנה מקטלוג ומכיל רק מילות spark", () => {
    const bank = buildEmojiWordMatchingBank();
    expect(bank.spark.length).toBe(ENGLISH_WORDS_MATCHING_SPARK_ROUNDS.length);
    const wordsInMatching = new Set(
      bank.spark.flatMap((q) => q.pairs.map((p) => p.sideB.label)),
    );
    const sparkSet = new Set<string>(ENGLISH_WORDS_SPARK_ORDERED);
    for (const w of wordsInMatching) {
      expect(sparkSet.has(w)).toBe(true);
    }
  });

  it("matching: צד א׳ מקבל imageSrc מהלקסיקון לזוגות רלוונטיים", () => {
    const bank = buildEmojiWordMatchingBank();
    const q = bank.gentle[0]!;
    const catPair = q.pairs.find((p) => p.sideB.label === "cat");
    expect(catPair?.sideA.imageSrc).toBe("/illustrations/english-words/cat.svg");
    const cards = buildMatchingPlayableCards(q);
    expect(cards.find((c) => c.cardId === "ew-g1-a")?.imageSrc).toContain("cat.svg");
  });

  it("מעביר imageSrc מהשאלה לכרטיסי בחירה ול-matching", () => {
    const mc: MultipleChoiceQuestion = {
      id: "ew-test-mc",
      type: "multiple-choice",
      world: "englishWords",
      level: "gentle",
      instructions: "Pick one",
      skills: ["early-reading"],
      explanation: "test",
      correctAnswer: "a",
      distractors: ["b"],
      choices: {
        a: { label: "", emoji: "🐱", imageSrc: "/_test/cat.webp", altHe: "חתול" },
        b: { label: "", emoji: "🐶", altHe: "כלב" },
      },
      textDirection: "ltr",
    };
    const r = mcQuestionToPlayableRound(mc);
    expect(r.choices.find((c) => c.id === "a")?.imageSrc).toBe("/_test/cat.webp");

    const matchBank = buildEmojiWordMatchingBank();
    const mq = {
      ...matchBank.gentle[0]!,
      pairs: [
        {
          pairId: "t1",
          sideA: { label: "", emoji: "🐱", imageSrc: "/_test/x.png", altHe: "חתול" },
          sideB: { label: "cat" },
        },
      ],
    };
    const cards = buildMatchingPlayableCards(mq);
    expect(cards.find((c) => c.cardId === "t1-a")?.imageSrc).toBe("/_test/x.png");
  });
});
