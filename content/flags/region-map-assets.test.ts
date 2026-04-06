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

  it("רשימת מפות כוללת אזורי בסיס + הרחבות לדגלים", () => {
    const ids = listRegionMapIds();
    expect(ids).toEqual(
      expect.arrayContaining([
        "mid-east-europe",
        "americas-south",
        "americas-north",
        "europe-core",
        "africa-southern",
        "asia-pacific",
        "north-atlantic",
      ]),
    );
  });

  it("צורות להרחבת דרומי־אמריקה / צפון / אירופה / אסיה / אפריקה", () => {
    expect(getRegionMapDefinition("americas-south")?.shapes.argentina).toBeDefined();
    expect(getRegionMapDefinition("americas-north")?.shapes.mexico).toBeDefined();
    expect(getRegionMapDefinition("europe-core")?.shapes.germany).toBeDefined();
    expect(getRegionMapDefinition("asia-pacific")?.shapes.china).toBeDefined();
    expect(getRegionMapDefinition("africa-southern")?.shapes.south_africa).toBeDefined();
  });

  it("מפת ים תיכון כוללת והמזרח התיכון — טורקיה, ירדן, סעודיה, אמירויות", () => {
    const m = getRegionMapDefinition("mid-east-europe");
    expect(m?.shapes.turkey).toBeDefined();
    expect(m?.shapes.jordan).toBeDefined();
    expect(m?.shapes.saudi_arabia).toBeDefined();
    expect(m?.shapes.uae).toBeDefined();
  });
});
