import { describe, expect, it } from "vitest";
import { getRegionMapDefinition, listRegionMapIds } from "./region-map-assets";

describe("region-map-assets", () => {
  it("מחזיר הגדרת מפה לפי mapId", () => {
    const def = getRegionMapDefinition("mid-east-europe");
    expect(def?.titleHe).toBeDefined();
    expect(def?.shapes.israel).toBeDefined();
    expect(def?.shapes.italy?.pathD.length).toBeGreaterThan(10);
  });

  it("מזהים לא קיימים מחזירים undefined", () => {
    expect(getRegionMapDefinition("no-such-map")).toBeUndefined();
  });

  it("רשימת מפות כוללת את ארבעת האזורים ל-MVP", () => {
    const ids = listRegionMapIds();
    expect(ids).toEqual(
      expect.arrayContaining(["mid-east-europe", "americas-south", "asia-pacific", "north-atlantic"]),
    );
  });
});
