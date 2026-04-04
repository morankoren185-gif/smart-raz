import type { GameDefinition } from "@/lib/game-types/registry";
import type { SkillId } from "@/lib/game-types/shared";
import {
  buildNameToPlanetBank,
  buildPlanetMatchingBank,
  buildPlanetToNameBank,
} from "./question-factories";
import { buildPlanetOrderMatchingBank, buildPlanetOrderMcBank } from "./space-order-factories";
import { buildPlanetCompareBank } from "./space-compare-factories";

const SPACE_SKILLS: SkillId[] = ["general-knowledge"];

const p2n = buildPlanetToNameBank();
const n2p = buildNameToPlanetBank();
const match = buildPlanetMatchingBank();
const ordMc = buildPlanetOrderMcBank();
const ordMatch = buildPlanetOrderMatchingBank();
const cmp = buildPlanetCompareBank();

export const spacePlanetToNameDefinition: GameDefinition = {
  id: "space-planet-to-name",
  slug: "space-planet-to-name",
  world: "space",
  title: "כוכב לשם",
  tagline: "רואים כוכב לכת ובוחרים את השם באנגלית",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["multiple-choice"],
  banksByLevel: {
    gentle: p2n.gentle,
    steady: p2n.steady,
    spark: p2n.spark,
  },
  skills: SPACE_SKILLS,
  parentSummary: "זיהוי שמות כוכבי לכת מוכרים מתוך רמז חזותי (אימוג׳י / בעתיד איור).",
};

export const spaceNameToPlanetDefinition: GameDefinition = {
  id: "space-name-to-planet",
  slug: "space-name-to-planet",
  world: "space",
  title: "שם לכוכב",
  tagline: "קוראים שם ובוחרים את הכוכב הנכון",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["multiple-choice"],
  banksByLevel: {
    gentle: n2p.gentle,
    steady: n2p.steady,
    spark: n2p.spark,
  },
  skills: SPACE_SKILLS,
  parentSummary: "קישור שם באנגלית לייצוג חזותי של כוכב הלכת.",
};

export const spacePlanetMatchingDefinition: GameDefinition = {
  id: "space-planet-matching",
  slug: "space-planet-matching",
  world: "space",
  title: "מזווגים כוכבים",
  tagline: "מחברים תמונה לכוכב שלה",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["matching"],
  banksByLevel: {
    gentle: match.gentle,
    steady: match.steady,
    spark: match.spark,
  },
  skills: SPACE_SKILLS,
  parentSummary: "התאמת זוגות שם–ייצוג חזותי לחיזוק ידע כללי על מערכת השמש.",
};

export const spacePlanetOrderMcDefinition: GameDefinition = {
  id: "space-planet-order-mc",
  slug: "space-planet-order-mc",
  world: "space",
  title: "סדר מהשמש",
  tagline: "לפני, אחרי, ומספר במסלול — בלי לחץ",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["multiple-choice"],
  banksByLevel: {
    gentle: ordMc.gentle,
    steady: ordMc.steady,
    spark: ordMc.spark,
  },
  skills: SPACE_SKILLS,
  parentSummary: "תרגול סדר כוכבי הלכת במערכת השמש (לפני/אחרי/מיקום).",
};

export const spacePlanetOrderMatchingDefinition: GameDefinition = {
  id: "space-planet-order-matching",
  slug: "space-planet-order-matching",
  world: "space",
  title: "מספר במסלול",
  tagline: "מחברים כוכב למקום שלו מהשמש",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["matching"],
  banksByLevel: {
    gentle: ordMatch.gentle,
    steady: ordMatch.steady,
    spark: ordMatch.spark,
  },
  skills: SPACE_SKILLS,
  parentSummary: "התאמת כוכב למיקום הממוספר מהשמש.",
};

export const spacePlanetCompareDefinition: GameDefinition = {
  id: "space-planet-compare",
  slug: "space-planet-compare",
  world: "space",
  title: "קרוב או רחוק",
  tagline: "משווים שני כוכבים ביחס לשמש — בזהירות ועדינות",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["multiple-choice"],
  banksByLevel: {
    gentle: cmp.gentle,
    steady: cmp.steady,
    spark: cmp.spark,
  },
  skills: SPACE_SKILLS,
  parentSummary: "השוואת מרחק מערכתי בין כוכבי לכת (קרוב/רחוק/לפני/אחרי).",
};

export const SPACE_GAME_DEFINITIONS: GameDefinition[] = [
  spacePlanetToNameDefinition,
  spaceNameToPlanetDefinition,
  spacePlanetMatchingDefinition,
  spacePlanetOrderMcDefinition,
  spacePlanetOrderMatchingDefinition,
  spacePlanetCompareDefinition,
];
