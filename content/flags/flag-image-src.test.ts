import { describe, expect, it } from "vitest";
import { flagImageSrcForChoiceKey } from "./flag-image-src";

describe("flagImageSrcForChoiceKey", () => {
  it("מחזיר נתיב SVG לפי קוד מדינה", () => {
    expect(flagImageSrcForChoiceKey("jp")).toContain("/jp.svg");
    expect(flagImageSrcForChoiceKey("il")).toContain("/il.svg");
  });

  it("בריטניה (uk) ממופה לקובץ gb ב־flag-icons", () => {
    expect(flagImageSrcForChoiceKey("uk")).toContain("/gb.svg");
    expect(flagImageSrcForChoiceKey("gb")).toContain("/gb.svg");
  });
});
