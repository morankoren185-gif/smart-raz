import { describe, expect, it } from "vitest";
import { getFlagMissionById } from "@/content/flags/flag-missions";
import {
  getSuggestedNextFlagMission,
  isFlagMissionComplete,
  isFlagMissionStepDoneInContext,
  missionNeedsPerMissionSlugCompletion,
  type ForFlagMissions,
} from "@/lib/progress/flags-missions-sync";
import { defaultProgress, mergeFlagsMissionProgressState, type AppProgress } from "@/lib/progress/storage";

const JOURNEY_ID = "flags-m-4-journey";

describe("flags-missions-sync — מסלול משימה מול slug גלובלי", () => {
  it("משימת מסע משותפת דורשת מעקב בהקפת משימה; משימות מוקדמות לא", () => {
    const m4 = getFlagMissionById(JOURNEY_ID)!;
    const m1 = getFlagMissionById("flags-m-1-starter")!;
    expect(missionNeedsPerMissionSlugCompletion(m4)).toBe(true);
    expect(missionNeedsPerMissionSlugCompletion(m1)).toBe(false);
  });

  it("משימה 4 לא מושלמת רק בגלל שכל ה-slugs כבר בבנק הגלובלי", () => {
    const m4 = getFlagMissionById(JOURNEY_ID)!;
    const slugs = m4.steps.map((s) => s.gameSlug);
    const progress: ForFlagMissions = {
      worlds: { flags: { completedGameSlugs: slugs } },
      flagsMissionProgress: { completedMissionIds: [] },
    };
    expect(isFlagMissionComplete(m4, progress)).toBe(false);
  });

  it("אחרי רישום סיומים תחת missionId — המשימה כן מושלמת", () => {
    const m4 = getFlagMissionById(JOURNEY_ID)!;
    const slugs = m4.steps.map((s) => s.gameSlug);
    const progress: ForFlagMissions = {
      worlds: { flags: { completedGameSlugs: slugs } },
      flagsMissionProgress: {
        completedMissionIds: [],
        completedSlugsByMissionId: { [JOURNEY_ID]: slugs },
      },
    };
    expect(isFlagMissionComplete(m4, progress)).toBe(true);
    expect(isFlagMissionStepDoneInContext(m4, m4.steps[0]!, progress)).toBe(true);
  });

  it("getSuggestedNextFlagMission עדיין מצביע על מסע כשהוא הפתוח והלא-גמור", () => {
    const m4 = getFlagMissionById(JOURNEY_ID)!;
    const m1 = getFlagMissionById("flags-m-1-starter")!;
    const m2 = getFlagMissionById("flags-m-2-pairs")!;
    const m3 = getFlagMissionById("flags-m-3-map")!;
    const allGlobal = [
      ...new Set([
        ...m1.steps.map((s) => s.gameSlug),
        ...m2.steps.map((s) => s.gameSlug),
        ...m3.steps.map((s) => s.gameSlug),
        ...m4.steps.map((s) => s.gameSlug),
      ]),
    ];
    const base = defaultProgress();
    const p: AppProgress = {
      ...base,
      worlds: {
        ...base.worlds,
        flags: {
          ...base.worlds.flags,
          completedGameSlugs: allGlobal,
        },
      },
      flagsMissionProgress: {
        completedMissionIds: ["flags-m-1-starter", "flags-m-2-pairs", "flags-m-3-map"],
      },
    };
    expect(isFlagMissionComplete(m4, p)).toBe(false);
    const next = getSuggestedNextFlagMission(p);
    expect(next?.id).toBe(JOURNEY_ID);
  });
});

describe("mergeFlagsMissionProgressState", () => {
  it("מאחד missionIds ומאחד slugs לפי משימה בלי לאבד מפתחות", () => {
    const a = mergeFlagsMissionProgressState(
      {
        completedMissionIds: ["m-a"],
        completedSlugsByMissionId: { x: ["g1"] },
      },
      {
        completedMissionIds: ["m-b"],
        completedSlugsByMissionId: { x: ["g2"], y: ["g3"] },
      },
    );
    expect(a.completedMissionIds.sort()).toEqual(["m-a", "m-b"].sort());
    expect(a.completedSlugsByMissionId?.x.sort()).toEqual(["g1", "g2"].sort());
    expect(a.completedSlugsByMissionId?.y).toEqual(["g3"]);
  });

  it("patch ריק שומר על completedSlugsByMissionId קודם", () => {
    const merged = mergeFlagsMissionProgressState(
      { completedMissionIds: ["x"], completedSlugsByMissionId: { j: ["a"] } },
      undefined,
    );
    expect(merged.completedSlugsByMissionId).toEqual({ j: ["a"] });
  });
});
