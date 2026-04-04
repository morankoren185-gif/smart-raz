import { describe, expect, it } from "vitest";
import { SPACE_MISSIONS, getSpaceMissionById } from "./space-missions";
import { getGameDefinitionBySlug } from "@/content/game-definitions";
import {
  computeCompletedSpaceMissionIds,
  getSuggestedNextSpaceMission,
  isSpaceMissionComplete,
  isSpaceMissionUnlocked,
} from "@/lib/progress/space-missions-sync";
import { defaultProgress, type AppProgress } from "@/lib/progress/storage";
import {
  buildSpaceMissionPlayHref,
  buildSpaceMissionReturnHref,
  resolveSpaceMissionPlayEndFlow,
} from "@/lib/space/space-mission-return-flow";

describe("space-missions קטלוג", () => {
  it("נטענות חמש משימות MVP", () => {
    expect(SPACE_MISSIONS.length).toBe(5);
  });

  it("כל שלב מצביע על משחק space קיים", () => {
    for (const m of SPACE_MISSIONS) {
      for (const s of m.steps) {
        const def = getGameDefinitionBySlug(s.gameSlug);
        expect(def, s.gameSlug).toBeDefined();
        expect(def?.world).toBe("space");
      }
    }
  });

  it("רצף requiresCompletedMissionId לינארי", () => {
    const m2 = getSpaceMissionById("space-m-2-name-planet")!;
    const m3 = getSpaceMissionById("space-m-3-matching")!;
    const m4 = getSpaceMissionById("space-m-4-journey")!;
    const m5 = getSpaceMissionById("space-m-5-solar-order")!;
    expect(m2.requiresCompletedMissionId).toBe("space-m-1-known");
    expect(m3.requiresCompletedMissionId).toBe("space-m-2-name-planet");
    expect(m4.requiresCompletedMissionId).toBe("space-m-3-matching");
    expect(m5.requiresCompletedMissionId).toBe("space-m-4-journey");
  });

  it("משימת התחלה — השלמה לפי slugs גלובליים בעולם", () => {
    const m1 = getSpaceMissionById("space-m-1-known")!;
    const p = defaultProgress();
    expect(isSpaceMissionComplete(m1, { worlds: p.worlds, spaceMissionProgress: p.spaceMissionProgress })).toBe(
      false,
    );
    const p2: AppProgress = {
      ...p,
      worlds: {
        ...p.worlds,
        space: {
          ...p.worlds.space,
          completedGameSlugs: [m1.steps[0]!.gameSlug],
        },
      },
    };
    expect(
      isSpaceMissionComplete(m1, { worlds: p2.worlds, spaceMissionProgress: p2.spaceMissionProgress }),
    ).toBe(true);
  });

  it("computeCompletedSpaceMissionIds ו-next", () => {
    const p = defaultProgress();
    expect(
      computeCompletedSpaceMissionIds({ worlds: p.worlds, spaceMissionProgress: p.spaceMissionProgress }),
    ).toEqual([]);
    const m1 = getSpaceMissionById("space-m-1-known")!;
    const partialWorlds = {
      ...p.worlds,
      space: {
        ...p.worlds.space,
        completedGameSlugs: [m1.steps[0]!.gameSlug],
      },
    };
    expect(
      computeCompletedSpaceMissionIds({
        worlds: partialWorlds,
        spaceMissionProgress: p.spaceMissionProgress,
      }),
    ).toContain("space-m-1-known");
    const next = getSuggestedNextSpaceMission({
      worlds: partialWorlds,
      spaceMissionProgress: p.spaceMissionProgress,
    });
    expect(next?.id).toBe("space-m-2-name-planet");
  });

  it("מסע אחרון לא נחשב מושלם רק מגלובלי — צריך slugs למשימה", () => {
    const m4 = getSpaceMissionById("space-m-4-journey")!;
    const slugs = m4.steps.map((s) => s.gameSlug);
    const progress = {
      worlds: { space: { completedGameSlugs: slugs } },
      spaceMissionProgress: { completedMissionIds: [] as string[] },
    };
    expect(isSpaceMissionComplete(m4, progress)).toBe(false);
    const done = {
      ...progress,
      spaceMissionProgress: {
        completedMissionIds: [] as string[],
        completedSlugsByMissionId: { "space-m-4-journey": slugs },
      },
    };
    expect(isSpaceMissionComplete(m4, done)).toBe(true);
  });

  it("getSuggestedNextSpaceMission מצביע על מסע כשהוא פתוח וחסר השלמה", () => {
    const m1 = getSpaceMissionById("space-m-1-known")!;
    const m2 = getSpaceMissionById("space-m-2-name-planet")!;
    const m3 = getSpaceMissionById("space-m-3-matching")!;
    const m4 = getSpaceMissionById("space-m-4-journey")!;
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
        space: {
          ...base.worlds.space,
          completedGameSlugs: allGlobal,
        },
      },
      spaceMissionProgress: {
        completedMissionIds: ["space-m-1-known", "space-m-2-name-planet", "space-m-3-matching"],
      },
    };
    expect(isSpaceMissionComplete(m4, { worlds: p.worlds, spaceMissionProgress: p.spaceMissionProgress })).toBe(
      false,
    );
    const next = getSuggestedNextSpaceMission({ worlds: p.worlds, spaceMissionProgress: p.spaceMissionProgress });
    expect(next?.id).toBe("space-m-4-journey");
  });

  it("נעילת משימה — לא פתוחה בלי הקודמת", () => {
    const m2 = getSpaceMissionById("space-m-2-name-planet")!;
    const p = defaultProgress();
    expect(isSpaceMissionUnlocked(m2, { worlds: p.worlds, spaceMissionProgress: p.spaceMissionProgress })).toBe(
      false,
    );
  });
});

