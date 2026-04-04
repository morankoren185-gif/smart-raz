/**
 * איזון התקדמות — נקודת כניסה יחידה לכוונון כוכבים ↔ רמות ↔ פתיחת תחנות במפה.
 *
 * **כמה כוכבים בפועל (ללא שינוי במנוע)**  
 * - `ChoiceGameClient`: עד ~6 כוכבים לסשן (סיבובים נכונים).  
 * - `MatchingGameClient`: בדרך כלל ~3–5 כוכבים לסשן (לפי מספר זוגות בפאזל).
 *
 * **מדיניות (גיל ~6–7)**  
 * - רמה 2 נגישה אחרי סשן ראשון טוב (+ קצת טעות) — חיזוק מוקדם.  
 * - פערים בין רמות גדלים בהדרגה (+4 → +6 → +12 → +20) כדי לא להתקע מוקדם מדי וגם לא לסיים מהר.  
 * - פתיחת מדינות: תחנה שנייה מהרה (מחווה), ואז רווח גדל בין יפן לברזיל — "תרגיל לפתוח משהו" לאורך זמן.
 *
 * משימות flags | נפרדות מספי כוכבים — נפתחות לפי השלמת משימה קודמת (`requiresCompletedMissionId`).
 *
 * @see `lib/progress/levels.ts` — רמות תצוגה (labels) + פונקציות עזר
 * @see `content/map-world.ts` — קורדינטות ומזהי תחנות
 */
export const STAR_LEVEL_STARS_REQUIRED_ASC: readonly [number, number, number, number, number] = [
  0, // רמה 1 — טייס מתחיל
  4, // רמה 2 — אחרי סשן ראשון בדרך כלל
  10, // רמה 3
  22, // רמה 4
  42, // רמה 5 — "פסגה רכה"; עדיין נגיש תוך סדרת סשנים סבירה
];

/**
 * סף כוכבים כולל (`progress.stars`) לפתיחת תחנה במפה — מפתח = `MapCountryNodeSpec.id`.
 * חייב להתאים לרשומות ב־`MAP_WORLD_COUNTRIES`.
 */
export const MAP_COUNTRY_UNLOCK_STARS: Readonly<Record<string, number>> = {
  "map-israel": 0,
  "map-france": 2,
  "map-japan": 8,
  "map-brazil": 18,
};
