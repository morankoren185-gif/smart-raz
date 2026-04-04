import { describe, expect, it } from "vitest";
import { SOLAR_PLANETS_FROM_SUN } from "@/content/space/lexicon";
import {
  getSolarOrderHintItems,
  inferOrderMcHighlightPlanet,
} from "@/lib/space/solar-order-hint";

describe("solar-order-hint", () => {
  it("getSolarOrderHintItems נגזר מ־SOLAR_PLANETS_FROM_SUN ובאותו סדר", () => {
    const items = getSolarOrderHintItems();
    expect(items.map((x) => x.planet)).toEqual([...SOLAR_PLANETS_FROM_SUN]);
    expect(items).toHaveLength(8);
    expect(items[0]!.position).toBe(1);
    expect(items[3]!.planet).toBe("Mars");
    expect(items[3]!.position).toBe(4);
    expect(items.every((x) => x.visual.emoji.length > 0)).toBe(true);
  });

  it("inferOrderMcHighlightPlanet מזהה כוכב מ־illustrationKey", () => {
    expect(
      inferOrderMcHighlightPlanet("x", {
        emoji: "x",
        illustrationKey: "planet/mars",
      }),
    ).toBe("Mars");
  });

  it("inferOrderMcHighlightPlanet מזהה מספר סידורי בטקסט", () => {
    expect(inferOrderMcHighlightPlanet("Which planet is 4th from the Sun?", null)).toBe("Mars");
  });

  it("inferOrderMcHighlightPlanet מחזיר undefined בלי רמז מתאים", () => {
    expect(inferOrderMcHighlightPlanet("Hello", { emoji: "☀️" })).toBeUndefined();
  });
});
