/**
 * סידור צורות במפת אזור לציור SVG — מדינות גדולות לפני קטנות, והמדינה המודגשת אחרונה (מעל כולן).
 * ללא זה, polys שמכסים אותה גיאוגרפית מציירים אחרי ומסתירים צורות קטנות — ונראה "ריבוע אחד גדול".
 */

/** שטח תיבת הוגן לפי כל קואורדינטות מספריות ב־path d (קירוב מספיק ל־MVP) */
export function estimatePathBoundingBoxArea(pathD: string): number {
  const nums = pathD.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  if (nums.length < 2) return 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = nums[i]!;
    const y = nums[i + 1]!;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  const w = Math.max(0, maxX - minX);
  const h = Math.max(0, maxY - minY);
  return w * h;
}

/**
 * סדר ציור: קודם כל הצורות שאינן מודגשות — לפי שטח יורד (רקע → חזית),
 * ובסוף הצורה המודגשת כדי שתישאר גלויה.
 */
export function orderedShapeIdsForRegionMap(args: {
  shapeIds: readonly string[];
  pathDByShapeId: Readonly<Record<string, string>>;
  highlightedShapeId: string;
}): string[] {
  const { shapeIds, pathDByShapeId, highlightedShapeId } = args;
  const rest = shapeIds.filter((id) => id !== highlightedShapeId);
  const restSorted = [...rest].sort(
    (a, b) =>
      estimatePathBoundingBoxArea(pathDByShapeId[b] ?? "") -
      estimatePathBoundingBoxArea(pathDByShapeId[a] ?? ""),
  );
  if (!shapeIds.includes(highlightedShapeId)) return [...shapeIds];
  return [...restSorted, highlightedShapeId];
}
