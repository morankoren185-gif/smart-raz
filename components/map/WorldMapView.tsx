"use client";

import { MAP_WORLD_COUNTRIES } from "@/content/map-world";
import { useProgressContext } from "@/components/providers/ProgressAndTimeProvider";
import { CountryNode } from "./CountryNode";

export function WorldMapView() {
  const { progress } = useProgressContext();

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div
        className="relative aspect-[5/3] w-full overflow-hidden rounded-[2rem] border border-teal-400/30 bg-[radial-gradient(ellipse_at_30%_30%,_rgba(45,212,191,0.25)_0%,_transparent_55%),radial-gradient(ellipse_at_70%_60%,_rgba(59,130,246,0.2)_0%,_transparent_50%),linear-gradient(160deg,_#0f172a_0%,_#134e4a_40%,_#0c4a6e_100%)] shadow-xl"
        aria-label="מפת מסע עם תחנות מדינה"
      >
        {/* צורת יבשה פשוטה — דקורטיבי */}
        <div
          className="pointer-events-none absolute inset-[12%] rounded-[40%] border border-white/10 bg-teal-950/20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-[18%] left-[20%] right-[18%] top-[22%] rounded-[48%] bg-sky-900/15"
          aria-hidden
        />

        {MAP_WORLD_COUNTRIES.map((country) => (
          <CountryNode key={country.id} country={country} totalStars={progress.stars} />
        ))}
      </div>

      <p className="mt-4 text-center text-sm text-white/75">
        יש לך{" "}
        <span className="font-bold tabular-nums text-amber-200">
          ⭐️ {progress.stars}
        </span>{" "}
        — כל כוכב מקרב אותך לתחנה הבאה.
      </p>
    </div>
  );
}
