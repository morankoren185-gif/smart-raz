import { FLAG_EXTENDED_LABEL_HE } from "@/content/flags/curated-catalog";
import type { FlagMission } from "@/content/flags/flag-missions";
import { getFlagKeysInRegion, type FlagRegionId } from "@/content/flags/flag-regions";

/** מסע אזורי — נבנה ל־FlagMission אחיד למסך משימה ולסנכרון */
export type FlagRegionMissionSpec = Readonly<{
  id: string;
  title: string;
  regionId: FlagRegionId;
  description: string;
  focusCountries: readonly string[];
  steps: FlagMission["steps"];
  stampId: string;
  sortOrder: number;
  requiresCompletedMissionId?: string;
}>;

const REGION_TITLE_HE: Record<FlagRegionId, string> = {
  europe: "אירופה",
  middleEast: "המזרח התיכון",
  southAmerica: "דרום אמריקה",
  northAmerica: "צפון אמריקה",
  asia: "אסיה",
  africa: "אפריקה",
  oceania: "אוקיאניה",
  northAtlantic: "צפון האטלנטי",
};

function labelsForRegion(regionId: FlagRegionId): readonly string[] {
  return getFlagKeysInRegion(regionId).map((k) => FLAG_EXTENDED_LABEL_HE[k]);
}

function toFlagMission(spec: FlagRegionMissionSpec): FlagMission {
  return {
    id: spec.id,
    title: spec.title,
    region: REGION_TITLE_HE[spec.regionId],
    regionId: spec.regionId,
    focusCountries: spec.focusCountries,
    description: spec.description,
    steps: spec.steps,
    stampId: spec.stampId,
    sortOrder: spec.sortOrder,
    requiresCompletedMissionId: spec.requiresCompletedMissionId,
  };
}

