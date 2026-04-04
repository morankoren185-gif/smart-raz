import type { DifficultyKey } from "@/content/types";

/** שלב במסלול — מצביע על משחק קיים לפי slug */
export type FlagMissionStep = Readonly<{
  id: string;
  gameSlug: string;
  /** כותרת קצרה לילד */
  label: string;
  /** סוג תרגול לתצוגה בלבד */
  practiceKind: "flag-to-name" | "matching" | "map-country";
  /** המלצת רמה לטקסט עידוד — המשחק עצמו משתמש ב־progress בעולם */
  suggestedDifficulty?: DifficultyKey;
}>;

export type FlagMission = Readonly<{
  id: string;
  title: string;
  /** תיאור אזור / נושא למסע */
  region: string;
  focusCountries: readonly string[];
  /** משפט קצר וחיובי */
  description: string;
  steps: readonly FlagMissionStep[];
  /** חותמת קטנה (אימוג׳י או מזהה קצר) */
  stampId: string;
  /** סדר בתצוגה */
  sortOrder: number;
  /** משימה שחייבת להיחשב הושלמה לפני פתיחה */
  requiresCompletedMissionId?: string;
}>;

/**
 * מסלול MVP בעולם הדגלים — כל שלב הוא משחק קיים.
 * פתיחת משימות: ליניארי לפי `requiresCompletedMissionId` (לא לפי ספי כוכבים; כוכבים = מפה + רמות).
 * איזון כוכבים/מפה/רמות: `lib/progress/progression-tuning.ts`.
 * השלמה: לפי flags-missions-sync — משימות ללא חפיפה עם משימות מוקדמות נסמכות על
 * flags.completedGameSlugs; משימות שחוזרות על slugs ממסלול קודם דורשות ביצוע
 * גם ב־flagsMissionProgress.completedSlugsByMissionId (לאחר סיום משחק עם ?flagsMission=).
 */
export const FLAG_MISSIONS: readonly FlagMission[] = [
  {
    id: "flags-m-1-starter",
    title: "מתחילים עם דגלים ברורים",
    region: "פתיחה חמה",
    focusCountries: [],
    description: "מזהים דגל ומחברים לשם המדינה — בלי לחץ.",
    sortOrder: 1,
    stampId: "⭐️",
    steps: [
      {
        id: "s1-mc",
        gameSlug: "flags-country-choice",
        label: "דגל ושם מדינה",
        practiceKind: "flag-to-name",
        suggestedDifficulty: "gentle",
      },
    ],
  },
  {
    id: "flags-m-2-pairs",
    title: "זוגות דגלים",
    region: "התאמות",
    focusCountries: [],
    description: "מחברים דגל למדינה שלו בזוגות צבעוניים.",
    sortOrder: 2,
    stampId: "🧩",
    requiresCompletedMissionId: "flags-m-1-starter",
    steps: [
      {
        id: "s2-match",
        gameSlug: "flags-flag-matching",
        label: "התאמת דגל למדינה",
        practiceKind: "matching",
        suggestedDifficulty: "gentle",
      },
    ],
  },
  {
    id: "flags-m-3-map",
    title: "מזהים על המפה",
    region: "מפה פשוטה",
    focusCountries: [],
    description: "רואים מדינה מסומנת ובוחרים את שמה.",
    sortOrder: 3,
    stampId: "🗺️",
    requiresCompletedMissionId: "flags-m-2-pairs",
    steps: [
      {
        id: "s3-map",
        gameSlug: "flags-country-on-map",
        label: "מדינה על המפה",
        practiceKind: "map-country",
        suggestedDifficulty: "gentle",
      },
    ],
  },
  {
    id: "flags-m-4-journey",
    title: "מסע קטן בין יבשות",
    region: "סיבוב משולב",
    focusCountries: ["ישראל", "יפן", "אוסטרליה", "ברזיל"],
    description: "עוברים על דגלים, זיווגים ומפה — עם מדינות מספר מפות שונות.",
    sortOrder: 4,
    stampId: "🚀",
    requiresCompletedMissionId: "flags-m-3-map",
    steps: [
      {
        id: "s4a",
        gameSlug: "flags-country-choice",
        label: "דגלים",
        practiceKind: "flag-to-name",
        suggestedDifficulty: "steady",
      },
      {
        id: "s4b",
        gameSlug: "flags-flag-matching",
        label: "זוגות",
        practiceKind: "matching",
        suggestedDifficulty: "steady",
      },
      {
        id: "s4c",
        gameSlug: "flags-country-on-map",
        label: "מפה",
        practiceKind: "map-country",
        suggestedDifficulty: "steady",
      },
    ],
  },
];

export function getFlagMissionById(id: string): FlagMission | undefined {
  return FLAG_MISSIONS.find((m) => m.id === id);
}
