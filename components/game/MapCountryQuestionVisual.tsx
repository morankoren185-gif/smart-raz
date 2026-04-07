"use client";

import { getRegionMapDefinition } from "@/content/flags/region-map-assets";
import type { MapCountryPresentation } from "@/lib/game-types/multiple-choice";
import { orderedShapeIdsForRegionMap } from "@/lib/flags/region-map-draw-order";

export type MapCountryQuestionVisualProps = {
  mapCountry: MapCountryPresentation;
  /** טקסט קצר מעל המפה (למשל הנחיית המשחק) */
  caption?: string;
};

/**
 * מפת אזור סטטית — מדינה אחת מודגשת; אין אינטראקציה על ה-SVG ב-MVP.
 */
export function MapCountryQuestionVisual({ mapCountry, caption }: MapCountryQuestionVisualProps) {
  const def = getRegionMapDefinition(mapCountry.mapId);
  if (!def) {
    return (
      <p className="text-center text-sm text-amber-200" role="status">
        מפה לא זמינה זמנית — נסו שוב מאוחר יותר.
      </p>
    );
  }

  const ids = Object.keys(def.shapes);
  const pathDByShapeId = Object.fromEntries(ids.map((id) => [id, def.shapes[id]!.pathD]));
  const drawOrder = orderedShapeIdsForRegionMap({
    shapeIds: ids,
    pathDByShapeId,
    highlightedShapeId: mapCountry.highlightedShapeId,
  });

  return (
    <div className="flex w-full flex-col items-center gap-3" dir="rtl">
      {caption ? (
        <p className="text-lg font-bold leading-snug text-white">{caption}</p>
      ) : null}
      <p className="text-xs font-medium text-teal-100/80">{def.titleHe}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={def.viewBox}
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full max-w-md rounded-2xl border-2 border-teal-400/40 bg-slate-900/50 shadow-inner"
        role="img"
        aria-label={`מפה: ${def.titleHe}. מדינה מסומנת.`}
      >
        <rect width="100%" height="100%" fill={def.oceanFill} />
        {drawOrder.map((shapeId) => {
          const shape = def.shapes[shapeId]!;
          const isHi = shapeId === mapCountry.highlightedShapeId;
          return (
            <path
              key={shapeId}
              d={shape.pathD}
              fill={isHi ? "#fbbf24" : "#475569"}
              stroke={isHi ? "#fff7ed" : "#64748b"}
              strokeWidth={isHi ? 2.2 : 1}
              opacity={isHi ? 1 : 0.45}
              aria-label={shape.ariaLabelHe}
            />
          );
        })}
      </svg>
    </div>
  );
}
