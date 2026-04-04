import { describe, expect, it } from "vitest";
import { illustrationDisplayMode } from "./illustrationDisplayMode";

describe("illustrationDisplayMode", () => {
  it("emoji — בלי imageSrc או מחרוזת ריקה", () => {
    expect(illustrationDisplayMode(undefined, false)).toBe("emoji");
    expect(illustrationDisplayMode(null, false)).toBe("emoji");
    expect(illustrationDisplayMode("   ", false)).toBe("emoji");
  });

  it("image — יש נתיב וטעינה לא נכשלה", () => {
    expect(illustrationDisplayMode("/illustrations/english-words/cat.svg", false)).toBe("image");
  });

  it("emoji — כשל טעינה אחרי onError", () => {
    expect(illustrationDisplayMode("/missing.svg", true)).toBe("emoji");
  });
});
