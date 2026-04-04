import { describe, expect, it, vi } from "vitest";
import { getCountrySpecById } from "@/content/map-world";
import {
  getUnlockedCountryIdsForStars,
  isCountryUnlockedByStars,
  starsMissingToUnlock,
} from "./map-progress";
import {
  defaultProgress,
  PROGRESS_STORAGE_KEY,
  saveProgress,
  type AppProgress,
} from "./storage";

describe("map-progress", () => {
  const israel = getCountrySpecById("map-israel")!;
  const japan = getCountrySpecById("map-japan")!;
  const brazil = getCountrySpecById("map-brazil")!;

  it("אפס כוכבים — רק ישראל פתוחה", () => {
    expect(getUnlockedCountryIdsForStars(0)).toEqual(["map-israel"]);
    expect(isCountryUnlockedByStars(israel, 0)).toBe(true);
    expect(isCountryUnlockedByStars(japan, 0)).toBe(false);
  });

  it("אחרי מספיק כוכבים — מתווספות תחנות", () => {
    expect(getUnlockedCountryIdsForStars(5)).toEqual(["map-israel", "map-france"]);
    expect(getUnlockedCountryIdsForStars(8)).toContain("map-japan");
    expect(getUnlockedCountryIdsForStars(18)).toContain("map-brazil");
    expect(getUnlockedCountryIdsForStars(17)).not.toContain("map-brazil");
    expect(isCountryUnlockedByStars(japan, 8)).toBe(true);
  });

  it("מדינה נעולה מציגה כמה כוכבים חסרים", () => {
    expect(starsMissingToUnlock(japan, 4)).toBe(4);
    expect(starsMissingToUnlock(brazil, 10)).toBe(8);
    expect(starsMissingToUnlock(brazil, 18)).toBe(0);
  });

  it("שמירת progress מסנכרנת mapProgress לפי כוכבים", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => store.set(k, v),
      },
      dispatchEvent: vi.fn(),
    });

    const p: AppProgress = {
      ...defaultProgress(),
      stars: 7,
    };
    saveProgress(p);

    const raw = store.get(PROGRESS_STORAGE_KEY);
    expect(raw).toBeDefined();
    const parsed = JSON.parse(raw!) as AppProgress;
    expect(parsed.mapProgress?.unlockedCountryIds.sort()).toEqual(
      getUnlockedCountryIdsForStars(7).sort(),
    );

    vi.unstubAllGlobals();
  });
});
