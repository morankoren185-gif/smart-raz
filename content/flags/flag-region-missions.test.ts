import { describe, expect, it } from "vitest";
import { FLAG_EXTENDED_LABEL_HE, type FlagChoiceKey } from "@/content/flags/curated-catalog";
import { flagsCountryChoiceDefinition } from "@/content/flags/flag-country-choice";
import { flagsCountryOnMapDefinition } from "@/content/flags/flags-country-on-map";
import { flagsFlagMatchingDefinition } from "@/content/flags/flag-country-matching";
import { FLAG_REGION_MISSIONS_LIST } from "@/content/flags/flag-region-missions";
import { FLAG_COUNTRY_REGION, getFlagKeysInRegion } from "@/content/flags/flag-regions";
import { getFlagMissionById } from "@/content/flags/flag-missions";
import {
  missionNeedsPerMissionSlugCompletion,
  isFlagMissionUnlocked,
} from "@/lib/progress/flags-missions-sync";
import { defaultProgress } from "@/lib/progress/storage";
import { resolvePlaySessionForSlug } from "@/lib/play/resolvePlaySessionForSlug";
import { buildFlagMissionPlayHref } from "@/lib/flags/flag-mission-return-flow";
import { getStampDisplayForMission } from "@/lib/flags/flag-mission-stamp-display";
import {
  filterFlagMatchingBank,
  filterFlagMultipleChoiceBank,
} from "@/lib/flags/flag-region-play-filter";
import type { MatchingQuestion } from "@/lib/game-types/matching";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";

const FLAG_GAME_SLUGS = [
  "flags-country-choice",
  "flags-flag-matching",
  "flags-country-on-map",
] as const;

const MIDDLE_EAST_FOCUS_KEYS: readonly FlagChoiceKey[] = ["il", "eg", "sa", "jo", "tr", "ae"];

