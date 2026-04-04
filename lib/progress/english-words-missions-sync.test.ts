import { describe, expect, it } from "vitest";
import { defaultProgress } from "@/lib/progress/storage";
import {
  missionNeedsPerMissionSlugCompletion,
  isEnglishWordMissionComplete,
} from "./english-words-missions-sync";
import { ENGLISH_WORD_MISSIONS } from "@/content/english-words/english-word-missions";

describe("english-words-missions-sync", () => {
  it("משימת המסע האחרונה דורשת מעקב slug-ים בהקפת המשימה", () => {
    const journey = ENGLISH_WORD_MISSIONS.find((m) => m.id === "ew-m-5-journey");
    expect(journey).toBeDefined();
    expect(missionNeedsPerMissionSlugCompletion(journey!)).toBe(true);
  });

  it("השלמת slugs רק גלובלית לא מסיימת את המסע אם חסר הקפת משימה", () => {
    const base = defaultProgress();
    const progress = {
      ...base,
      worlds: {
        ...base.worlds,
        englishWords: {
          ...base.worlds.englishWords,
          completedGameSlugs: [
            "en-words-build-order",
            "en-words-to-picture",
            "en-words-listen-choose",
          ],
        },
      },
      englishWordsMissionProgress: {
        completedMissionIds: [],
        completedSlugsByMissionId: {},
      },
    };
    const journey = ENGLISH_WORD_MISSIONS.find((m) => m.id === "ew-m-5-journey")!;
    expect(
      isEnglishWordMissionComplete(journey, {
        worlds: { englishWords: progress.worlds.englishWords },
        englishWordsMissionProgress: progress.englishWordsMissionProgress,
      }),
    ).toBe(false);
  });

  it("אחרי רישום slugs תחת mission id — המשימה מושלמת", () => {
    const base = defaultProgress();
    const progress = {
      ...base,
      worlds: {
        ...base.worlds,
        englishWords: {
          ...base.worlds.englishWords,
          completedGameSlugs: [],
        },
      },
      englishWordsMissionProgress: {
        completedMissionIds: [],
        completedSlugsByMissionId: {
          "ew-m-5-journey": [
            "en-words-build-order",
            "en-words-to-picture",
            "en-words-listen-choose",
          ],
        },
      },
    };
    const journey = ENGLISH_WORD_MISSIONS.find((m) => m.id === "ew-m-5-journey")!;
    expect(
      isEnglishWordMissionComplete(journey, {
        worlds: { englishWords: progress.worlds.englishWords },
        englishWordsMissionProgress: progress.englishWordsMissionProgress,
      }),
    ).toBe(true);
  });
});
