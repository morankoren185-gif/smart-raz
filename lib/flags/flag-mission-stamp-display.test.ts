import { describe, expect, it } from "vitest";
import { FLAG_MISSIONS } from "@/content/flags/flag-missions";
import {
  getStampDisplayForMission,
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
});
