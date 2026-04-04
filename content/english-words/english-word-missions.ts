import type { DifficultyKey } from "@/content/types";

export type EnglishWordMissionStep = Readonly<{
  id: string;
  gameSlug: string;
  label: string;
  practiceKind: "word-to-picture" | "picture-to-word" | "listen" | "build" | "matching";
  suggestedDifficulty?: DifficultyKey;
}>;

export type EnglishWordMission = Readonly<{
  id: string;
  title: string;
  theme: string;
  focusWords: readonly string[];
  description: string;
  steps: readonly EnglishWordMissionStep[];
  stampId: string;
  sortOrder: number;
  requiresCompletedMissionId?: string;
}>;

/**
 * מסלול משימות — מקביל ל־flags: השלמה לפי slugs; חזרה על slug דורשת הקפת המשימה כשיש חפיפה.
 */
export const ENGLISH_WORD_MISSIONS: readonly EnglishWordMission[] = [
  {
    id: "ew-m-1-word-picture",
    title: "מתחילים: מילה ותמונה",
    theme: "פתיחה חמה",
    focusWords: [],
    description: "קוראים מילה קצרה ובוחרים את התמונה — הרבה הצלחות קטנות.",
    sortOrder: 1,
    stampId: "📗",
    steps: [
      {
        id: "ew-s1-w2p",
        gameSlug: "en-words-to-picture",
        label: "מילה לתמונה",
        practiceKind: "word-to-picture",
        suggestedDifficulty: "gentle",
      },
    ],
  },
  {
    id: "ew-m-2-match",
    title: "זוגות צבעוניים",
    theme: "התאמות",
    focusWords: [],
    description: "מחברים כל תמונה למילה שלה באנגלית.",
    sortOrder: 2,
    stampId: "🧩",
    requiresCompletedMissionId: "ew-m-1-word-picture",
    steps: [
      {
        id: "ew-s2-match",
        gameSlug: "en-words-match",
        label: "מזווגים תמונה ומילה",
        practiceKind: "matching",
        suggestedDifficulty: "gentle",
      },
    ],
  },
  {
    id: "ew-m-3-picture-word",
    title: "מה המילה?",
    theme: "קריאה מהירה",
    focusWords: [],
    description: "רואים תומך חזותי ובוחרים את המילה הנכונה.",
    sortOrder: 3,
    stampId: "🔤",
    requiresCompletedMissionId: "ew-m-2-match",
    steps: [
      {
        id: "ew-s3-p2w",
        gameSlug: "en-words-picture-to-word",
        label: "תמונה למילה",
        practiceKind: "picture-to-word",
        suggestedDifficulty: "steady",
      },
    ],
  },
  {
    id: "ew-m-4-listen",
    title: "אוזן טובה",
    theme: "הקשבה",
    focusWords: [],
    description: "שומעים את המילה (כפתור הקשבה) ובוחרים נכון.",
    sortOrder: 4,
    stampId: "👂",
    requiresCompletedMissionId: "ew-m-3-picture-word",
    steps: [
      {
        id: "ew-s4-listen",
        gameSlug: "en-words-listen-choose",
        label: "שומעים ובוחרים",
        practiceKind: "listen",
        suggestedDifficulty: "steady",
      },
    ],
  },
  {
    id: "ew-m-5-journey",
    title: "מסע קטן באנגלית",
    theme: "משולב",
    focusWords: ["build", "review", "listen"],
    description: "בונים מילה, חוזרים לתמונה, ומסיימים בהקשבה — כולם ברמה יציבה.",
    sortOrder: 5,
    stampId: "🚀",
    requiresCompletedMissionId: "ew-m-4-listen",
    steps: [
      {
        id: "ew-s5a-build",
        gameSlug: "en-words-build-order",
        label: "בונים מילה",
        practiceKind: "build",
        suggestedDifficulty: "steady",
      },
      {
        id: "ew-s5b-w2p",
        gameSlug: "en-words-to-picture",
        label: "עוד מילה לתמונה",
        practiceKind: "word-to-picture",
        suggestedDifficulty: "steady",
      },
      {
        id: "ew-s5c-listen",
        gameSlug: "en-words-listen-choose",
        label: "שומעים שוב",
        practiceKind: "listen",
        suggestedDifficulty: "steady",
      },
    ],
  },
];

export function getEnglishWordMissionById(id: string): EnglishWordMission | undefined {
  return ENGLISH_WORD_MISSIONS.find((m) => m.id === id);
}
