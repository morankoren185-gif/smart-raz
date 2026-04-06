import { describe, expect, it } from "vitest";
import { FLAG_MISSIONS } from "@/content/flags/flag-missions";
import { FLAG_REGION_MISSIONS_LIST } from "@/content/flags/flag-region-missions";
import {
  getRegionMissionCelebrationSubtitle,
  getStampDisplayForMission,
  isFlagRegionMission,
  shouldShowMissionStamp,
} from "@/lib/flags/flag-mission-stamp-display";

const sampleMission = FLAG_MISSIONS[0]!;

describe("flag-mission-stamp-display", () => {
  it("maps known stampId to label and emoji", () => {
    const d = getStampDisplayForMission(sampleMission);
    expect(d.emoji.length).toBeGreaterThan(0);
    expect(d.labelHe.length).toBeGreaterThan(0);
    expect(d.ringClass).toContain("border-");
  });

  it("fallback for unknown stampId uses stamp as emoji", () => {
    const d = getStampDisplayForMission({
      ...sampleMission,
      stampId: "custom-unknown",
    });
    expect(d.emoji).toBe("custom-unknown");
    expect(d.labelHe).toBe("חותמת משימה");
  });

  it("shouldShowMissionStamp is true only when mission is complete", () => {
    expect(shouldShowMissionStamp(sampleMission, false)).toBe(false);
    expect(shouldShowMissionStamp(sampleMission, true)).toBe(true);
  });

  it("לכל מסע אזורי יש תצוגת חותמת ייעודית (לא fallback גנרי)", () => {
    for (const m of FLAG_REGION_MISSIONS_LIST) {
      expect(isFlagRegionMission(m)).toBe(true);
      const d = getStampDisplayForMission(m);
      expect(d.labelHe).not.toBe("חותמת משימה");
      expect(d.labelHe).toMatch(/חותמת/);
      expect(d.ringClass).toContain("border-");
    }
  });

  it("שורת חגיגה לאזור מכילה את שם היבשת", () => {
    const m = FLAG_REGION_MISSIONS_LIST.find((x) => x.regionId === "europe")!;
    const line = getRegionMissionCelebrationSubtitle(m);
    expect(line).toContain("אירופה");
    expect(line).toContain("חותמת אירופה");
  });

  it("חותמת מזרח תיכון (מסגד) ממופה ב־KNOWN", () => {
    const m = FLAG_REGION_MISSIONS_LIST.find((x) => x.id === "flags-region-middle-east")!;
    const d = getStampDisplayForMission(m);
    expect(d.emoji).toBe("🕌");
    expect(d.labelHe).toContain("מזרח התיכון");
  });
});
