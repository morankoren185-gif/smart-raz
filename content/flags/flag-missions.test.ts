import { describe, expect, it } from "vitest";
import { FLAG_MISSIONS, getFlagMissionById } from "./flag-missions";
import { getGameDefinitionBySlug } from "@/content/game-definitions";
import {
  computeCompletedFlagMissionIds,
  getSuggestedNextFlagMission,
  isFlagMissionComplete,
  isFlagMissionUnlocked,
} from "@/lib/progress/flags-missions-sync";
import { defaultProgress, type AppProgress } from "@/lib/progress/storage";

describe("flag-missions", () => {
  it("נטען קטלוג עם לפחות שלוש משימות", () => {
    expect(FLAG_MISSIONS.length).toBeGreaterThanOrEqual(3);
  });

  it("כל שלב מצביע על משחק flags קיים", () => {
    for (const m of FLAG_MISSIONS) {
      for (const s of m.steps) {
        const def = getGameDefinitionBySlug(s.gameSlug);
        expect(def, s.gameSlug).toBeDefined();
        expect(def?.world).toBe("flags");
      }
    }
  });

  it("משימה עם שלבים תקינים — השלמה מזהה כל ה-slugs", () => {
    const m1 = getFlagMissionById("flags-m-1-starter")!;
    expect(m1.steps.length).toBeGreaterThan(0);
    const p = defaultProgress();
    expect(isFlagMissionComplete(m1, p)).toBe(false);
    const p2: AppProgress = {
      ...p,
      worlds: {
        ...p.worlds,
        flags: {
          ...p.worlds.flags,
          completedGameSlugs: [m1.steps[0]!.gameSlug],
        },
      },
    };
    expect(isFlagMissionComplete(m1, p2)).toBe(true);
  });

  it("computeCompletedFlagMissionIds ו-next mission עובדים יחד", () => {
    const p = defaultProgress();
    expect(computeCompletedFlagMissionIds(p)).toEqual([]);
    const m1 = getFlagMissionById("flags-m-1-starter")!;
    const pPartial: AppProgress = {
      ...p,
      worlds: {
        ...p.worlds,
        flags: {
          ...p.worlds.flags,
          completedGameSlugs: [m1.steps[0]!.gameSlug],
        },
      },
    };
    expect(computeCompletedFlagMissionIds(pPartial)).toContain("flags-m-1-starter");
    const next = getSuggestedNextFlagMission(pPartial);
    expect(next).toBeDefined();
    expect(next?.id).toBe("flags-m-2-pairs");
  });

  it("משימה 2 נעולה לפני סיום 1", () => {
    const p = defaultProgress();
    const m2 = getFlagMissionById("flags-m-2-pairs")!;
    expect(isFlagMissionUnlocked(m2, p)).toBe(false);
  });
});
