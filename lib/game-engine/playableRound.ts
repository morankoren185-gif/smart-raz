import type { MapCountryPresentation, QuestionPromptVisual } from "@/lib/game-types/multiple-choice";

/**
 * צורת סיבוב זמינה למסך בחירה — מנותקת מ־content/types (לגאסי).
 * התאמה למבנה שהמסך והמנוע צריכים אחרי בחירת בנק ולפני/אחרי ערבוב אפשרויות.
 */
export type PlayableChoiceTile = {
  id: string;
  label: string;
  emoji?: string;
  imageSrc?: string;
  illustrationKey?: string;
  altHe?: string;
};

export type PlayableMultipleChoiceRound = {
  id: string;
  prompt: string;
  direction: "rtl" | "ltr";
  correctChoiceId: string;
  choices: PlayableChoiceTile[];
  /** מועתק מ־MultipleChoiceQuestion כש־presentationSubtype === "map-country" */
  mapCountry?: MapCountryPresentation;
  promptVisual?: QuestionPromptVisual;
};
