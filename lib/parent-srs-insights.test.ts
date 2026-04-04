import { describe, expect, it } from "vitest";
import type { AppProgress } from "@/lib/progress/storage";
import { defaultProgress } from "@/lib/progress/storage";
import {
  buildParentSrsInsights,
  isDueForReview,
  isStabilizingLearningItem,
  isUnstableLearningItem,
} from "./parent-insights";
import { humanLabelForLearningItem } from "./parent-learning-item-label";

const FIXED = new Date("2026-04-03T12:00:00.000Z");
const WEEK_MS = 86_400_000 * 7;

function progressWithItems(items: NonNullable<AppProgress["learningItemsProgress"]>["items"]): AppProgress {
  return {
    ...defaultProgress(),
    learningItemsProgress: { items },
  };
}

describe("buildParentSrsInsights / SRS heuristics", () => {
  it("identifies due items (nextReviewAt at or before now)", () => {
    const p = {
      itemId: "x",
      timesCorrect: 1,
      timesWrong: 0,
      nextReviewAt: new Date(FIXED.getTime() - 1000).toISOString(),
    };
    expect(isDueForReview(p, FIXED.getTime())).toBe(true);

    const p2 = {
      ...p,
      nextReviewAt: new Date(FIXED.getTime() + WEEK_MS).toISOString(),
    };
    expect(isDueForReview(p2, FIXED.getTime())).toBe(false);
  });

  it("counts due and week buckets in snapshot", () => {
    const snap = buildParentSrsInsights(
      progressWithItems({
        "en-words-picture-to-word:ew-p2w-gentle-0": {
          itemId: "en-words-picture-to-word:ew-p2w-gentle-0",
          timesCorrect: 1,
          timesWrong: 0,
          nextReviewAt: new Date(FIXED.getTime() - 60_000).toISOString(),
        },
        "en-words-picture-to-word:ew-p2w-gentle-1": {
          itemId: "en-words-picture-to-word:ew-p2w-gentle-1",
          timesCorrect: 1,
          timesWrong: 0,
          nextReviewAt: new Date(FIXED.getTime() + 3 * 86_400_000).toISOString(),
        },
      }),
      FIXED,
    );
    expect(snap.dueNowCount).toBe(1);
    expect(snap.dueThisWeekCount).toBe(2);
    expect(snap.thisWeekByWorld.englishWords).toBe(2);
  });

  it("flags unstable items by wrong/correct ratio", () => {
    expect(
      isUnstableLearningItem({ itemId: "a", timesCorrect: 0, timesWrong: 3 }),
    ).toBe(true);
    expect(
      isUnstableLearningItem({ itemId: "b", timesCorrect: 4, timesWrong: 1 }),
    ).toBe(false);
    expect(
      isUnstableLearningItem({ itemId: "c", timesCorrect: 1, timesWrong: 2 }),
    ).toBe(true);
  });

  it("flags stabilizing items when successes accrue and next review is comfortably ahead", () => {
    const nowMs = FIXED.getTime();
    const good = {
      itemId: "g",
      timesCorrect: 3,
      timesWrong: 0,
      nextReviewAt: new Date(nowMs + 5 * 86_400_000).toISOString(),
    };
    expect(isStabilizingLearningItem(good, nowMs)).toBe(true);

    const tooSoon = {
      ...good,
      nextReviewAt: new Date(nowMs + 86_400_000).toISOString(),
    };
    expect(isStabilizingLearningItem(tooSoon, nowMs)).toBe(false);

    const tooManyWrongs = { ...good, timesWrong: 4, timesCorrect: 3 };
    expect(isStabilizingLearningItem(tooManyWrongs, nowMs)).toBe(false);
  });

  it("stays kind and sparse when almost no learning-item data exists", () => {
    const snap = buildParentSrsInsights(defaultProgress(), FIXED);
    expect(snap.confidence).toBe("sparse");
    expect(snap.waitingWeekBody.length).toBeGreaterThan(10);
    expect(snap.strengthenFocusBody).toMatch(/לא בולט|בסדר|רגוע|עוזרות/);
  });

  it("surfaces strengthen copy when unstable items exist", () => {
    const snap = buildParentSrsInsights(
      progressWithItems({
        "flags-flag-matching:pair:fg-g1": {
          itemId: "flags-flag-matching:pair:fg-g1",
          timesCorrect: 0,
          timesWrong: 4,
          nextReviewAt: FIXED.toISOString(),
        },
      }),
      FIXED,
    );
    expect(snap.strengthenFocusBody).toMatch(/יפן/);
  });
});

describe("humanLabelForLearningItem", () => {
  it("resolves matching pair to country name", () => {
    const h = humanLabelForLearningItem("flags-flag-matching:pair:fg-g2");
    expect(h.itemLabel).toBe("ישראל");
    expect(h.worldId).toBe("flags");
  });

  it("resolves multiple-choice english word item to the word label", () => {
    const h = humanLabelForLearningItem("en-words-picture-to-word:ew-p2w-gentle-0");
    expect(h.itemLabel.length).toBeGreaterThan(0);
    expect(h.worldId).toBe("englishWords");
  });

  it("falls back safely for unknown slug", () => {
    const h = humanLabelForLearningItem("no-such-game:q1");
    expect(h.slug).toBe("no-such-game");
  });
});
