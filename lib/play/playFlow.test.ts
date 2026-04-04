import { describe, expect, it } from "vitest";
import { getGameDefinitionBySlug } from "@/content/game-definitions";
import {
  mapGameDefinitionToMultipleChoicePlayableGame,
  mcQuestionToPlayableRound,
} from "@/lib/play/mapGameDefinitionToMultipleChoicePlayableGame";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";
import { resolvePlaySessionForSlug } from "@/lib/play/resolvePlaySessionForSlug";
import { mapGameDefinitionToMatchingPlayableGame } from "@/lib/play/mapGameDefinitionToMatchingPlayableGame";
import {
  buildMatchingPlayableCards,
  prepareMatchingPuzzleFromBank,
} from "@/lib/play/buildMatchingPlayableCards";
import type { MatchingQuestion } from "@/lib/game-types/matching";

const MVP_SLUGS = [
  "english-word-shuttle",
  "hebrew-letter-orbit",
  "math-star-count",
] as const;

describe("resolvePlaySessionForSlug", () => {
  it.each(MVP_SLUGS)("מחזיר multiple-choice-playable עבור %s", (slug) => {
    const resolved = resolvePlaySessionForSlug(slug);
    expect(resolved?.kind).toBe("multiple-choice-playable");
    expect(resolved && resolved.kind === "multiple-choice-playable" && resolved.playable.slug).toBe(
      slug,
    );
  });

  it("מחזיר undefined ל-slug לא קיים", () => {
    expect(resolvePlaySessionForSlug("unknown-game-slug")).toBeUndefined();
  });

  it("מחזיר matching-playable עבור english-emoji-pairs", () => {
    const resolved = resolvePlaySessionForSlug("english-emoji-pairs");
    expect(resolved?.kind).toBe("matching-playable");
    if (resolved?.kind === "matching-playable") {
      expect(resolved.playable.slug).toBe("english-emoji-pairs");
      expect(resolved.playable.banks.gentle.length).toBeGreaterThan(0);
    }
  });
});

describe("mapGameDefinitionToMultipleChoicePlayableGame", () => {
  it("שומר מטא-דאטה ובנקים לא ריקים בכל רמה — word-shuttle", () => {
    const def = getGameDefinitionBySlug("english-word-shuttle");
    expect(def).toBeDefined();
    const playable = mapGameDefinitionToMultipleChoicePlayableGame(def!);
    expect(playable.id).toBe("en-word-shuttle");
    expect(playable.slug).toBe("english-word-shuttle");
    expect(playable.worldId).toBe("english");
    expect(playable.title).toBe("מעבורת המילים");
    for (const level of ["gentle", "steady", "spark"] as const) {
      expect(playable.banks[level].length).toBeGreaterThan(0);
    }
  });
});

describe("mapGameDefinitionToMatchingPlayableGame", () => {
  it("שומר מטא-דאטה ובנקים — emoji-pairs", () => {
    const def = getGameDefinitionBySlug("english-emoji-pairs");
    expect(def).toBeDefined();
    const playable = mapGameDefinitionToMatchingPlayableGame(def!);
    expect(playable.id).toBe("en-emoji-pairs");
    expect(playable.worldId).toBe("english");
    expect(playable.title).toBe("זוגות צבעוניים");
    for (const level of ["gentle", "steady", "spark"] as const) {
      expect(playable.banks[level].length).toBeGreaterThan(0);
    }
  });
});

describe("buildMatchingPlayableCards", () => {
  it("יוצר שני כרטיסים לכל זוג", () => {
    const q: MatchingQuestion = {
      id: "mq1",
      type: "matching",
      world: "math",
      level: "gentle",
      instructions: "test",
      skills: ["counting"],
      explanation: "e",
      textDirection: "rtl",
      pairs: [
        { pairId: "x", sideA: { label: "1" }, sideB: { label: "אחת" } },
        { pairId: "y", sideA: { label: "2" }, sideB: { label: "שתיים" } },
      ],
    };
    const cards = buildMatchingPlayableCards(q);
    expect(cards).toHaveLength(4);
    expect(cards.filter((c) => c.pairId === "x")).toHaveLength(2);
    const prep = prepareMatchingPuzzleFromBank([q]);
    expect(prep?.question.id).toBe("mq1");
    expect(prep?.cards.length).toBe(4);
  });
});

describe("mcQuestionToPlayableRound", () => {
  it("מעתיק הוראות, כיוון, תשובה נכונה ואפשרויות", () => {
    const q: MultipleChoiceQuestion = {
      id: "test-q",
      type: "multiple-choice",
      world: "math",
      level: "gentle",
      instructions: "כמה?",
      skills: ["counting"],
      explanation: "להורה",
      correctAnswer: "2",
      distractors: ["1"],
      choices: {
        "1": { label: "1" },
        "2": { label: "2" },
      },
      textDirection: "rtl",
    };
    const round = mcQuestionToPlayableRound(q);
    expect(round.id).toBe("test-q");
    expect(round.prompt).toBe("כמה?");
    expect(round.direction).toBe("rtl");
    expect(round.correctChoiceId).toBe("2");
    expect(round.choices).toHaveLength(2);
    expect(round.choices.find((c) => c.id === "2")?.label).toBe("2");
  });
});
