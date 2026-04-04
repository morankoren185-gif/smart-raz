"use client";

import type { QuestionPromptVisual } from "@/lib/game-types/multiple-choice";
import { IllustrationWithEmojiFallback } from "./IllustrationWithEmojiFallback";

type ChoicePromptVisualProps = Readonly<{
  visual: QuestionPromptVisual;
}>;

/**
 * תצוגה חזותית מעל טקסט ההנחיה — תמונה אם נטענת, אחרת אימוג׳י (כולל אחרי onError).
 */
export function ChoicePromptVisual({ visual }: ChoicePromptVisualProps) {
  const alt = visual.altHe?.trim() || "";
  if (!visual.imageSrc?.trim() && !visual.emoji) return null;
  return (
    <div className="flex min-h-[6rem] w-full items-center justify-center sm:min-h-[7rem]">
      <IllustrationWithEmojiFallback
        imageSrc={visual.imageSrc}
        emoji={visual.emoji ?? "⭐"}
        alt={alt}
        imgClassName="mx-auto max-h-28 w-auto max-w-[min(100%,7rem)] object-contain drop-shadow-md sm:max-h-32"
        emojiClassName="text-6xl leading-none"
      />
    </div>
  );
}
