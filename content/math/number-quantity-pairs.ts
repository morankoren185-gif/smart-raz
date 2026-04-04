import type { GameDefinition } from "@/lib/game-types/registry";
import type { MatchingQuestion } from "@/lib/game-types/matching";

function stars(n: number): string {
  return "⭐️".repeat(Math.min(n, 10));
}

/** מספר ↔ כמות (אימוג'י כוכבים) או תרגיל ↔ תוצאה */
const gentle: MatchingQuestion[] = [
  {
    id: "math-match-g1",
    type: "matching",
    world: "math",
    level: "gentle",
    instructions: "מחברים מספר לכמות הכוכבים",
    skills: ["counting", "number-sense"],
    explanation: "ספירה עד 3.",
    textDirection: "rtl",
    pairs: [
      { pairId: "m-g1-p1", sideA: { label: "1" }, sideB: { label: stars(1) } },
      { pairId: "m-g1-p2", sideA: { label: "2" }, sideB: { label: stars(2) } },
    ],
  },
  {
    id: "math-match-g2",
    type: "matching",
    world: "math",
    level: "gentle",
    instructions: "תרגיל קטן ↔ תוצאה",
    skills: ["addition", "counting"],
    explanation: "חיבור בתוך 5.",
    textDirection: "rtl",
    pairs: [
      { pairId: "m-g2-p1", sideA: { label: "1+1" }, sideB: { label: "2" } },
      { pairId: "m-g2-p2", sideA: { label: "2+1" }, sideB: { label: "3" } },
    ],
  },
];

const steady: MatchingQuestion[] = [
  {
    id: "math-match-s1",
    type: "matching",
    world: "math",
    level: "steady",
    instructions: "זוגות של מספרים וכוכבים",
    skills: ["counting", "number-sense"],
    explanation: "ספירה עד 5.",
    textDirection: "rtl",
    pairs: [
      { pairId: "m-s1-p1", sideA: { label: "3" }, sideB: { label: stars(3) } },
      { pairId: "m-s1-p2", sideA: { label: "4" }, sideB: { label: stars(4) } },
      { pairId: "m-s1-p3", sideA: { label: "5" }, sideB: { label: stars(5) } },
    ],
  },
];

const spark: MatchingQuestion[] = [
  {
    id: "math-match-p1",
    type: "matching",
    world: "math",
    level: "spark",
    instructions: "קצת יותר זוגות — עדיין בקצב נעים",
    skills: ["counting", "addition", "number-sense"],
    explanation: "שילוב ספירה וחיבור קטן.",
    textDirection: "rtl",
    pairs: [
      { pairId: "m-p1-p1", sideA: { label: "6" }, sideB: { label: stars(6) } },
      { pairId: "m-p1-p2", sideA: { label: "7" }, sideB: { label: stars(7) } },
      { pairId: "m-p1-p3", sideA: { label: "2+2" }, sideB: { label: "4" } },
      { pairId: "m-p1-p4", sideA: { label: "3+2" }, sideB: { label: "5" } },
    ],
  },
];

export const mathNumberQuantityPairsDefinition: GameDefinition = {
  id: "math-number-quantity-pairs",
  slug: "math-number-quantity-pairs",
  world: "math",
  title: "מספר וכמות",
  tagline: "מזווגים מספר לקבוצה או לתוצאה",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["matching"],
  banksByLevel: { gentle, steady, spark },
  skills: ["counting", "number-sense"],
  parentSummary: "ספירה, כמות וחיבור פשוט בהתאמות.",
};
