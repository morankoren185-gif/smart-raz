import type { DifficultyKey } from "@/content/types";

/** לאחר רצף הצלחות — העלאת קושי אחת, עד תקרה */
export function bumpDifficulty(current: DifficultyKey): DifficultyKey {
  if (current === "gentle") return "steady";
  if (current === "steady") return "spark";
  return "spark";
}

/** אחרי מספר ניסיונות רכים — הורדה אחת לרגיעה */
export function softenDifficulty(current: DifficultyKey): DifficultyKey {
  if (current === "spark") return "steady";
  if (current === "steady") return "gentle";
  return "gentle";
}
