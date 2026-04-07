import { describe, expect, it } from "vitest";
import {
  estimatePathBoundingBoxArea,
  orderedShapeIdsForRegionMap,
} from "@/lib/flags/region-map-draw-order";
import { getRegionMapDefinition } from "@/content/flags/region-map-assets";

describe("map-country — סדר ציור וקירוב שטח", () => {
  it("ריבוע גדול מקבל שטח תיבה גדול יותר מצורה קטנה", () => {
    const big = "M 0 0 L 100 0 L 100 100 L 0 100 Z";
    const small = "M 40 40 L 50 40 L 50 50 L 40 50 Z";
    expect(estimatePathBoundingBoxArea(big)).toBeGreaterThan(estimatePathBoundingBoxArea(small));
  });

  it("מדינה מודגשת נצבעת אחרונה (מעל שכנות גדולים) — mid-east-europe", () => {
    const def = getRegionMapDefinition("mid-east-europe")!;
    const ids = Object.keys(def.shapes);
    const pathDBy = Object.fromEntries(ids.map((id) => [id, def.shapes[id]!.pathD]));
    const orderIsrael = orderedShapeIdsForRegionMap({
      shapeIds: ids,
      pathDByShapeId: pathDBy,
      highlightedShapeId: "israel",
    });
    expect(orderIsrael[orderIsrael.length - 1]).toBe("israel");

    const orderJordan = orderedShapeIdsForRegionMap({
      shapeIds: ids,
      pathDByShapeId: pathDBy,
      highlightedShapeId: "jordan",
    });
    expect(orderJordan[orderJordan.length - 1]).toBe("jordan");
  });
});
