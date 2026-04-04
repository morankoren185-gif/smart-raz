import type { GameDefinition } from "@/lib/game-types/registry";
import type { MatchingQuestion } from "@/lib/game-types/matching";

/** אות ↔ מילה שמתחילה בה — תוכן data-driven */
const gentle: MatchingQuestion[] = [
  {
    id: "he-match-g1",
    type: "matching",
    world: "hebrew",
    level: "gentle",
    instructions: "מוצאים זוגות: אות ומילה שמתחילה בה",
    skills: ["letter-recognition", "early-reading"],
    explanation: "חיבור בין אות לצליל התחלתי במילה.",
    textDirection: "rtl",
    pairs: [
      { pairId: "he-g1-p1", sideA: { label: "ב" }, sideB: { label: "בַּיִת" } },
      { pairId: "he-g1-p2", sideA: { label: "ד" }, sideB: { label: "דֹּב" } },
    ],
  },
];

const steady: MatchingQuestion[] = [
  {
    id: "he-match-s1",
    type: "matching",
    world: "hebrew",
    level: "steady",
    instructions: "בוחרים זוגות שמתאימים",
    skills: ["letter-recognition", "early-reading"],
    explanation: "שלושה זוגות.",
    textDirection: "rtl",
    pairs: [
      { pairId: "he-s1-p1", sideA: { label: "ש" }, sideB: { label: "שֶׁמֶשׁ" } },
      { pairId: "he-s1-p2", sideA: { label: "ל" }, sideB: { label: "לַיְלָה" } },
      { pairId: "he-s1-p3", sideA: { label: "ח" }, sideB: { label: "חַלָּה" } },
    ],
  },
];

const spark: MatchingQuestion[] = [
  {
    id: "he-match-p1",
    type: "matching",
    world: "hebrew",
    level: "spark",
    instructions: "עוד זוגות — בקצב שלך",
    skills: ["letter-recognition", "early-reading"],
    explanation: "ארבעה זוגות.",
    textDirection: "rtl",
    pairs: [
      { pairId: "he-p1-p1", sideA: { label: "מ" }, sideB: { label: "מַיִם" } },
      { pairId: "he-p1-p2", sideA: { label: "כ" }, sideB: { label: "כּוֹכָב" } },
      { pairId: "he-p1-p3", sideA: { label: "ר" }, sideB: { label: "רוּחַ" } },
      { pairId: "he-p1-p4", sideA: { label: "ע" }, sideB: { label: "עֵץ" } },
    ],
  },
];

export const hebrewLetterWordPairsDefinition: GameDefinition = {
  id: "he-letter-word-pairs",
  slug: "hebrew-letter-word-pairs",
  world: "hebrew",
  title: "אות ומילה",
  tagline: "מזווגים אות לתחילת מילה",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["matching"],
  banksByLevel: { gentle, steady, spark },
  skills: ["letter-recognition", "early-reading"],
  parentSummary: "זיהוי אות וקישור למילה מתחילה.",
};
