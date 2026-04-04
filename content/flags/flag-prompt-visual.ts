import type { QuestionPromptVisual } from "@/lib/game-types/multiple-choice";
import type { FlagChoiceKey } from "./curated-catalog";
import { FLAG_CHOICE_EMOJI, FLAG_EXTENDED_LABEL_HE } from "./curated-catalog";
import { flagImageSrcForChoiceKey } from "./flag-image-src";

/** תצוגה מעל ההנחיה במשחק «לאיזו מדינה הדגל» — תמונה + גיבוי אימוג׳י/טקסט */
export function mcPromptVisualForFlagKey(key: FlagChoiceKey): QuestionPromptVisual {
  return {
    imageSrc: flagImageSrcForChoiceKey(key),
    emoji: FLAG_CHOICE_EMOJI[key],
    altHe: `דגל ${FLAG_EXTENDED_LABEL_HE[key]}`,
  };
}
