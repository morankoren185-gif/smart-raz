"use client";

import type { MapCountryNodeSpec } from "@/content/map-world";
import { isCountryUnlockedByStars, starsMissingToUnlock } from "@/lib/progress/map-progress";
import Link from "next/link";

export type CountryNodeProps = {
  country: MapCountryNodeSpec;
  totalStars: number;
};

export function CountryNode({ country, totalStars }: CountryNodeProps) {
  const unlocked = isCountryUnlockedByStars(country, totalStars);
  const missing = starsMissingToUnlock(country, totalStars);
  const hint =
    missing > 0
      ? `צריך עוד ${missing} כוכבים כדי לפתוח את ${country.labelHe}`
      : undefined;

  const commonClasses = [
    "absolute z-20 flex min-h-[4.5rem] min-w-[4.5rem] flex-col items-center justify-center rounded-2xl border-2 px-2 py-2 text-center shadow-lg transition",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200",
  ].join(" ");

  if (unlocked) {
    return (
      <Link
        href={`/world/${country.worldId}`}
        className={[
          commonClasses,
          "border-emerald-400/70 bg-emerald-600/35 text-white hover:bg-emerald-500/45 hover:scale-[1.02]",
        ].join(" ")}
        style={{
          left: `${country.position.x * 100}%`,
          top: `${country.position.y * 100}%`,
          transform: "translate(-50%, -50%)",
        }}
        aria-label={`${country.labelHe} — פתוח. מעבר למשחקים`}
      >
        <span className="text-3xl leading-none" aria-hidden>
          {country.emoji}
        </span>
        <span className="mt-1 max-w-[5.5rem] text-xs font-bold leading-tight">{country.labelHe}</span>
      </Link>
    );
  }

  return (
    <div
      className={[
        commonClasses,
        "cursor-default border-slate-600/80 bg-slate-900/75 text-slate-300 opacity-85",
      ].join(" ")}
      style={{
        left: `${country.position.x * 100}%`,
        top: `${country.position.y * 100}%`,
        transform: "translate(-50%, -50%)",
      }}
      role="group"
      aria-label={`${country.labelHe} נעול`}
    >
      <span className="text-3xl leading-none grayscale" aria-hidden>
        {country.emoji}
      </span>
      <span className="mt-1 max-w-[6rem] text-[0.65rem] font-semibold leading-snug text-amber-100/95">
        {hint}
      </span>
    </div>
  );
}
