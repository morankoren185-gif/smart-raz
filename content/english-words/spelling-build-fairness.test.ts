import { describe, expect, it } from "vitest";
import { buildWordOrderBank } from "./question-factories";

describe("בניית מילה — בלי חשיפת המילה המלאה בהנחיה", () => {
  it("ההנחיה לא מכילה את המילה המלאה (רק רמז ויזואלי + משפט כללי)", () => {
    const bank = buildWordOrderBank();
    for (const level of ["gentle", "steady", "spark"] as const) {
      const pool = bank[level];
      for (const q of pool) {
        const wordMatch = q.explanation.match(/"([^"]+)"/);
        const fullWord = wordMatch?.[1]?.toLowerCase();
        expect(fullWord).toBeTruthy();
        expect(q.instructions.toLowerCase()).not.toContain(fullWord!);
        expect(q.instructions).not.toMatch(/\([a-z]+\)/i);
      }
    }
  });

  it("לכל שאלת build יש promptVisual לרמז בלי טקסט המילה", () => {
    const q = buildWordOrderBank().steady.find((x) => x.id === "ew-build-steady-3")!;
    expect(q.promptVisual?.emoji).toBeTruthy();
    expect(q.instructions.toLowerCase()).not.toContain("apple");
  });
});
