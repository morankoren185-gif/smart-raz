/**
 * טיפוסים משותפים לתוכן הלימודי (נפרד ממנוע המשחק ומ-UI).
 */

export type WorldId =
  | "english"
  | "hebrew"
  | "math"
  | "flags"
  | "englishWords"
  | "space";

/** שלוש רמות קושי לפחות — מתארות בריכת שאלות וצפיפות אפשרויות */
export type DifficultyKey = "gentle" | "steady" | "spark";

export type GameChoice = {
  id: string;
  /** טקסט לאפשרות (מילה, מספר, אות) */
  label: string;
  emoji?: string;
};

export type ChoiceRound = {
  id: string;
  /** הנחיה קצרה לילד */
  prompt: string;
  /** כיוון טקסט — עברית RTL, אנגלית LTR */
  direction: "rtl" | "ltr";
  correctChoiceId: string;
  choices: GameChoice[];
};

/**
 * מודול משחק: מזהה, שיוך לעולם, ובנקי שאלות לפי קושי.
 * הוראות קושי ברמת התוכן (לא קשיחות בקומפוננטות).
 */
export type GameModule = {
  id: string;
  /** מזהה יציב ל-URL */
  slug: string;
  worldId: WorldId;
  /** כותרת קצרה לילד */
  title: string;
  /** שורה אחת למסך בחירה */
  tagline: string;
  /** תיאור להורה — מה מתרגלים */
  learningGoal: string;
  banks: Record<DifficultyKey, ChoiceRound[]>;
};
