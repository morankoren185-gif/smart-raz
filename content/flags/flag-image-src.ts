import type { FlagChoiceKey } from "./curated-catalog";

/**
 * נתיבי SVG מספריית flag-icons (jsDelivr) — נטענים ב־<img> רגיל, עובדים היכן שאימוג׳י דגל
 * מוצג כאותיות (למשל JP) בגלל גופנים במערכת.
 */
const FLAG_ICONS_SVG_BASE = "https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3";

/** מזהה קובץ ב־flag-icons (בריטניה תמיד gb) */
function flagIconsFileId(key: FlagChoiceKey): string {
  if (key === "uk") return "gb";
  return key;
}

export function flagImageSrcForChoiceKey(key: FlagChoiceKey): string {
  return `${FLAG_ICONS_SVG_BASE}/${flagIconsFileId(key)}.svg`;
}
