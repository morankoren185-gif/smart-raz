import { describe, expect, it } from "vitest";
import { FLAG_COUNTRY_REGION, type FlagRegionId } from "./flag-regions";
import type { FlagChoiceKey } from "./curated-catalog";

describe("flag-regions — תשתית לאזורים", () => {
  it("לכל מפתח דגל יש אזור", () => {
    const keys = Object.keys(FLAG_COUNTRY_REGION) as FlagChoiceKey[];
    expect(keys.length).toBeGreaterThanOrEqual(20);
    for (const k of keys) {
      expect(FLAG_COUNTRY_REGION[k]).toBeTruthy();
    }
  });

  it("מדינות חדשות ממופות לאזורים צפויים", () => {
    expect(FLAG_COUNTRY_REGION.de).toBe("europe");
    expect(FLAG_COUNTRY_REGION.mx).toBe("northAmerica");
    expect(FLAG_COUNTRY_REGION.ar).toBe("southAmerica");
    expect(FLAG_COUNTRY_REGION.cn).toBe("asia");
    expect(FLAG_COUNTRY_REGION.in).toBe("asia");
    expect(FLAG_COUNTRY_REGION.za).toBe("africa");
    expect(FLAG_COUNTRY_REGION.il).toBe("middleEast");
    expect(FLAG_COUNTRY_REGION.eg).toBe("middleEast");
    expect(FLAG_COUNTRY_REGION.sa).toBe("middleEast");
    expect(FLAG_COUNTRY_REGION.jo).toBe("middleEast");
    expect(FLAG_COUNTRY_REGION.tr).toBe("middleEast");
    expect(FLAG_COUNTRY_REGION.ae).toBe("middleEast");
  });

  it("ערכי אזור מוגבלים לרשימת המזהים", () => {
    const allowed = new Set<FlagRegionId>([
      "europe",
      "middleEast",
      "southAmerica",
      "northAmerica",
      "asia",
      "africa",
      "oceania",
      "northAtlantic",
    ]);
    for (const r of Object.values(FLAG_COUNTRY_REGION)) {
      expect(allowed.has(r)).toBe(true);
    }
  });
});
