/**
 * מצב תצוגה לאיור מול אימוג׳י — לוגיקה טהורה (נבדקת בלי דפדפן).
 * הרכיב מסמן loadFailed=true ב-onError של <img>.
 */
export function illustrationDisplayMode(
  imageSrc: string | undefined | null,
  imageLoadFailed: boolean,
): "image" | "emoji" {
  return Boolean(imageSrc?.trim()) && !imageLoadFailed ? "image" : "emoji";
}
