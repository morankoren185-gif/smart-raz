import { describe, expect, it } from "vitest";
import { MAP_WORLD_COUNTRIES } from "@/content/map-world";
import { MAP_COUNTRY_UNLOCK_STARS, STAR_LEVEL_STARS_REQUIRED_ASC } from "@/lib/progress/progression-tuning";

describe("progression-tuning", () => {
  it("ספי רמות עולים בהדרגה (מונוטוני)", () => {
    const [a, b, c, d, e] = STAR_LEVEL_STARS_REQUIRED_ASC;
    expect(a).toBe(0);
    expect(b).toBeLessThan(c);
    expect(c).toBeLessThan(d);
    expect(d).toBeLessThan(e);
  });

  it("ישראל תמיד פתוחה (0 כוכבים)", () => {
    expect(MAP_COUNTRY_UNLOCK_STARS["map-israel"]).toBe(0);
  });

  it("כל תחנת מפה בקטלוג מקבלת סף מ־progression-tuning", () => {
    for (const c of MAP_WORLD_COUNTRIES) {
      expect(MAP_COUNTRY_UNLOCK_STARS[c.id]).toBe(c.starsRequired);
    }
  });
});
