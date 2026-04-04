import type { BaseQuestionFields } from "./shared";
import type { VisualTileExtras } from "./visual-tile";

export type ChoicePresentation = {
  label: string;
  emoji?: string;
} & VisualTileExtras;

/** תצוגה מעל/ליד טקסט ההנחיה (למשל תמונה או אימוג׳י של המילה בעולם englishWords) */
export type QuestionPromptVisual = {
  emoji?: string;
} & VisualTileExtras;

/** תשובה במספר בחירות — מזהה אפשרות */
export type MultipleChoiceAnswer = {
  choiceId: string;
};

/**
 * תצוגת מפת אזור — צורות ב-SVG מופנות לפי mapId + highlightedShapeId.
 * תוכן המפות נשמר ב־`content/flags/region-map-assets.ts` כדי שניתן יהיה להחליף נכסים בלי לשנות חוזה.
 */
export type MapCountryPresentation = Readonly<{
  mapId: string;
  highlightedShapeId: string;
}>;

export interface MultipleChoiceQuestion extends BaseQuestionFields {
  type: "multiple-choice";
  /** ברירת מחדל: טקסט רגיל; map-country = מסגרת מפה + הדגשת צורה */
  presentationSubtype?: "default" | "map-country";
  /** חובה כש־presentationSubtype === "map-country" */
  mapCountry?: MapCountryPresentation;
  /** מזהה התשובה הנכונה — חייב להופיע ב־choices */
  correctAnswer: string;
  /** מזהי מסיחים (תת־קבוצה של choices; נשמר לנוחות מנוע רמזים) */
  distractors: string[];
  choices: Record<string, ChoicePresentation>;
  textDirection: "rtl" | "ltr";
  /** אופציונלי — תצוגה חזותית להנחיה (לא מחליף את instructions בטקסט) */
  promptVisual?: QuestionPromptVisual;
}

export function isMultipleChoiceQuestion(q: {
  type: string;
}): q is MultipleChoiceQuestion {
  return q.type === "multiple-choice";
}
