import { describe, expect, it } from "vitest";
import { getFlagMissionById } from "@/content/flags/flag-missions";
import {
  buildFlagMissionPlayHref,
  buildFlagMissionReturnHref,
  resolveFlagMissionPlayEndFlow,
} from "@/lib/flags/flag-mission-return-flow";
import { defaultProgress, type AppProgress } from "@/lib/progress/storage";

describe("flag-mission-return-flow", () => {
  it("קישור משחק כולל flagsMission ו-flagsStep", () => {
    const href = buildFlagMissionPlayHref("flags-country-choice", "flags-m-1-starter", "s1-mc");
    expect(href).toContain("flagsMission=flags-m-1-starter");
    expect(href).toContain("flagsStep=s1-mc");
    expect(href).toMatch(/\/play\/flags-country-choice\?/);
  });

  it("קישור משחק יכול לכלול playLevel מההמלצה", () => {
    const href = buildFlagMissionPlayHref("flags-country-choice", "flags-m-1-starter", "s1-mc", {
      playLevel: "steady",
    });
    expect(href).toContain("playLevel=steady");
  });

  it("חזרה לדף משימה עם שלב וחגיגת סיום", () => {
    const href = buildFlagMissionReturnHref("flags-m-4-journey", {
      returnFromStepId: "s4c",
      missionJustCompleted: true,
    });
    expect(href).toContain("returnFromStep=s4c");
    expect(href).toContain("flagsMissionDone=1");
  });

  it("אחרי סיום חלקי — הכפתור הראשי מוביל לשלב הבא", () => {
    const mission = getFlagMissionById("flags-m-4-journey")!;
    const first = mission.steps[0]!;
    const p: AppProgress = {
      ...defaultProgress(),
      worlds: {
        ...defaultProgress().worlds,
        flags: {
          ...defaultProgress().worlds.flags,
          completedGameSlugs: [first.gameSlug],
        },
      },
      flagsMissionProgress: {
        completedMissionIds: [],
        completedSlugsByMissionId: { [mission.id]: [first.gameSlug] },
      },
    };
    const flow = resolveFlagMissionPlayEndFlow(p, {
      missionId: mission.id,
      stepId: first.id,
      gameSlug: first.gameSlug,
    });
    expect(flow).not.toBeNull();
    expect(flow!.primaryLabel).toBe("לשלב הבא");
    expect(flow!.primaryHref).toContain("flagsStep=");
    expect(flow!.primaryHref).toContain("flagsMission=flags-m-4-journey");
    expect(flow!.primaryHref).toContain("playLevel=");
  });

  it("אחרי השלמת כל השלבים — קישור חזרה עם flagsMissionDone", () => {
    const mission = getFlagMissionById("flags-m-1-starter")!;
    const slug = mission.steps[0]!.gameSlug;
    const p: AppProgress = {
      ...defaultProgress(),
      worlds: {
        ...defaultProgress().worlds,
        flags: {
          ...defaultProgress().worlds.flags,
          completedGameSlugs: [slug],
        },
      },
    };
    const flow = resolveFlagMissionPlayEndFlow(p, {
      missionId: mission.id,
      stepId: mission.steps[0]!.id,
      gameSlug: slug,
    });
    expect(flow).not.toBeNull();
    expect(flow!.primaryLabel).toBe("חוזרים למשימה");
    expect(flow!.primaryHref).toContain("flagsMissionDone=1");
  });

  it("בלי הקשר משימה — null (מסך סיום רגיל)", () => {
    const p = defaultProgress();
    expect(
      resolveFlagMissionPlayEndFlow(p, { missionId: undefined, stepId: undefined, gameSlug: "x" }),
    ).toBeNull();
  });
});