describe("מסעות אזוריים לדגלים", () => {
  it("הקטלוג נטען עם מסעות ומזהים ייחודיים", () => {
    expect(FLAG_REGION_MISSIONS_LIST.length).toBeGreaterThanOrEqual(5);
    const ids = new Set(FLAG_REGION_MISSIONS_LIST.map((m) => m.id));
    expect(ids.size).toBe(FLAG_REGION_MISSIONS_LIST.length);
    for (const m of FLAG_REGION_MISSIONS_LIST) {
      expect(m.regionId).toBeTruthy();
      expect(m.steps.length).toBe(3);
    }
  });

  it("כל מסע משתמש רק במדינות מאותו regionId (מול FLAG_COUNTRY_REGION)", () => {
    for (const m of FLAG_REGION_MISSIONS_LIST) {
      const regionId = m.regionId!;
      const allowed = new Set(getFlagKeysInRegion(regionId));
      for (const name of m.focusCountries) {
        const entry = (Object.entries(FLAG_EXTENDED_LABEL_HE) as [FlagChoiceKey, string][]).find(
          ([, label]) => label === name,
        );
        expect(entry, `${m.id}: ${name}`).toBeTruthy();
        expect(FLAG_COUNTRY_REGION[entry![0]], name).toBe(regionId);
        expect(allowed.has(entry![0])).toBe(true);
      }
    }
  });

  it("שלבים מצביעים על משחקי flags קיימים", () => {
    for (const m of FLAG_REGION_MISSIONS_LIST) {
      for (const s of m.steps) {
        expect(FLAG_GAME_SLUGS).toContain(s.gameSlug);
      }
    }
  });

  it("getFlagMissionById מוצא מסע אזורי", () => {
    const m = getFlagMissionById("flags-region-europe");
    expect(m?.regionId).toBe("europe");
    expect(m?.requiresCompletedMissionId).toBe("flags-m-4-journey");
  });

  it("משימה אזורית נעולה עד סיום מסע משולב", () => {
    const m = getFlagMissionById("flags-region-asia")!;
    const p = defaultProgress();
    expect(isFlagMissionUnlocked(m, p)).toBe(false);
  });

  it("מסע אזורי דורש מעקב slug לפי משימה (חפיפה למסלול הראשי)", () => {
    const m = getFlagMissionById("flags-region-south-america")!;
    expect(missionNeedsPerMissionSlugCompletion(m)).toBe(true);
  });

  it("קישור משחק כולל flagRegion כשנדרש", () => {
    const m = getFlagMissionById("flags-region-europe")!;
    const href = buildFlagMissionPlayHref("flags-country-choice", m.id, m.steps[0]!.id, {
      playLevel: "steady",
      flagRegion: m.regionId,
    });
    expect(href).toContain("flagRegion=europe");
  });

  it("מסע מזרח תיכון — נטען, מדינות וחותמת", () => {
    const m = getFlagMissionById("flags-region-middle-east")!;
    expect(m.regionId).toBe("middleEast");
    expect(m.focusCountries).toContain("ישראל");
    expect(m.focusCountries).toContain("מצרים");
    expect(m.focusCountries).toContain("סעודיה");
    const stamp = getStampDisplayForMission(m);
    expect(stamp.labelHe).toContain("מזרח התיכון");
    expect(stamp.labelHe).toContain("מסע");
    expect(stamp.labelHe).not.toBe("חותמת משימה");
    const href = buildFlagMissionPlayHref("flags-country-on-map", m.id, m.steps[2]!.id, {
      playLevel: "spark",
      flagRegion: m.regionId,
    });
    expect(href).toContain("flagRegion=middleEast");
  });

  it("מסע מזרח תיכון — שש המדינות מכוסות אחרי פילטר אזור (בחירה, התאמה, מפה)", () => {
    const choiceBank = filterFlagMultipleChoiceBank(
      flagsCountryChoiceDefinition.banksByLevel.steady as MultipleChoiceQuestion[],
      "middleEast",
    );
    const choiceAnswers = new Set(choiceBank.map((q) => q.correctAnswer));
    for (const k of MIDDLE_EAST_FOCUS_KEYS) {
      expect(choiceAnswers.has(k), `choice steady חסר ${k}`).toBe(true);
    }

    const mapBank = filterFlagMultipleChoiceBank(
      flagsCountryOnMapDefinition.banksByLevel.spark as MultipleChoiceQuestion[],
      "middleEast",
    );
    const mapAnswers = new Set(mapBank.map((q) => q.correctAnswer));
    for (const k of MIDDLE_EAST_FOCUS_KEYS) {
      expect(mapAnswers.has(k), `map spark חסר ${k}`).toBe(true);
    }

    const matchBank = filterFlagMatchingBank(
      flagsFlagMatchingDefinition.banksByLevel.spark as MatchingQuestion[],
      "middleEast",
    );
    const matchKeys = new Set<FlagChoiceKey>();
    for (const q of matchBank) {
      for (const p of q.pairs) {
        const hit = (Object.entries(FLAG_EXTENDED_LABEL_HE) as [FlagChoiceKey, string][]).find(
          ([, lab]) => lab === p.sideB.label,
        );
        if (hit) matchKeys.add(hit[0]);
      }
    }
    for (const k of MIDDLE_EAST_FOCUS_KEYS) {
      expect(matchKeys.has(k), `matching spark חסר ${k}`).toBe(true);
    }
  });

  it("מסע מזרח תיכון — תיאור ושלבים בעברית ברורה (לא סיסמה אחת לכל המשימה)", () => {
    const m = getFlagMissionById("flags-region-middle-east")!;
    expect(m.description.length).toBeGreaterThan(40);
    expect(m.description).toMatch(/דגל|מפה|מצרים|ישראל/);
    const labels = m.steps.map((s) => s.label.trim());
    expect(new Set(labels).size).toBe(labels.length);
    for (const lab of labels) {
      expect(lab.length).toBeGreaterThan(8);
      expect(lab).not.toMatch(/^זוגות$/);
    }
  });

  it("resolve למשחקי דגלים לא נשבר", () => {
    for (const slug of FLAG_GAME_SLUGS) {
      const r = resolvePlaySessionForSlug(slug);
      expect(r).toBeDefined();
    }
  });
});
