import type { GameDefinition } from "@/lib/game-types/registry";
import type { MatchingQuestion } from "@/lib/game-types/matching";

/**
 * התאמת מילה באנגלית לאימוג'י — תוכן data-driven בלבד.
 */
const gentle: MatchingQuestion[] = [
  {
    id: "en-match-g1",
    type: "matching",
    world: "english",
    level: "gentle",
    instructions: "Find pairs — word and picture",
    skills: ["vocabulary-receptive"],
    explanation: "התאמה לקליט של מילים באנגלית לאימוג'י.",
    textDirection: "ltr",
    pairs: [
      {
        pairId: "en-g1-p1",
        sideA: { label: "sun" },
        sideB: { label: "", emoji: "☀️" },
      },
      {
        pairId: "en-g1-p2",
        sideA: { label: "moon" },
        sideB: { label: "", emoji: "🌙" },
      },
    ],
  },
];

const steady: MatchingQuestion[] = [
  {
    id: "en-match-s1",
    type: "matching",
    world: "english",
    level: "steady",
    instructions: "Match each word to its picture",
    skills: ["vocabulary-receptive"],
    explanation: "זוגות נוספים באותה רמה.",
    textDirection: "ltr",
    pairs: [
      { pairId: "en-s1-p1", sideA: { label: "apple" }, sideB: { label: "", emoji: "🍎" } },
      { pairId: "en-s1-p2", sideA: { label: "bus" }, sideB: { label: "", emoji: "🚌" } },
      { pairId: "en-s1-p3", sideA: { label: "fish" }, sideB: { label: "", emoji: "🐠" } },
    ],
  },
];

const spark: MatchingQuestion[] = [
  {
    id: "en-match-p1",
    type: "matching",
    world: "english",
    level: "spark",
    instructions: "A little more — match all pairs",
    skills: ["vocabulary-receptive"],
    explanation: "ארבעה זוגות בפאזל אחד.",
    textDirection: "ltr",
    pairs: [
      { pairId: "en-p1-p1", sideA: { label: "house" }, sideB: { label: "", emoji: "🏠" } },
      { pairId: "en-p1-p2", sideA: { label: "star" }, sideB: { label: "", emoji: "⭐" } },
      { pairId: "en-p1-p3", sideA: { label: "lion" }, sideB: { label: "", emoji: "🦁" } },
      { pairId: "en-p1-p4", sideA: { label: "blue" }, sideB: { label: "", emoji: "🟦" } },
    ],
  },
];

export const englishEmojiPairsDefinition: GameDefinition = {
  id: "en-emoji-pairs",
  slug: "english-emoji-pairs",
  world: "english",
  title: "זוגות צבעוניים",
  tagline: "מחברים מילה לתמונה",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["matching"],
  banksByLevel: { gentle, steady, spark },
  skills: ["vocabulary-receptive"],
  parentSummary: "התאמת מילים באנגלית לאימוג'י — חיזוק אוצר קליט.",
};
