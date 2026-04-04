import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cancelOngoingSpeech,
  getSpeechLocaleForWorld,
  isSpeechSynthesisAvailable,
  joinChoiceLabelsForSpeech,
  normalizeSpeechText,
  speakText,
} from "./speech";

describe("getSpeechLocaleForWorld", () => {
  it("maps english, englishWords, and space to en-US", () => {
    expect(getSpeechLocaleForWorld("english")).toBe("en-US");
    expect(getSpeechLocaleForWorld("englishWords")).toBe("en-US");
    expect(getSpeechLocaleForWorld("space")).toBe("en-US");
  });

  it("maps hebrew, math, and flags to he-IL", () => {
    expect(getSpeechLocaleForWorld("hebrew")).toBe("he-IL");
    expect(getSpeechLocaleForWorld("math")).toBe("he-IL");
    expect(getSpeechLocaleForWorld("flags")).toBe("he-IL");
  });
});

describe("normalizeSpeechText", () => {
  it("collapses newlines to pause marker and trims", () => {
    expect(normalizeSpeechText("שלום\nעולם")).toBe("שלום — עולם");
    expect(normalizeSpeechText("  a  \n\n  b  ")).toBe("a — b");
  });
});

describe("joinChoiceLabelsForSpeech", () => {
  it("joins non-empty labels with dots", () => {
    expect(
      joinChoiceLabelsForSpeech([
        { label: "אחת", emoji: "1️⃣" },
        { label: "שתיים" },
      ]),
    ).toBe("אחת. שתיים");
  });

  it("skips empty labels", () => {
    expect(joinChoiceLabelsForSpeech([{ label: "" }, { label: "ב" }])).toBe("ב");
  });

  it("uses altHe or emoji when label is empty", () => {
    expect(joinChoiceLabelsForSpeech([{ label: "", altHe: "חתול" }])).toBe("חתול");
    expect(joinChoiceLabelsForSpeech([{ label: "", emoji: "🐱" }])).toBe("🐱");
  });
});

describe("isSpeechSynthesisAvailable", () => {
  const saved = globalThis.window;

  afterEach(() => {
    if (saved === undefined) {
      // @ts-expect-error cleanup
      delete globalThis.window;
    } else {
      globalThis.window = saved;
    }
    vi.restoreAllMocks();
  });

  it("returns false when window is undefined", () => {
    // @ts-expect-error test no window
    delete globalThis.window;
    expect(isSpeechSynthesisAvailable()).toBe(false);
  });

  it("returns false when speechSynthesis is missing", () => {
    vi.stubGlobal("window", {} as Window);
    expect(isSpeechSynthesisAvailable()).toBe(false);
  });

  it("returns true when speechSynthesis exists", () => {
    vi.stubGlobal("window", { speechSynthesis: {} } as unknown as Window);
    expect(isSpeechSynthesisAvailable()).toBe(true);
  });
});

describe("cancelOngoingSpeech", () => {
  it("no-ops without speechSynthesis", () => {
    vi.stubGlobal("window", {} as Window);
    expect(() => cancelOngoingSpeech()).not.toThrow();
  });
});

describe("speakText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("does nothing when text is empty", () => {
    const cancel = vi.fn();
    const speak = vi.fn();
    vi.stubGlobal("window", {
      speechSynthesis: {
        cancel,
        speak,
        getVoices: () => [],
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    } as unknown as Window);
    speakText("   ", "he-IL");
    expect(cancel).not.toHaveBeenCalled();
    expect(speak).not.toHaveBeenCalled();
  });

  it("cancels and speaks with utterance matching locale when voices exist", () => {
    const cancel = vi.fn();
    const speak = vi.fn();
    const MockUtterance = vi.fn(function MockU(this: SpeechSynthesisUtterance, text: string) {
      this.text = text;
      return this;
    }) as unknown as typeof SpeechSynthesisUtterance;
    vi.stubGlobal("SpeechSynthesisUtterance", MockUtterance);
    vi.stubGlobal("window", {
      speechSynthesis: {
        cancel,
        speak,
        getVoices: () => [{ lang: "he-IL", name: "Hebrew" } as SpeechSynthesisVoice],
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    } as unknown as Window);
    speakText("שלום", "he-IL");
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(speak).toHaveBeenCalledTimes(1);
    const utterance = speak.mock.calls[0]![0] as SpeechSynthesisUtterance;
    expect(utterance.lang).toBe("he-IL");
    expect(utterance.text).toBe("שלום");
  });

  it("schedules speak when voices list is empty until timeout", () => {
    const cancel = vi.fn();
    const speak = vi.fn();
    let voices: SpeechSynthesisVoice[] = [];
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    class MockUtterance {
      lang = "";
      text = "";
      rate = 1;
      voice: SpeechSynthesisVoice | null = null;
      constructor(public readonly t: string) {
        this.text = t;
      }
    }
    vi.stubGlobal("SpeechSynthesisUtterance", MockUtterance);
    vi.stubGlobal("window", {
      speechSynthesis: {
        cancel,
        speak,
        getVoices: () => voices,
        addEventListener,
        removeEventListener,
      },
      setTimeout: globalThis.setTimeout.bind(globalThis),
    } as unknown as Window);
    speakText("היי", "he-IL");
    expect(addEventListener).toHaveBeenCalled();
    voices = [{ lang: "he-IL", name: "H" } as SpeechSynthesisVoice];
    vi.advanceTimersByTime(400);
    expect(speak).toHaveBeenCalled();
  });
});
