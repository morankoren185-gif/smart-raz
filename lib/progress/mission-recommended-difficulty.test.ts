import { describe, expect, it } from "vitest";
import type { LearningItemProgress } from "@/lib/progress/learning-items";
import { addCalendarDaysUtc } from "@/lib/progress/learning-items";
import {
  MISSION_PLAY_LEVEL_QUERY,
  difficultyLabelHeShort,
  parseMissionPlayLevelParam,
  recommendationFromAggregatedSrs,
  recommendedDifficultyForMissionStep,
  recommendedDifficultyForSrsWorld,
} from "@/lib/progress/mission-recommended-difficulty";
import { defaultProgress, type AppProgress } from "@/lib/progress/storage";

const now = new Date("2026-06-01T12:00:00.000Z");

describe("mission-recommended-difficulty", () => {
  it("parseMissionPlayLevelParam — ערכים חוקיים וריק", () => {
    expect(parseMissionPlayLevelParam("gentle")).toBe("gentle");
    expect(parseMissionPlayLevelParam("steady")).toBe("steady");
    expect(parseMissionPlayLevelParam("spark")).toBe("spark");
    expect(parseMissionPlayLevelParam(null)).toBeUndefined();
    expect(parseMissionPlayLevelParam("invalid")).toBeUndefined();
  });

  it("difficultyLabelHeShort — שלוש הרמות", () => {
    expect(difficultyLabelHeShort("gentle")).toBe("עדינה");
    expect(difficultyLabelHeShort("steady")).toBe("יציבה");
    expect(difficultyLabelHeShort("spark")).toBe("ניצוצות");
  });

  it("מעט data — המלצה שמרנית (עולם spark → steady)", () => {
    const p: AppProgress = {
      ...defaultProgress(),
      worlds: {
        ...defaultProgress().worlds,
        flags: { ...defaultProgress().worlds.flags, difficulty: "spark" },
      },
      learningItemsProgress: { items: {} },
    };
    const r = recommendedDifficultyForMissionStep(p, "flags", "flags-country-choice", now);
    expect(r.level).toBe("steady");
    expect(r.hintHe.length).toBeGreaterThan(5);
  });

  it("הרבה unstable/due — מפנים ל־gentle", () => {
    const base = defaultProgress();
    const items: Record<string, LearningItemProgress> = {};
    const slug = "flags-country-choice";
    for (let i = 0; i < 5; i++) {
      const id = `${slug}:x${i}`;
      items[id] = {
        itemId: id,
        timesCorrect: 1,
        timesWrong: 4,
        nextReviewAt: now.toISOString(),
      };
    }
    const p: AppProgress = {
      ...base,
      worlds: {
        ...base.worlds,
        flags: { ...base.worlds.flags, difficulty: "spark" },
      },
      learningItemsProgress: { items },
    };
    const r = recommendedDifficultyForMissionStep(p, "flags", slug, now);
    expect(r.level).toBe("gentle");
  });

  it("מצב יציב — אפשר spark כשבסיס העולם לא gentle", () => {
    const base = defaultProgress();
    const slug = "en-words-to-picture";
    const items: Record<string, LearningItemProgress> = {};
    for (let i = 0; i < 6; i++) {
      const id = `${slug}:stable-${i}`;
      items[id] = {
        itemId: id,
        timesCorrect: 6,
        timesWrong: 0,
        nextReviewAt: addCalendarDaysUtc(now, 14).toISOString(),
      };
    }
    const p: AppProgress = {
      ...base,
      worlds: {
        ...base.worlds,
        englishWords: { ...base.worlds.englishWords, difficulty: "steady" },
      },
      learningItemsProgress: { items },
    };
    const r = recommendedDifficultyForMissionStep(p, "englishWords", slug, now);
    expect(r.level).toBe("spark");
  });

  it("MISSION_PLAY_LEVEL_QUERY — מזהה יציב ל־URL", () => {
    expect(MISSION_PLAY_LEVEL_QUERY).toBe("playLevel");
  });

  it("recommendationFromAggregatedSrs — מעט נתונים → רך ולא ריק", () => {
    const r = recommendationFromAggregatedSrs("gentle", 0, 0, 0, 0);
    expect(r.level).toBe("gentle");
    expect(r.hintHe.length).toBeGreaterThan(8);
    expect(r.hintHe).toMatch(/נעימה/);
  });

  it("recommendationFromAggregatedSrs — לחץ (due/unstable) → gentle או steady", () => {
    const hard = recommendationFromAggregatedSrs("spark", 2, 1, 0, 5);
    expect(hard.level).toBe("gentle");
    const mid = recommendationFromAggregatedSrs("steady", 1, 0, 0, 4);
    expect(mid.level).toBe("steady");
  });

  it("recommendationFromAggregatedSrs — יציב → spark כשבסיס לא gentle", () => {
    const r = recommendationFromAggregatedSrs("steady", 0, 0, 5, 6);
    expect(r.level).toBe("spark");
  });

  it("recommendedDifficultyForSrsWorld — אין מספיק פריטים בעולם → gentle/steady שמרני", () => {
    const p: AppProgress = {
      ...defaultProgress(),
      learningItemsProgress: { items: {} },
    };
    const r = recommendedDifficultyForSrsWorld(p, "flags", now);
    expect(r.level).toBe("gentle");
    expect(r.hintHe.length).toBeGreaterThan(5);
  });

  it("recommendedDifficultyForSrsWorld — עולם עם לחץ → gentle", () => {
    const base = defaultProgress();
    const items: Record<string, LearningItemProgress> = {};
    for (let i = 0; i < 5; i++) {
      const id = `flags-country-choice:world-${i}`;
      items[id] = {
        itemId: id,
        timesCorrect: 1,
        timesWrong: 4,
        nextReviewAt: now.toISOString(),
      };
    }
    const p: AppProgress = {
      ...base,
      worlds: { ...base.worlds, flags: { ...base.worlds.flags, difficulty: "spark" } },
      learningItemsProgress: { items },
    };
    const r = recommendedDifficultyForSrsWorld(p, "flags", now);
    expect(r.level).toBe("gentle");
  });

  it("recommendedDifficultyForSrsWorld — מצב יציב באנגלית → steady או spark", () => {
    const base = defaultProgress();
    const slug = "en-words-to-picture";
    const items: Record<string, LearningItemProgress> = {};
    for (let i = 0; i < 6; i++) {
      const id = `${slug}:agg-${i}`;
      items[id] = {
        itemId: id,
        timesCorrect: 6,
        timesWrong: 0,
        nextReviewAt: addCalendarDaysUtc(now, 14).toISOString(),
      };
    }
    const p: AppProgress = {
      ...base,
      worlds: {
        ...base.worlds,
        englishWords: { ...base.worlds.englishWords, difficulty: "steady" },
      },
      learningItemsProgress: { items },
    };
    const r = recommendedDifficultyForSrsWorld(p, "englishWords", now);
    expect(r.level === "spark" || r.level === "steady").toBe(true);
  });
});
