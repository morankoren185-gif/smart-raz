import type { BaseQuestionFields } from "./shared";
import type { VisualTileExtras } from "./visual-tile";

/** תשובת משתמש עתידית במנוע — לכל זוג מזהה הצד השני */
export type MatchingAnswer = {
  pairs: Record<string, string>;
};

/** צד כרטיס ב־matching — תומך באימוג׳י ו/או נכס חזותי עתידי */
export type MatchingTilePresentation = {
  label: string;
  emoji?: string;
} & VisualTileExtras;

/** זוג אחד לפאזל: שני צדדים (מילה↔אימוג'י, אות↔מילה וכו') */
export type MatchingPairSpec = {
  pairId: string;
  sideA: MatchingTilePresentation;
  sideB: MatchingTilePresentation;
};

export interface MatchingQuestion extends BaseQuestionFields {
  type: "matching";
  /** זוגות בפאזל אחד — מספר הזוגות קובע עומס (gentle מעט, spark יותר) */
  pairs: MatchingPairSpec[];
  /** כיוון ההנחיה */
  textDirection: "rtl" | "ltr";
}

export function isMatchingQuestion(q: { type: string }): q is MatchingQuestion {
  return q.type === "matching";
}
