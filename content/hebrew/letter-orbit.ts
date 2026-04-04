import type { GameModule } from "../types";

/**
 * עברית: זיהוי אותיות וצליל פשוט — תוכן בלבד.
 */
export const hebrewLetterOrbit: GameModule = {
  id: "he-letter-orbit",
  slug: "hebrew-letter-orbit",
  worldId: "hebrew",
  title: "מסלול האותיות",
  tagline: 'מוצאים את האות הנכונה',
  learningGoal: "זיהוי אותיות עבריות והתאמה להנחיה קצרה.",
  banks: {
    gentle: [
      {
        id: "hg1",
        prompt: 'איזו אות היא בּ ?',
        direction: "rtl",
        correctChoiceId: "ב",
        choices: [
          { id: "א", label: "א" },
          { id: "ב", label: "ב" },
        ],
      },
      {
        id: "hg2",
        prompt: 'איזו אות מתחילה את המילה דֹּב ?',
        direction: "rtl",
        correctChoiceId: "ד",
        choices: [
          { id: "ד", label: "ד" },
          { id: "ר", label: "ר" },
          { id: "ב", label: "ב" },
        ],
      },
      {
        id: "hg3",
        prompt: 'מצאו את האות ש',
        direction: "rtl",
        correctChoiceId: "ש",
        choices: [
          { id: "ש", label: "ש" },
          { id: "ס", label: "ס" },
        ],
      },
      {
        id: "hg4",
        prompt: "איפה האות מ?",
        direction: "rtl",
        correctChoiceId: "מ",
        choices: [
          { id: "נ", label: "נ" },
          { id: "מ", label: "מ" },
          { id: "ם", label: "ם" },
        ],
      },
      {
        id: "hg5",
        prompt: 'בוחרים את האות ל — לַיְלָה',
        direction: "rtl",
        correctChoiceId: "ל",
        choices: [
          { id: "ל", label: "ל" },
          { id: "י", label: "י" },
        ],
      },
    ],
    steady: [
      {
        id: "hs1",
        prompt: 'איזו אות חסרה? ע_ץ',
        direction: "rtl",
        correctChoiceId: "ץ",
        choices: [
          { id: "ץ", label: "ץ" },
          { id: "צ", label: "צ" },
          { id: "ף", label: "ף" },
          { id: "ן", label: "ן" },
        ],
      },
      {
        id: "hs2",
        prompt: "מצאו את האות ח",
        direction: "rtl",
        correctChoiceId: "ח",
        choices: [
          { id: "ח", label: "ח" },
          { id: "ת", label: "ת" },
          { id: "ט", label: "ט" },
        ],
      },
    ],
    spark: [
      {
        id: "hp1",
        prompt: 'אות נשמעת "שׁׁ": איזו מתאימה לתחילת שֶׁמֶשׁ ?',
        direction: "rtl",
        correctChoiceId: "ש",
        choices: [
          { id: "ש", label: "ש" },
          { id: "ס", label: "ס" },
          { id: "צ", label: "צ" },
          { id: "ח", label: "ח" },
        ],
      },
    ],
  },
};
