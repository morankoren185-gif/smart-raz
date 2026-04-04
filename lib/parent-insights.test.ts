import { describe, expect, it } from "vitest";
import type { AppProgress } from "@/lib/progress/storage";
import { defaultProgress } from "@/lib/progress/storage";
import { buildParentInsights, buildParentWeeklyPracticeLevels, type ParentInsightGameMeta } from "./parent-insights";

const sampleCatalog: ParentInsightGameMeta[] = [
  { slug: "en-a", world: "english", title: "Shuttle", parentSummary: "מילים וביטויים באנגלית" },
  { slug: "en-b", world: "english", title: "Emoji", parentSummary: "התאמות קליט באנגלית" },
  {
    slug: "he-a",
    world: "hebrew",
    title: "Orbit",
    parentSummary: "זיהוי אותיות והתאמה עדינה בעברית",
  },
  {
    slug: "he-b",
    world: "hebrew",
    title: "Words",
    parentSummary: "קישור אות למילה",
  },
  { slug: "m-a", world: "math", title: "Stars", parentSummary: "ספירה ותחושת כמות" },
  { slug: "m-b", world: "math", title: "Quantities", parentSummary: "התאמת מספר לכמות" },
];

describe("buildParentInsights", () => {
  it("flags child progressing well in English when that world leads completions", () => {
    const p: AppProgress = {
      ...defaultProgress(),
      playMinutesApprox: 22,
      stars: 14,
      worlds: {
        ...defaultProgress().worlds,
        english: {
          difficulty: "steady",
          completedGameSlugs: ["en-a", "en-b"],
          lastPlayedAt: new Date().toISOString(),
        },
        hebrew: { difficulty: "gentle", completedGameSlugs: [], lastPlayedAt: undefined },
        math: { difficulty: "gentle", completedGameSlugs: [], lastPlayedAt: undefined },
      },
    };
    const snap = buildParentInsights(p, sampleCatalog);
    expect(snap.goingWellBody).toMatch(/אנגלית/);
    expect(snap.confidence).not.toBe("sparse");
  });

  it("surfaces Hebrew as a gentle focus when it lags behind other worlds", () => {
    const p: AppProgress = {
      ...defaultProgress(),
      playMinutesApprox: 30,
      stars: 20,
      worlds: {
        ...defaultProgress().worlds,
        english: {
          difficulty: "steady",
          completedGameSlugs: ["en-a", "en-b"],
          lastPlayedAt: new Date().toISOString(),
        },
        hebrew: { difficulty: "gentle", completedGameSlugs: [], lastPlayedAt: undefined },
        math: {
          difficulty: "gentle",
          completedGameSlugs: ["m-a"],
          lastPlayedAt: new Date().toISOString(),
        },
      },
    };
    const snap = buildParentInsights(p, sampleCatalog);
    expect(snap.strengthenBody).toMatch(/עברית/);
  });

  it("uses sparse, kind copy when there is very little data", () => {
    const p = defaultProgress();
    const snap = buildParentInsights(p, sampleCatalog);
    expect(snap.confidence).toBe("sparse");
    expect(snap.goingWellBody).toMatch(/תחילת הדרך|בתחילת הדרך/);
    expect(snap.weeklyBody).toMatch(/קצב נוח|נעים/);
  });

  it("weekly line reflects an incomplete focus world (Hebrew) from catalog", () => {
    const p: AppProgress = {
      ...defaultProgress(),
      playMinutesApprox: 15,
      stars: 9,
      worlds: {
        ...defaultProgress().worlds,
        english: {
          difficulty: "gentle",
          completedGameSlugs: ["en-a", "en-b"],
          lastPlayedAt: new Date().toISOString(),
        },
        hebrew: { difficulty: "gentle", completedGameSlugs: [], lastPlayedAt: undefined },
        math: { difficulty: "gentle", completedGameSlugs: [], lastPlayedAt: undefined },
      },
    };
    const snap = buildParentInsights(p, sampleCatalog);
    expect(snap.weeklyBody).toMatch(/עברית/);
    expect(snap.weeklyBody).toMatch(/אותיות|זיהוי|קישור|עברית/);
  });

  it("returns a safe snapshot when catalog is empty", () => {
    const snap = buildParentInsights(defaultProgress(), []);
    expect(snap.confidence).toBe("sparse");
    expect(snap.goingWellBody.length).toBeGreaterThan(10);
  });
});

describe("buildParentWeeklyPracticeLevels", () => {
  const now = new Date("2026-06-01T12:00:00.000Z");

  it("מעט נתונים — שורות רכות של נעימה/שמרנות ולא ריקות", () => {
    const w = buildParentWeeklyPracticeLevels(defaultProgress(), now);
    expect(w.lines).toHaveLength(3);
    for (const row of w.lines) {
      expect(row.lineHe.length).toBeGreaterThan(15);
      expect(row.lineHe).not.toMatch(/unstable|due|score|SRS/i);
    }
    expect(w.title.length).toBeGreaterThan(5);
  });

  it("אנגלית יציבה — שורה שמזמינה רמה פתוחה יותר או מאוזנת", () => {
    const p: AppProgress = {
      ...defaultProgress(),
      worlds: {
        ...defaultProgress().worlds,
        englishWords: { ...defaultProgress().worlds.englishWords, difficulty: "steady" },
      },
      learningItemsProgress: {
        items: Object.fromEntries(
          Array.from({ length: 6 }, (_, i) => {
            const id = `en-words-to-picture:par-${i}`;
            return [
              id,
              {
                itemId: id,
                timesCorrect: 6,
                timesWrong: 0,
                nextReviewAt: new Date(now.getTime() + 14 * 86_400_000).toISOString(),
              },
            ] as const;
          }),
        ),
      },
    };
    const w = buildParentWeeklyPracticeLevels(p, now);
    const en = w.lines.find((l) => l.worldId === "englishWords");
    expect(en).toBeDefined();
    expect(en?.lineHe).toMatch(/מאתגרת|מאוזנת/);
  });
});
