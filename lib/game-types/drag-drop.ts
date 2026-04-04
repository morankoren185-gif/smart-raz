import type { BaseQuestionFields } from "./shared";

export type DragDropAnswer = {
  assignments: Record<string, string>;
};

export interface DragDropQuestion extends BaseQuestionFields {
  type: "drag-drop";
  payload?: undefined;
}