const REGION_SPECS: readonly FlagRegionMissionSpec[] = [
  {
    id: "flags-region-europe",
    title: "מסע באירופה",
    regionId: "europe",
    description: "מתרגלים דגלים ומפות מהמדינות המוכרות באירופה — ברוגע ובקצב שלך.",
    focusCountries: labelsForRegion("europe"),
    sortOrder: 10,
    stampId: "🏰",
    requiresCompletedMissionId: "flags-m-4-journey",
    steps: [
      {
        id: "eu-mc",
        gameSlug: "flags-country-choice",
        label: "דגלים מהאזור",
        practiceKind: "flag-to-name",
        suggestedDifficulty: "steady",
      },
      {
        id: "eu-match",
        gameSlug: "flags-flag-matching",
        label: "זוגות באירופה",
        practiceKind: "matching",
        suggestedDifficulty: "steady",
      },
      {
        id: "eu-map",
        gameSlug: "flags-country-on-map",
        label: "מדינות על המפה",
        practiceKind: "map-country",
        suggestedDifficulty: "steady",
      },
    ],
  },
  {
    id: "flags-region-asia",
    title: "מסע באסיה",
    regionId: "asia",
    description: "יפן, סין והודו — מזהים דגלים ומיקום, צעד אחר צעד.",
    focusCountries: labelsForRegion("asia"),
    sortOrder: 11,
    stampId: "🐉",
    requiresCompletedMissionId: "flags-m-4-journey",
    steps: [
      {
        id: "as-mc",
        gameSlug: "flags-country-choice",
        label: "דגלים באסיה",
        practiceKind: "flag-to-name",
        suggestedDifficulty: "steady",
      },
      {
        id: "as-match",
        gameSlug: "flags-flag-matching",
        label: "זוגות",
        practiceKind: "matching",
        suggestedDifficulty: "spark",
      },
      {
        id: "as-map",
        gameSlug: "flags-country-on-map",
        label: "על המפה",
        practiceKind: "map-country",
        suggestedDifficulty: "spark",
      },
    ],
  },
  {
    id: "flags-region-south-america",
    title: "מסע בדרום אמריקה",
    regionId: "southAmerica",
    description: "ברזיל, צ׳ילה וארגנטינה — אותם משחקים, תוכן מהאזור.",
    focusCountries: labelsForRegion("southAmerica"),
    sortOrder: 12,
    stampId: "🦜",
    requiresCompletedMissionId: "flags-m-4-journey",
    steps: [
      {
        id: "sa-mc",
        gameSlug: "flags-country-choice",
        label: "דגלים בדרום",
        practiceKind: "flag-to-name",
        suggestedDifficulty: "steady",
      },
      {
        id: "sa-match",
        gameSlug: "flags-flag-matching",
        label: "זיווגים",
        practiceKind: "matching",
        suggestedDifficulty: "steady",
      },
      {
        id: "sa-map",
        gameSlug: "flags-country-on-map",
        label: "על המפה",
        practiceKind: "map-country",
        suggestedDifficulty: "steady",
      },
    ],
  },
  {
    id: "flags-region-africa",
    title: "מסע באפריקה",
    regionId: "africa",
    description: "פוקוס על דרום אפריקה — רמת ניצוצות כדי לפגוש את הדגל באוצר.",
    focusCountries: labelsForRegion("africa"),
    sortOrder: 13,
    stampId: "🦁",
    requiresCompletedMissionId: "flags-m-4-journey",
    steps: [
      {
        id: "af-mc",
        gameSlug: "flags-country-choice",
        label: "דגל מהאזור",
        practiceKind: "flag-to-name",
        suggestedDifficulty: "spark",
      },
      {
        id: "af-match",
        gameSlug: "flags-flag-matching",
        label: "התאמה",
        practiceKind: "matching",
        suggestedDifficulty: "spark",
      },
      {
        id: "af-map",
        gameSlug: "flags-country-on-map",
        label: "מפה",
        practiceKind: "map-country",
        suggestedDifficulty: "spark",
      },
    ],
  },
  {
    id: "flags-region-north-america",
    title: "מסע בצפון אמריקה",
    regionId: "northAmerica",
    description: "קנדה, ארצות הברית ומקסיקו — תרגול מעורב בקצב נוח.",
    focusCountries: labelsForRegion("northAmerica"),
    sortOrder: 14,
    stampId: "🍁",
    requiresCompletedMissionId: "flags-m-4-journey",
    steps: [
      {
        id: "na-mc",
        gameSlug: "flags-country-choice",
        label: "דגלים בצפון",
        practiceKind: "flag-to-name",
        suggestedDifficulty: "steady",
      },
      {
        id: "na-match",
        gameSlug: "flags-flag-matching",
        label: "זוגות",
        practiceKind: "matching",
        suggestedDifficulty: "spark",
      },
      {
        id: "na-map",
        gameSlug: "flags-country-on-map",
        label: "על המפה",
        practiceKind: "map-country",
        suggestedDifficulty: "spark",
      },
    ],
  },
  {
    id: "flags-region-middle-east",
    title: "מסע קטן במזרח התיכון",
    regionId: "middleEast",
    description:
      "דגלים מישראל ומצרים שכבר הכרנו, ועוד מדינות מהמפרץ והסביבה — מתחילים בבחירה רגועה, ממשיכים בזיווגים, ומסיימים על מפה אחת פשוטה.",
    focusCountries: labelsForRegion("middleEast"),
    sortOrder: 15,
    stampId: "🕌",
    requiresCompletedMissionId: "flags-m-4-journey",
    steps: [
      {
        id: "me-mc",
        gameSlug: "flags-country-choice",
        label: "מזהים דגל — מהאזור שלנו",
        practiceKind: "flag-to-name",
        suggestedDifficulty: "steady",
      },
      {
        id: "me-match",
        gameSlug: "flags-flag-matching",
        label: "מחברים דגל לשם הנכון",
        practiceKind: "matching",
        suggestedDifficulty: "spark",
      },
      {
        id: "me-map",
        gameSlug: "flags-country-on-map",
        label: "על המפה — איפה כל מדינה?",
        practiceKind: "map-country",
        suggestedDifficulty: "spark",
      },
    ],
  },
];

/** קטלוג מסעות אזוריים — כבר בצורת FlagMission */
export const FLAG_REGION_MISSIONS_LIST: readonly FlagMission[] = REGION_SPECS.map(toFlagMission);
