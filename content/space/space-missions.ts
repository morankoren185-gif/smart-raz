import type { DifficultyKey } from "@/content/types";

export type SpaceMissionStep = Readonly<{
  id: string;
  gameSlug: string;
  label: string;
  practiceKind:
    | "planet-to-name"
    | "name-to-planet"
    | "matching"
    | "planet-order-mc"
    | "planet-order-matching";
  suggestedDifficulty?: DifficultyKey;
}>;

export type SpaceMission = Readonly<{
  id: string;
  title: string;
  region: string;
  focusPlanets: readonly string[];
  description: string;
  steps: readonly SpaceMissionStep[];
  stampId: string;
  sortOrder: number;
  requiresCompletedMissionId?: string;
}>;

/**
 * מסלול MVP לעולם החלל — כל שלב הוא משחק קיים.
 * משימת המסע האחרונה חוזרת על slugs — נדרשת השלמה לפי־משימה
 * (`spaceMissionProgress.completedSlugsByMissionId`), כמו ב־flags.
 */
export const SPACE_MISSIONS: readonly SpaceMission[] = [
  {
    id: "space-m-1-known",
    title: "מכירים כוכבים מוכרים",
    region: "התחלה רגועה",
    focusPlanets: ["Earth", "Mars", "Jupiter", "Saturn"],
    description: "רואים כוכב ובוחרים את שמו — קל וברור.",
    sortOrder: 1,
    stampId: "🔭",
    steps: [
      {
        id: "space-s1-p2n",
        gameSlug: "space-planet-to-name",
        label: "כוכב לשם",
        practiceKind: "planet-to-name",
        suggestedDifficulty: "gentle",
      },
    ],
  },
  {
    id: "space-m-2-name-planet",
    title: "שם וכוכב",
    region: "מחברים שני כיוונים",
    focusPlanets: ["Earth", "Mars", "Jupiter"],
    description: "קוראים שם ובוחרים את הכוכב הנכון.",
    sortOrder: 2,
    stampId: "✨",
    requiresCompletedMissionId: "space-m-1-known",
    steps: [
      {
        id: "space-s2-n2p",
        gameSlug: "space-name-to-planet",
        label: "שם לכוכב",
        practiceKind: "name-to-planet",
        suggestedDifficulty: "gentle",
      },
    ],
  },
  {
    id: "space-m-3-matching",
    title: "מזווגים כוכבים",
    region: "זוגות מתאימים",
    focusPlanets: ["Earth", "Mars", "Jupiter", "Saturn"],
    description: "מחברים כל כוכב לשם שלו — בקצב נעים.",
    sortOrder: 3,
    stampId: "🧩",
    requiresCompletedMissionId: "space-m-2-name-planet",
    steps: [
      {
        id: "space-s3-match",
        gameSlug: "space-planet-matching",
        label: "מזווגים",
        practiceKind: "matching",
        suggestedDifficulty: "gentle",
      },
    ],
  },
  {
    id: "space-m-4-journey",
    title: "מסע חלל קטן",
    region: "סיבוב משולב",
    focusPlanets: ["Venus", "Neptune", "Mercury"],
    description: "שלושה צעדים קצרים — כמו מסלול אחד שלם בחלל.",
    sortOrder: 4,
    stampId: "🚀",
    requiresCompletedMissionId: "space-m-3-matching",
    steps: [
      {
        id: "space-s4a-p2n",
        gameSlug: "space-planet-to-name",
        label: "כוכב לשם",
        practiceKind: "planet-to-name",
        suggestedDifficulty: "steady",
      },
      {
        id: "space-s4b-n2p",
        gameSlug: "space-name-to-planet",
        label: "שם לכוכב",
        practiceKind: "name-to-planet",
        suggestedDifficulty: "steady",
      },
      {
        id: "space-s4c-match",
        gameSlug: "space-planet-matching",
        label: "מזווגים",
        practiceKind: "matching",
        suggestedDifficulty: "steady",
      },
    ],
  },
  {
    id: "space-m-5-solar-order",
    title: "סדר מהשמש",
    region: "מספור רגוע",
    focusPlanets: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
    description: "שאלות קצרות על לפני ואחרי — ואז זיווג כוכב למספר במסלול.",
    sortOrder: 5,
    stampId: "☀️",
    requiresCompletedMissionId: "space-m-4-journey",
    steps: [
      {
        id: "space-s5a-ord-mc",
        gameSlug: "space-planet-order-mc",
        label: "לפני ואחרי",
        practiceKind: "planet-order-mc",
        suggestedDifficulty: "gentle",
      },
      {
        id: "space-s5b-ord-match",
        gameSlug: "space-planet-order-matching",
        label: "מקום במסלול",
        practiceKind: "planet-order-matching",
        suggestedDifficulty: "gentle",
      },
    ],
  },
];

export function getSpaceMissionById(id: string): SpaceMission | undefined {
  return SPACE_MISSIONS.find((m) => m.id === id);
}
