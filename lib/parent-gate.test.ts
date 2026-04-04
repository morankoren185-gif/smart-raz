import { afterEach, describe, expect, it, vi } from "vitest";
import {
  PARENT_GATE_MAX_AGE_MS,
  PARENT_GATE_SESSION_KEY,
  clearParentGateSession,
  isParentGateAnswerCorrect,
  isParentGateUnlocked,
  parseGateNumericInput,
  pickParentGatePuzzle,
  unlockParentGate,
} from "./parent-gate";

describe("pickParentGatePuzzle", () => {
  it("returns a puzzle with prompt and finite answer", () => {
    const p = pickParentGatePuzzle();
    expect(typeof p.prompt).toBe("string");
    expect(p.prompt.length).toBeGreaterThan(3);
    expect(Number.isInteger(p.answer)).toBe(true);
  });

  it("draws from pool (statistical smoke)", () => {
    const set = new Set<string>();
    for (let i = 0; i < 40; i += 1) {
      set.add(pickParentGatePuzzle().prompt);
    }
    expect(set.size).toBeGreaterThan(1);
  });
});

describe("parseGateNumericInput", () => {
  it("parses integers and rejects junk", () => {
    expect(parseGateNumericInput("12")).toBe(12);
    expect(parseGateNumericInput(" 12 ")).toBe(12);
    expect(parseGateNumericInput("-3")).toBe(-3);
    expect(parseGateNumericInput("12a")).toBeNull();
    expect(parseGateNumericInput("")).toBeNull();
  });
});

describe("isParentGateAnswerCorrect", () => {
  const puzzle = { prompt: "כמה זה 2 + 2?", answer: 4 };

  it("accepts correct answer", () => {
    expect(isParentGateAnswerCorrect(puzzle, "4")).toBe(true);
  });

  it("rejects wrong or invalid input", () => {
    expect(isParentGateAnswerCorrect(puzzle, "5")).toBe(false);
    expect(isParentGateAnswerCorrect(puzzle, "ארה")).toBe(false);
  });
});

describe("session gate helpers", () => {
  const store = new Map<string, string>();

  afterEach(() => {
    store.clear();
    vi.restoreAllMocks();
  });

  it("unlock then unlocked within TTL", () => {
    vi.stubGlobal("window", {
      sessionStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => {
          store.set(k, v);
        },
        removeItem: (k: string) => {
          store.delete(k);
        },
      },
    });

    expect(isParentGateUnlocked()).toBe(false);
    unlockParentGate();
    expect(isParentGateUnlocked()).toBe(true);
    expect(store.has(PARENT_GATE_SESSION_KEY)).toBe(true);
  });

  it("treats expired timestamp as locked", () => {
    const old = String(Date.now() - PARENT_GATE_MAX_AGE_MS - 1000);
    store.set(PARENT_GATE_SESSION_KEY, old);
    vi.stubGlobal("window", {
      sessionStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => {
          store.set(k, v);
        },
        removeItem: (k: string) => {
          store.delete(k);
        },
      },
    });
    expect(isParentGateUnlocked()).toBe(false);
  });

  it("clearParentGateSession removes key", () => {
    store.set(PARENT_GATE_SESSION_KEY, String(Date.now()));
    vi.stubGlobal("window", {
      sessionStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => {
          store.set(k, v);
        },
        removeItem: (k: string) => {
          store.delete(k);
        },
      },
    });
    expect(isParentGateUnlocked()).toBe(true);
    clearParentGateSession();
    expect(store.has(PARENT_GATE_SESSION_KEY)).toBe(false);
  });
});
