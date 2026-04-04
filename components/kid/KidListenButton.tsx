"use client";

import {
  getSpeechLocaleForWorld,
  isSpeechSynthesisAvailable,
  speakText,
} from "@/lib/audio/speech";
import type { WorldId } from "@/lib/game-types/shared";

type KidListenButtonProps = {
  worldId: WorldId;
  text: string;
  /** לנגישות ולמסך */
  label: string;
  variant?: "primary" | "secondary";
};

export function KidListenButton({
  worldId,
  text,
  label,
  variant = "primary",
}: KidListenButtonProps) {
  if (!isSpeechSynthesisAvailable() || !text.trim()) {
    return null;
  }

  const locale = getSpeechLocaleForWorld(worldId);
  const styles =
    variant === "primary"
      ? "min-h-13 rounded-2xl border-2 border-sky-300/60 bg-sky-500/25 px-4 py-3 text-base font-bold text-white shadow-md hover:bg-sky-500/35"
      : "min-h-11 rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm font-semibold text-white/95 hover:bg-white/18";

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 ${styles} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 active:scale-[0.98]`}
      onClick={() => speakText(text, locale)}
      aria-label={label}
    >
      <span className="text-xl leading-none" aria-hidden>
        🔊
      </span>
      <span>{label}</span>
    </button>
  );
}
