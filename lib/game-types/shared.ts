/**
 * טיפוסים משותפים לחוזה game-types (מנותקים מ-storage ומ־MVP ישן).
 */

export type WorldId = "english" | "hebrew" | "math" | "flags" | "englishWords" | "space";

export type DifficultyLevel = "gentle" | "steady" | "spark";

/** מזהי מיומנות יציבים לדיווח ולהורה */
export type SkillId =
  | "letter-recognition"
  | "phonemic-awareness"
  | "early-reading"
  | "syllable-blending"
  | "vocabulary-receptive"
  | "vocabulary-expressive"
  | "addition-within-10"
  | "addition"
  | "comparison"
  | "counting"
  | "number-sense"
  | "listening-discrimination"
  | "general-knowledge";

export type HintKind = "remove-distractor" | "highlight-area" | "read-aloud";

export type HintSpec = {
  kind: HintKind;
  maxSteps?: number;
};

/** שדות משותפים לכל השאלות — ללא `type` (נקבע בכל מודול per-type) */
export interface BaseQuestionFields {
  id: string;
  world: WorldId;
  level: DifficultyLevel;
  /** הנחיה לילד */
  instructions: string;
  skills: SkillId[];
  hint?: HintSpec;
  /** הסבר להורה (לדוחות / אזור הורה עתידי) */
  explanation: string;
}

/**
 * מטא-נתונים של משחק שלם — Data driven.
 * פרמטר גנרי כדי להימנע ממעגל ייבוא עם `registry` (מופעל כ-`GameDefinition<Question>` שם).
 */
export interface GameDefinition<TQuestion = unknown> {
  id: string;
  slug: string;
  world: WorldId;
  title: string;
  tagline: string;
  defaultSessionLevel: DifficultyLevel;
  supportedQuestionTypes: readonly QuestionType[];
  banksByLevel: Record<DifficultyLevel, TQuestion[]>;
  skills: SkillId[];
  parentSummary?: string;
}

/** דיסקרימינטור משותף — מסונכרן עם מודולי ה־per-type */
export type QuestionType =
  | "multiple-choice"
  | "matching"
  | "drag-drop"
  | "build"
  | "listen-choose";

export interface SessionPhaseResult {
  phaseId: string;
  durationMs?: number;
}

export interface QuestionTelemetry {
  questionId: string;
  correct: boolean;
  latencyMs?: number;
  hintType?: HintKind;
}

/** מינימלי — הרחבות rewards בלי לשנות את מנגנון ה־MVP כרגע */
export interface RewardGrant {
  kind: "stars";
  amount: number;
}

export interface GameSessionTotals {
  correct: number;
  attempts: number;
  hintsUsed: number;
  avgReactionTimeMs?: number;
}

export interface GameSessionResult {
  sessionId: string;
  gameId: string;
  world: WorldId;
  startedAt: string;
  endedAt: string;
  level: DifficultyLevel;
  phases: SessionPhaseResult[];
  totals: GameSessionTotals;
  questionEvents: QuestionTelemetry[];
  rewardsEarned: RewardGrant[];
  confidenceScore: number;
}

export interface RewardsInventory {
  stars: number;
}

export interface WorldProgressSlice {
  preferredLevel: DifficultyLevel;
  skillStrength: Partial<Record<SkillId, number>>;
  unlockedGameIds: string[];
  completedGameIds: string[];
  lastPlayedAt?: string;
}

/**
 * חוזה התקדמות עתידי — לא מחליף את AppProgress שב־localStorage עד מיגרציה מכוונת.
 */
export interface ProgressState {
  version: number;
  playerId?: string;
  worlds: Record<WorldId, WorldProgressSlice>;
  rewards: RewardsInventory;
  parentInsightsCache?: unknown;
  updatedAt: string;
}
