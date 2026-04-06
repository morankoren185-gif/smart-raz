/**
 * נכסי מפת MVP — מסלולי SVG פשוטים (סטייליזציה, לא גיאוגרפיה מדויקת).
 * להחלפה עתידית: ניתן להחליף path או לטעון מקובץ ציבורי תוך שמירה על mapId / shapeId.
 */

export type RegionMapShapeSpec = Readonly<{
  /** path ל־SVG */
  pathD: string;
  /** שם לנגישות */
  ariaLabelHe: string;
}>;

export type RegionMapAsset = Readonly<{
  id: string;
  titleHe: string;
  viewBox: string;
  /** צבע ים/רקע */
  oceanFill: string;
  shapes: Readonly<Record<string, RegionMapShapeSpec>>;
}>;

const MAPS: Record<string, RegionMapAsset> = {
  "mid-east-europe": {
    id: "mid-east-europe",
    titleHe: "הים התיכון והמזרח התיכון",
    viewBox: "0 0 240 200",
    oceanFill: "#1e3a5f",
    shapes: {
      italy: {
        pathD:
          "M 88 32 L 102 38 L 108 88 L 96 155 L 82 148 L 85 78 Z",
        ariaLabelHe: "איטליה",
      },
      israel: {
        pathD: "M 118 76 L 128 78 L 126 104 L 114 102 Z",
        ariaLabelHe: "ישראל",
      },
      egypt: {
        pathD: "M 100 68 L 182 72 L 178 128 L 104 122 Z",
        ariaLabelHe: "מצרים",
      },
      turkey: {
        pathD: "M 44 36 L 108 40 L 102 72 L 40 66 Z",
        ariaLabelHe: "טורקיה",
      },
      jordan: {
        pathD: "M 114 82 L 130 84 L 126 100 L 112 98 Z",
        ariaLabelHe: "ירדן",
      },
      saudi_arabia: {
        pathD: "M 122 92 L 210 86 L 204 148 L 118 142 Z",
        ariaLabelHe: "סעודיה",
      },
      uae: {
        pathD: "M 148 104 L 168 102 L 166 118 L 146 120 Z",
        ariaLabelHe: "איחוד האמירויות",
      },
    },
  },
  "americas-south": {
    id: "americas-south",
    titleHe: "דרום אמריקה",
    viewBox: "0 0 240 200",
    oceanFill: "#164e63",
    shapes: {
      brazil: {
        pathD: "M 52 72 L 142 68 L 136 168 L 58 162 Z",
        ariaLabelHe: "ברזיל",
      },
      chile: {
        pathD: "M 68 28 L 80 30 L 74 182 L 62 178 Z",
        ariaLabelHe: "צ׳ילה",
      },
      argentina: {
        pathD: "M 44 108 L 78 104 L 74 188 L 40 184 Z",
        ariaLabelHe: "ארגנטינה",
      },
    },
  },
  "americas-north": {
    id: "americas-north",
    titleHe: "צפון אמריקה",
    viewBox: "0 0 240 200",
    oceanFill: "#155e75",
    shapes: {
      mexico: {
        pathD: "M 48 52 L 112 48 L 108 112 L 52 118 Z",
        ariaLabelHe: "מקסיקו",
      },
    },
  },
  "europe-core": {
    id: "europe-core",
    titleHe: "אירופה — ליבה",
    viewBox: "0 0 240 200",
    oceanFill: "#1e40af",
    shapes: {
      germany: {
        pathD: "M 108 58 L 142 56 L 138 98 L 104 100 Z",
        ariaLabelHe: "גרמניה",
      },
      spain: {
        pathD: "M 52 72 L 96 68 L 92 128 L 48 124 Z",
        ariaLabelHe: "ספרד",
      },
      greece: {
        pathD: "M 128 88 L 178 86 L 174 118 L 124 122 Z",
        ariaLabelHe: "יוון",
      },
    },
  },
  "asia-pacific": {
    id: "asia-pacific",
    titleHe: "אסיה ואוקיאניה",
    viewBox: "0 0 240 200",
    oceanFill: "#0f766e",
    shapes: {
      japan: {
        pathD:
          "M 188 52 L 208 56 L 202 88 L 184 84 Z M 196 92 L 214 96 L 208 118 L 192 112 Z",
        ariaLabelHe: "יפן",
      },
      australia: {
        pathD: "M 152 108 L 228 104 L 232 162 L 148 166 Z",
        ariaLabelHe: "אוסטרליה",
      },
      china: {
        pathD: "M 118 28 L 186 32 L 182 88 L 114 84 Z",
        ariaLabelHe: "סין",
      },
      india: {
        pathD: "M 128 52 L 168 50 L 164 112 L 124 110 Z",
        ariaLabelHe: "הודו",
      },
    },
  },
  "africa-southern": {
    id: "africa-southern",
    titleHe: "דרום אפריקה",
    viewBox: "0 0 240 200",
    oceanFill: "#0d9488",
    shapes: {
      south_africa: {
        pathD: "M 96 48 L 168 46 L 164 156 L 92 158 Z",
        ariaLabelHe: "דרום אפריקה",
      },
    },
  },
  "north-atlantic": {
    id: "north-atlantic",
    titleHe: "צפון האוקיינוס האטלנטי",
    viewBox: "0 0 240 200",
    oceanFill: "#1d4ed8",
    shapes: {
      uk: {
        pathD: "M 94 48 L 118 44 L 122 72 L 108 88 L 90 78 Z",
        ariaLabelHe: "בריטניה",
      },
      ireland: {
        pathD: "M 78 62 L 92 58 L 90 76 L 76 72 Z",
        ariaLabelHe: "אירלנד",
      },
    },
  },
};

export function getRegionMapDefinition(mapId: string): RegionMapAsset | undefined {
  return MAPS[mapId];
}

export function listRegionMapIds(): string[] {
  return Object.keys(MAPS);
}
