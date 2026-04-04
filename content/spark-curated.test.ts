import { describe, expect, it } from "vitest";
import {
  FLAGS_MAP_SPARK_TEMPLATES,
  FLAGS_MATCHING_SPARK_ROUNDS,
  FLAGS_MC_SPARK_TEMPLATES,
} from "@/content/flags/curated-catalog";
import { flagsCountryChoiceDefinition } from "@/content/flags/flag-country-choice";
import { flagsFlagMatchingDefinition } from "@/content/flags/flag-country-matching";
import { flagsCountryOnMapDefinition } from "@/content/flags/flags-country-on-map";
import {
  SPACE_COMPARE_MC_CURATED_SPARK,
  SPACE_ORDER_MC_CURATED_SPARK,
} from "@/content/space/curated-catalog";
import { buildPlanetCompareBank } from "@/content/space/space-compare-factories";
import { buildPlanetOrderMcBank } from "@/content/space/space-order-factories";
import { resolvePlaySessionForSlug } from "@/lib/play/resolvePlaySessionForSlug";

describe("spark אוצר — flags", () => {
  it("MC / map / matching — לא ריקים ונשענים על מפתחות מהקטלוג", () => {
    const mc = flagsCountryChoiceDefinition.banksByLevel.spark;
    const map = flagsCountryOnMapDefinition.banksByLevel.spark;
    const match = flagsFlagMatchingDefinition.banksByLevel.spark;
    expect(mc.length).toBe(FLAGS_MC_SPARK_TEMPLATES.length);
    expect(map.length).toBe(FLAGS_MAP_SPARK_TEMPLATES.length);
    expect(match.length).toBe(FLAGS_MATCHING_SPARK_ROUNDS.length);
    for (let i = 0; i < mc.length; i++) {
      expect(mc[i]!.correctAnswer).toBe(FLAGS_MC_SPARK_TEMPLATES[i]!.correct);
    }
    for (let i = 0; i < map.length; i++) {
      expect(map[i]!.correctAnswer).toBe(FLAGS_MAP_SPARK_TEMPLATES[i]!.correct);
    }
  });

  it("אין שאלת דגל עם GB ו־US יחד במסיחים (לא טריקי מדי)", () => {
    for (const t of FLAGS_MC_SPARK_TEMPLATES) {
      const opts = [t.correct, ...t.distractors];
      const hasGb = opts.includes("gb");
      const hasUs = opts.includes("us");
      expect(hasGb && hasUs).toBe(false);
    }
  });

  it("resolve playable — דגלים נשארים פתוחים", () => {
    expect(resolvePlaySessionForSlug("flags-country-choice")?.kind).toBe("multiple-choice-playable");
    expect(resolvePlaySessionForSlug("flags-country-on-map")?.kind).toBe("multiple-choice-playable");
    expect(resolvePlaySessionForSlug("flags-flag-matching")?.kind).toBe("matching-playable");
  });
});

describe("spark אוצר — space", () => {
  it("order/compare spark מתוך הקטלוג (מזהים + טקסטים)", () => {
    const ord = buildPlanetOrderMcBank();
    const cmp = buildPlanetCompareBank();
    expect(ord.spark.map((q) => q.id)).toEqual(SPACE_ORDER_MC_CURATED_SPARK.map((s) => s.id));
    expect(cmp.spark.map((q) => q.id)).toEqual(SPACE_COMPARE_MC_CURATED_SPARK.map((s) => s.id));
    for (let i = 0; i < ord.spark.length; i++) {
      expect(ord.spark[i]!.instructions).toBe(SPACE_ORDER_MC_CURATED_SPARK[i]!.instructions);
    }
    for (let i = 0; i < cmp.spark.length; i++) {
      expect(cmp.spark[i]!.explanation).toBe(SPACE_COMPARE_MC_CURATED_SPARK[i]!.explanation);
    }
  });

  it("כל שאלות compare ב-spark — רק closer/farther (בלי earlier/later מבלבלים)", () => {
    for (const q of buildPlanetCompareBank().spark) {
      const t = q.instructions.toLowerCase();
      expect(t).not.toContain("earlier");
      expect(t).not.toContain("later");
    }
  });
});
