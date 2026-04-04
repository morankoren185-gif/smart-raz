import type { GameModule } from "../types";

/**
 * חשבון: ספירה וחיבור עדין — תוכן בלבד.
 */
function stars(n: number): string {
  return "⭐️".repeat(Math.min(n, 10));
}

export const mathStarCount: GameModule = {
  id: "math-star-count",
  slug: "math-star-count",
  worldId: "math",
  title: "סופרים כוכבים",
  tagline: "סופרים ומשווים — בקצב נעים",
  learningGoal: "ספירה, השוואה קטנה, וחיבור פשוט בתוך טווח בטוח לגיל 5–7.",
  banks: {
    gentle: [
      {
        id: "mg1",
        prompt: `כמה כוכבים?\n${stars(2)}`,
        direction: "rtl",
        correctChoiceId: "2",
        choices: [
          { id: "1", label: "1" },
          { id: "2", label: "2" },
          { id: "3", label: "3" },
        ],
      },
      {
        id: "mg2",
        prompt: `כמה כוכבים?\n${stars(4)}`,
        direction: "rtl",
        correctChoiceId: "4",
        choices: [
          { id: "3", label: "3" },
          { id: "4", label: "4" },
        ],
      },
      {
        id: "mg3",
        prompt: "מה גדול יותר?",
        direction: "rtl",
        correctChoiceId: "7",
        choices: [
          { id: "5", label: "5" },
          { id: "7", label: "7" },
        ],
      },
      {
        id: "mg4",
        prompt: "2 ועוד 1 זה…",
        direction: "rtl",
        correctChoiceId: "3",
        choices: [
          { id: "2", label: "2" },
          { id: "3", label: "3" },
          { id: "4", label: "4" },
        ],
      },
      {
        id: "mg5",
        prompt: `כמה יחד?\n${stars(1)} + ${stars(1)}`,
        direction: "rtl",
        correctChoiceId: "2",
        choices: [
          { id: "1", label: "1" },
          { id: "2", label: "2" },
        ],
      },
    ],
    steady: [
      {
        id: "ms1",
        prompt: `כמה כוכבים?\n${stars(6)}`,
        direction: "rtl",
        correctChoiceId: "6",
        choices: [
          { id: "5", label: "5" },
          { id: "6", label: "6" },
          { id: "7", label: "7" },
          { id: "8", label: "8" },
        ],
      },
      {
        id: "ms2",
        prompt: "3 ועוד 2 זה…",
        direction: "rtl",
        correctChoiceId: "5",
        choices: [
          { id: "4", label: "4" },
          { id: "5", label: "5" },
          { id: "6", label: "6" },
        ],
      },
    ],
    spark: [
      {
        id: "mp1",
        prompt: "4 ועוד 3 זה…",
        direction: "rtl",
        correctChoiceId: "7",
        choices: [
          { id: "6", label: "6" },
          { id: "7", label: "7" },
          { id: "8", label: "8" },
          { id: "9", label: "9" },
        ],
      },
      {
        id: "mp2",
        prompt: `ספירה מהירה:\n${stars(9)}`,
        direction: "rtl",
        correctChoiceId: "9",
        choices: [
          { id: "8", label: "8" },
          { id: "9", label: "9" },
          { id: "10", label: "10" },
        ],
      },
    ],
  },
};
