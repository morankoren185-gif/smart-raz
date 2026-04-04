import type { DifficultyLevel } from "@/lib/game-types/shared";

/**
 * מגבלת אפשרויות במסך בחירה לפי רמת קושי — לוגיקת מנוע, לא קשורה לתוכן לגאסי.
 * ערכים זהים לגרסה הקודמת ב־content/index.
 */
export function maxChoicesForDifficulty(level: DifficultyLevel): number {
  switch (level) {
    case "gentle":
      return 3;
    case "steady":
      return 4;
    case "spark":
      return 4;
    default: {
      const _exhaustive: never = level;
      return _exhaustive;
    }
  }
}
