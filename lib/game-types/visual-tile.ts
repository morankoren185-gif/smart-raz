/**
 * שדות תצוגה חזותית אופציונליים — משותף ל־MC choices, זוגות matching, והנחיות.
 * אי אילוסטרציה/תמונה: `imageSrc`; מזהה לעתיד ללא נתיב קבוע: `illustrationKey`.
 * תאימות לאחור: רק `emoji` / `label` נשארים מספיקים לתצוגה.
 */
export type VisualTileExtras = Readonly<{
  imageSrc?: string;
  illustrationKey?: string;
  altHe?: string;
}>;