describe("space mission return flow", () => {
  it("קישור משחק כולל spaceMission ו-spaceStep", () => {
    const href = buildSpaceMissionPlayHref("space-planet-to-name", "space-m-1-known", "space-s1-p2n");
    expect(href).toContain("spaceMission=space-m-1-known");
    expect(href).toContain("spaceStep=space-s1-p2n");
  });

  it("חזרה עם חגיגת סיום", () => {
    const href = buildSpaceMissionReturnHref("space-m-4-journey", {
      returnFromStepId: "space-s4c-match",
      missionJustCompleted: true,
    });
    expect(href).toContain("returnFromStep=space-s4c-match");
    expect(href).toContain("spaceMissionDone=1");
    expect(href).toContain("/world/space/mission/");
  });

  it("אחרי סיום חלקי במסע — כפתור לשלב הבא", () => {
    const mission = getSpaceMissionById("space-m-4-journey")!;
    const first = mission.steps[0]!;
    const p: AppProgress = {
      ...defaultProgress(),
      worlds: {
        ...defaultProgress().worlds,
        space: {
          ...defaultProgress().worlds.space,
          completedGameSlugs: [first.gameSlug],
        },
      },
      spaceMissionProgress: {
        completedMissionIds: [],
        completedSlugsByMissionId: { [mission.id]: [first.gameSlug] },
      },
    };
    const flow = resolveSpaceMissionPlayEndFlow(p, {
      missionId: mission.id,
      stepId: first.id,
      gameSlug: first.gameSlug,
    });
    expect(flow?.primaryLabel).toBe("לשלב הבא");
    expect(flow?.primaryHref).toContain("spaceStep=");
    expect(flow?.primaryHref).toContain("spaceMission=space-m-4-journey");
    expect(flow?.primaryHref).toContain("playLevel=");
  });

  it("אחרי משימה חד-שלבית מושלמת — חזרה עם spaceMissionDone", () => {
    const mission = getSpaceMissionById("space-m-1-known")!;
    const slug = mission.steps[0]!.gameSlug;
    const p: AppProgress = {
      ...defaultProgress(),
      worlds: {
        ...defaultProgress().worlds,
        space: {
          ...defaultProgress().worlds.space,
          completedGameSlugs: [slug],
        },
      },
    };
    const flow = resolveSpaceMissionPlayEndFlow(p, {
      missionId: mission.id,
      stepId: mission.steps[0]!.id,
      gameSlug: slug,
    });
    expect(flow?.primaryHref).toContain("spaceMissionDone=1");
  });
});
