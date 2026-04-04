import type { BaseQuestionFields } from "./shared";

export type BuildAnswer = {
  sequence: string[];
};

export interface BuildQuestion extends BaseQuestionFields {
  type: "build";
  payload?: undefined;
}
