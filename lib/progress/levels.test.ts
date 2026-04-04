import { describe, expect, it } from "vitest";
import {
  getLevelForStars,
  getLevelProgress,
  getNextLevelInfo,
  STAR_LEVELS,
} from "@/lib/progress/levels";

describe("levels (stars)", () => {
  it("getLevelForStars: thresholds choose correct level", () => {
    expect(getLevelForStars(0).id).toBe("star-l1");
    expect(getLevelForStars(3).id).toBe("star-l1");
    expect(getLevelForStars(4).id).toBe("star-l2");
    expect(getLevelForStars(9).id).toBe("star-l2");
    expect(getLevelForStars(10).id).toBe("star-l3");
    expect(getLevelForStars(21).id).toBe("star-l3");
    expect(getLevelForStars(22).id).toBe("star-l4");
    expect(getLevelForStars(41).id).toBe("star-l4");
    expect(getLevelForStars(42).id).toBe("star-l5");
    expect(getLevelForStars(999).id).toBe("star-l5");
  });

  it("getNextLevelInfo: stars until next boundary", () => {
    expect(getNextLevelInfo(0)).toEqual({
      next: STAR_LEVELS[1],
      starsNeeded: 4,
    });
    expect(getNextLevelInfo(4)).toEqual({
      next: STAR_LEVELS[2],
      starsNeeded: 6,
    });
    expect(getNextLevelInfo(41)?.starsNeeded).toBe(1);
    expect(getNextLevelInfo(42)).toBeNull();
    expect(getNextLevelInfo(200)).toBeNull();
  });

  it("getLevelProgress: max level shows no next and full bar", () => {
    const p = getLevelProgress(42);
    expect(p.isMaxLevel).toBe(true);
    expect(p.next).toBeNull();
    expect(p.barFraction).toBe(1);
    expect(p.starsToNext).toBe(0);
  });

  it("getLevelProgress: bar fraction within band", () => {
    const p = getLevelProgress(7); // L2: 4..9, next at 10
    expect(p.current.id).toBe("star-l2");
    expect(p.next?.id).toBe("star-l3");
    expect(p.starsToNext).toBe(3);
    expect(p.barFraction).toBeCloseTo((7 - 4) / (10 - 4), 5);
  });

  it("negative stars are treated as zero", () => {
    expect(getLevelForStars(-3).id).toBe("star-l1");
    expect(getLevelProgress(-1).current.id).toBe("star-l1");
  });
});
