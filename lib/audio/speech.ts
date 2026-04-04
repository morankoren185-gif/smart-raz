import type { WorldId } from "@/lib/game-types/shared";

export type SpeechLocale = "he-IL" | "en-US";

/**
 * בחירת locale לקריינות:
 * - english / englishWords / space → en-US (תוכן באנגלית — מילים ושמות כוכבי לכת)
 * - hebrew → he-IL
 * - math → he-IL (הנחיות ותרגילים בעברית ב-MVP)
 */
export function getSpeechLocaleForWorld(worldId: WorldId): SpeechLocale {
  if (worldId === "english" || worldId === "englishWords" || worldId === "space") return "en-US";
  return "he-IL";
}

export function isSpeechSynthesisAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined";
}

export function cancelOngoingSpeech(): void {
  if (!isSpeechSynthesisAvailable()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* דפדפן לא תומך / מצב חריג — לא שוברים UI */
  }
}

function pickVoiceForLocale(locale: SpeechLocale): SpeechSynthesisVoice | null {
  if (!isSpeechSynthesisAvailable()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const primary = locale.split("-")[0]?.toLowerCase() ?? "";
  return (
    voices.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith(primary)) ??
    voices.find((v) => v.lang.toLowerCase().includes(primary)) ??
    null
  );
}

/**
 * מפסיק קריינות קודמת ומקריא טקסט חדש (אין autoplay — רק בקריאה יזומה).
 * אם רשימת הקולות עדיין לא נטענה (Chrome), נחכה ל-once `voiceschanged`.
 */
export function speakText(text: string, locale: SpeechLocale): void {
  const trimmed = text.trim();
  if (!trimmed || !isSpeechSynthesisAvailable()) return;

  cancelOngoingSpeech();

  const speakNow = () => {
    try {
      const utterance = new SpeechSynthesisUtterance(trimmed);
      utterance.lang = locale;
      utterance.rate = 0.92;
      const voice = pickVoiceForLocale(locale);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    } catch {
      /* fallback שקט */
    }
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    speakNow();
    return;
  }

  let started = false;
  const runOnce = () => {
    if (started) return;
    started = true;
    window.speechSynthesis.removeEventListener("voiceschanged", runOnce);
    speakNow();
  };
  window.speechSynthesis.addEventListener("voiceschanged", runOnce);
  window.setTimeout(runOnce, 400);
}

/** הכנת טקסט להקראה — שבירות שורה ל паузה קצרה */
export function normalizeSpeechText(raw: string): string {
  return raw.replace(/\n+/g, " — ").replace(/\s+/g, " ").trim();
}

/** טקסט מאוחד לאפשרויות multiple-choice (בלי כפתור נפרד לכל פריט) */
export function joinChoiceLabelsForSpeech(
  choices: ReadonlyArray<{ label: string; emoji?: string; altHe?: string }>,
): string {
  const parts = choices
    .map((c) => {
      const L = c.label.trim();
      if (L) return L;
      const a = c.altHe?.trim();
      if (a) return a;
      return c.emoji?.trim() ?? "";
    })
    .filter(Boolean);
  return parts.join(". ");
}
