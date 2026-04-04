export type {
  BaseQuestionFields,
  DifficultyLevel,
  GameDefinition as GameDefinitionGeneric,
  GameSessionResult,
  GameSessionTotals,
  HintKind,
  HintSpec,
  ProgressState,
  QuestionTelemetry,
  QuestionType,
  RewardGrant,
  RewardsInventory,
  SessionPhaseResult,
  SkillId,
  WorldId,
  WorldProgressSlice,
} from "./shared";

export type { Question, GameDefinition } from "./registry";
export { QUESTION_TYPE_ORDER } from "./registry";

export type { MultipleChoiceQuestion, MultipleChoiceAnswer, ChoicePresentation } from "./multiple-choice";
export { isMultipleChoiceQuestion } from "./multiple-choice";

export type { MatchingQuestion, MatchingAnswer, MatchingPairSpec } from "./matching";
export { isMatchingQuestion } from "./matching";

export type { DragDropQuestion, DragDropAnswer } from "./drag-drop";
export type { BuildQuestion, BuildAnswer } from "./build";
export type { ListenChooseQuestion, ListenChooseAnswer } from "./listen-choose";

export {
  DEFAULT_LEGACY_MC_HINT,
  mapLegacyChoiceBanksToQuestionBanks,
  mapLegacyChoiceRoundToMultipleChoice,
} from "./adapters/legacyChoiceRound";

export { mapWordShuttleToGameDefinition } from "./adapters/mapWordShuttle";
export { mapLetterOrbitToGameDefinition } from "./adapters/mapLetterOrbit";
export { mapStarCountToGameDefinition } from "./adapters/mapStarCount";
