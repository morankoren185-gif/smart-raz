import type { SpaceMission } from "@/content/space/space-missions";

export type SpaceMissionStampStyle = Readonly<{
  stampId: string;
  emoji: string;
  labelHe: string;
  ringClass: string;
}>;

const KNOWN: Readonly<Record<string, Omit<SpaceMissionStampStyle, "stampId">>> = {
  "🔭": {
    emoji: "🔭",
    labelHe: "חותמת הכוכבים המוכרים",
    ringClass: "border-violet-400/70 bg-violet-600/25",
  },
  "✨": {
    emoji: "✨",
    labelHe: "חותמת השם והכוכב",
    ringClass: "border-amber-400/70 bg-indigo-950/35",
  },
  "🧩": {
    emoji: "🧩",
    labelHe: "חותמת הזיווגים",
    ringClass: "border-sky-400/70 bg-sky-900/30",
  },
  "🚀": {
    emoji: "🚀",
    labelHe: "חותמת המסע בחלל",
    ringClass: "border-fuchsia-400/70 bg-fuchsia-950/30",
  },
  "☀️": {
    emoji: "☀️",
    labelHe: "חותמת הסדר מהשמש",
    ringClass: "border-amber-400/65 bg-amber-900/28",
  },
};

export function getStampDisplayForSpaceMission(mission: SpaceMission): SpaceMissionStampStyle {
  const stampId = mission.stampId.trim();
  const hit = KNOWN[stampId];
  if (hit) return { stampId, ...hit };
  return {
    stampId,
    emoji: stampId,
    labelHe: "חותמת משימה",
    ringClass: "border-white/40 bg-white/10",
  };
}
