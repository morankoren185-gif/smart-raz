import type { BaseQuestionFields } from "./shared";

/** עד להפרדת Runner — דומה במבנה לבחירה */
type ChoiceIdAnswer = {
  choiceId: string;
};

export type ListenChooseAnswer = ChoiceIdAnswer;

export interface ListenChooseQuestion extends BaseQuestionFields {
  type: "listen-choose";
  /** עתידי: uri / מפתח אודיו */
  audioId?: string;
}
