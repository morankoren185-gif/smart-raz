import type { GameDefinition as GameDefinitionGeneric } from "./shared";
import type { BuildQuestion } from "./build";
import type { DragDropQuestion } from "./drag-drop";
import type { ListenChooseQuestion } from "./listen-choose";
import type { MatchingQuestion } from "./matching";
import type { MultipleChoiceQuestion } from "./multiple-choice";

export type Question =
  | MultipleChoiceQuestion
  | MatchingQuestion
  | DragDropQuestion
  | BuildQuestion
  | ListenChooseQuestion;

export type QuestionType = Question["type"];

export type GameDefinition = GameDefinitionGeneric<Question>;

export const QUESTION_TYPE_ORDER: readonly QuestionType[] = [
  "multiple-choice",
  "matching",
  "drag-drop",
  "build",
  "listen-choose",
] as const;
