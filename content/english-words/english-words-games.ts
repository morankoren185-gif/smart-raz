import type { GameDefinition } from "@/lib/game-types/registry";
import type { SkillId } from "@/lib/game-types/shared";
import {
  buildEmojiWordMatchingBank,
  buildListenChooseBank,
  buildPictureToWordBank,
  buildWordOrderBank,
  buildWordToPictureBank,
} from "./question-factories";

const EW_SKILLS: SkillId[] = ["early-reading", "vocabulary-receptive"];

const w2p = buildWordToPictureBank();
const p2w = buildPictureToWordBank();
const listen = buildListenChooseBank();
const buildOrder = buildWordOrderBank();
const match = buildEmojiWordMatchingBank();

/** מילה → תמונה (אימוג׳י), בחירה מרובה */
export const englishWordsToPictureDefinition: GameDefinition = {
  id: "en-words-to-picture",
  slug: "en-words-to-picture",
  world: "englishWords",
  title: "מילה לתמונה",
  tagline: "קוראים מילה באנגלית ובוחרים את התמונה המתאימה",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["multiple-choice"],
  banksByLevel: {
    gentle: w2p.gentle,
    steady: w2p.steady,
    spark: w2p.spark,
  },
  skills: EW_SKILLS,
  parentSummary: "זיהוי מילים פשוטות באנגלית והתאמה לייצוג חזותי (אימוג׳י).",
};

/** תמונה → מילה */
export const englishWordsPictureToWordDefinition: GameDefinition = {
  id: "en-words-picture-to-word",
  slug: "en-words-picture-to-word",
  world: "englishWords",
  title: "תמונה למילה",
  tagline: "רואים תמונה ובוחרים את המילה באנגלית",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["multiple-choice"],
  banksByLevel: {
    gentle: p2w.gentle,
    steady: p2w.steady,
    spark: p2w.spark,
  },
  skills: EW_SKILLS,
  parentSummary: "שימוש באוצר מילים ראשוני — מתבסס על זיהוי חזותי.",
};

/** הקשבה למילה (TTS על שורת ההנחיה) ובחירה */
export const englishWordsListenChooseDefinition: GameDefinition = {
  id: "en-words-listen-choose",
  slug: "en-words-listen-choose",
  world: "englishWords",
  title: "שומעים ובוחרים",
  tagline: "לוחצים ״להקשיב״ ואז בוחרים את המילה הנכונה",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["multiple-choice"],
  banksByLevel: {
    gentle: listen.gentle,
    steady: listen.steady,
    spark: listen.spark,
  },
  skills: ["listening-discrimination", "vocabulary-receptive"],
  parentSummary: "הקשבה והבחנה בין מילים באנגלית (קריינות מערכת).",
};

/** סידור אותיות — מיוצג כבחירה מרובה בין סדרים */
export const englishWordsBuildOrderDefinition: GameDefinition = {
  id: "en-words-build-order",
  slug: "en-words-build-order",
  world: "englishWords",
  title: "בונים מילה",
  tagline: "בוחרים את סדר האותיות הנכון",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["multiple-choice"],
  banksByLevel: {
    gentle: buildOrder.gentle,
    steady: buildOrder.steady,
    spark: buildOrder.spark,
  },
  skills: EW_SKILLS,
  parentSummary: "חיבור בין צליל/צורה לבין סדר אותיות (מילים קצרות; במילים ארוכות — קטע מקוצר).",
};

export const englishWordsMatchingDefinition: GameDefinition = {
  id: "en-words-match",
  slug: "en-words-match",
  world: "englishWords",
  title: "מזווגים תמונה ומילה",
  tagline: "אותו כיף כמו בדגלים — רק באנגלית",
  defaultSessionLevel: "gentle",
  supportedQuestionTypes: ["matching"],
  banksByLevel: {
    gentle: match.gentle,
    steady: match.steady,
    spark: match.spark,
  },
  skills: EW_SKILLS,
  parentSummary: "התאמת זוגות אימוג׳י–מילה לאימון אוצר מילים.",
};

export const ENGLISH_WORDS_GAME_DEFINITIONS: GameDefinition[] = [
  englishWordsToPictureDefinition,
  englishWordsPictureToWordDefinition,
  englishWordsListenChooseDefinition,
  englishWordsBuildOrderDefinition,
  englishWordsMatchingDefinition,
];
