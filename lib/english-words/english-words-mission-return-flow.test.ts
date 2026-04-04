import { describe, expect, it } from "vitest";
import { getEnglishWordMissionById } from "@/content/english-words/english-word-missions";
import {
  buildEnglishWordMissionPlayHref,
  buildEnglishWordMissionReturnHref,
  resolveEnglishWordMissionPlayEndFlow,
} from "./english-words-mission-return-flow";
import { defaultProgress, type AppProgress } from "@/lib/progress/storage";

describe("english-words-mission-return-flow", () => {
  it("קישור משחק כולל wordMission ו-wordStep", () => {
    const href = buildEnglishWordMissionPlayHref("en-words-match", "ew-m-2-match", "ew-s2-match");
    expect(href).toContain("wordMission=ew-m-2-match");
    expect(href).toContain("wordStep=ew-s2-match");
    expect(href).toMatch(/\/play\/en-words-match\?/);
  });

  it("חזרה לדף משימה עם שלב וחגיגת סיום", () => {
    const href = buildEnglishWordMissionReturnHref("ew-m-5-journey", {
      returnFromStepId: "ew-s5c-listen",
      missionJustCompleted: true,
    });
    expect(href).toContain("returnFromStep=ew-s5c-listen");
    expect(href).toContain("wordMissionDone=1");
  });

  it("אחרי סיום חלקי — הכפתור הראשי מוביל לשלב הבא", () => {
    const mission = getEnglishWordMissionById("ew-m-5-journey")!;
    const first = mission.steps[0]!;
    const base = defaultProgress();
    const p: AppProgress = {
      ...base,
      worlds: {
        ...base.worlds,
        englishWords: {
          ...base.worlds.englishWords,
          completedGameSlugs: [first.gameSlug],
        },
      },
      englishWordsMissionProgress: {
        completedMissionIds: [],
        completedSlugsByMissionId: { [mission.id]: [first.gameSlug] },
      },
    };
    const flow = resolveEnglishWordMissionPlayEndFlow(p, {
      missionId: mission.id,
      stepId: first.id,
      gameSlug: first.gameSlug,
    });
    expect(flow).not.toBeNull();
    expect(flow!.primaryLabel).toBe("לשלב הבא");
    expect(flow!.primaryHref).toContain("wordStep=");
    expect(flow!.primaryHref).toContain("wordMission=ew-m-5-journey");
    expect(flow!.primaryHref).toContain("playLevel=");
  });

  it("אחרי השלמת כל השלבים — קישור חזרה עם wordMissionDone", () => {
    const mission = getEnglishWordMissionById("ew-m-1-word-picture")!;
    const slug = mission.steps[0]!.gameSlug;
    const base = defaultProgress();
    const p: AppProgress = {
      ...base,
      worlds: {
        ...base.worlds,
        englishWords: {
          ...base.worlds.englishWords,
          completedGameSlugs: [slug],
        },
      },
    };
    const flow = resolveEnglishWordMissionPlayEndFlow(p, {
      missionId: mission.id,
      stepId: mission.steps[0]!.id,
      gameSlug: slug,
    });
    expect(flow).not.toBeNull();
    expect(flow!.primaryLabel).toBe("חוזרים למשימה");
    expect(flow!.primaryHref).toContain("wordMissionDone=1");
  });

  it("בלי הקשר משימה — null", () => {
    const p = defaultProgress();
    expect(
      resolveEnglishWordMissionPlayEndFlow(p, { missionId: undefined, stepId: undefined, gameSlug: "x" }),
    ).toBeNull();
  });
});
