import { describe, expect, it } from "vitest";
import type { PlayableMultipleChoiceRound } from "@/lib/game-engine/playableRound";
import type { LearningItemProgress } from "./learning-items";
import {
  addCalendarDaysUtc,
  applyLearningOutcomeToItems,
  computeNextReviewAt,
  learningItemKeyMc,
  orderMcTemplatesForSrs,
  srsTierForItem,
} from "./learning-items";

const fixedNow = new Date("2026-04-03T12:00:00.000Z");

describe("computeNextReviewAt / applyLearningOutcomeToItems", () => {
  it("after wrong answer, nextReview is about one day ahead", () => {
    const next = computeNextReviewAt(false, 0, 1, fixedNow);
    const expected = addCalendarDaysUtc(fixedNow, 1).toISOString();
    expect(next).toBe(expected);
  });

  it("after first success, nextReview is two days ahead", () => {
    const next = computeNextReviewAt(true, 1, 0, fixedNow);
    const expected = addCalendarDaysUtc(fixedNow, 2).toISOString();
    expect(next).toBe(expected);
  });

  it("after several successes, nextReview is farther than first success", () => {
    const first = computeNextReviewAt(true, 1, 0, fixedNow);
    const mid = computeNextReviewAt(true, 3, 0, fixedNow);
    const many = computeNextReviewAt(true, 4, 0, fixedNow);
    expect(new Date(mid).getTime()).toBeGreaterThan(new Date(first).getTime());
    expect(new Date(many).getTime()).toBeGreaterThan(new Date(mid).getTime());
  });

  it("wrong tightens schedule vs correct on same step", () => {
    const items = applyLearningOutcomeToItems({}, "k1", false, fixedNow);
    const wrongNext = new Date(items.k1!.nextReviewAt!).getTime();
    const items2 = applyLearningOutcomeToItems({}, "k2", true, fixedNow);
    const okNext = new Date(items2.k2!.nextReviewAt!).getTime();
    expect(wrongNext).toBeLessThan(okNext);
  });
});

describe("orderMcTemplatesForSrs", () => {
  const slug = "test-game";
  const mk = (id: string): PlayableMultipleChoiceRound => ({
    id,
    prompt: id,
    direction: "rtl",
    correctChoiceId: "a",
    choices: [{ id: "a", label: "a" }],
  });

  it("due items appear before new items (deterministic: single item per tier)", () => {
    const templates = [mk("new-q"), mk("due-q")];
    const dueKey = learningItemKeyMc(slug, "due-q");
    const items: Record<string, LearningItemProgress> = {
      [dueKey]: {
        itemId: dueKey,
        timesCorrect: 2,
        timesWrong: 0,
        lastSeenAt: fixedNow.toISOString(),
        nextReviewAt: new Date(fixedNow.getTime() - 86_400_000).toISOString(),
      },
    };

    const deterministic = () => 0.1;
    const ordered = orderMcTemplatesForSrs(templates, slug, items, fixedNow, deterministic);
    expect(ordered[0]!.id).toBe("due-q");
    expect(ordered[1]!.id).toBe("new-q");
  });

  it("learningItemKeyMc strips session index suffix", () => {
    expect(learningItemKeyMc("foo", "bar::3")).toBe("foo:bar");
  });

  it("srsTierForItem marks overdue as tier 4", () => {
    const itemId = "x:y";
    const items = {
      [itemId]: {
        itemId,
        timesCorrect: 2,
        timesWrong: 0,
        nextReviewAt: new Date(fixedNow.getTime() - 1000).toISOString(),
      },
    };
    expect(srsTierForItem(itemId, items, fixedNow)).toBe(4);
  });
});
