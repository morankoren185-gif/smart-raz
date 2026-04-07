/**
 * מקור אמת אוצר — space: כוכבי gentle/steady, התאמות סדר, ושאלות MC אוצרות (order + compare).
 * כולל spark מאורגן (כל שמונת הכוכבים, מסיחים צמודי־מסלול).
 * ללא ייבוא מ־`lexicon` — מניעת מעגל עם `PLANETS_BY_LEVEL`.
 */

export const SPACE_CATALOG_GENTLE_PLANET_ORDER = ["Earth", "Mars", "Jupiter", "Saturn"] as const;

export const SPACE_CATALOG_STEADY_PLANET_ORDER = [
  ...SPACE_CATALOG_GENTLE_PLANET_ORDER,
  "Venus",
  "Neptune",
] as const;

/** כוכב לכת כפי שמופיע בשאלות (תואם PlanetId ב־lexicon) */
export type SpaceCatalogPlanetId =
  | "Mercury"
  | "Venus"
  | "Earth"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune";

/** התאמת מיקום מהשמש — gentle / steady (מזהי זוג יציבים ל־SRS) */
export type SpaceOrderMatchingPairSpec = Readonly<{ pairId: string; planet: string }>;

export type SpaceOrderMatchingRound = Readonly<{
  id: string;
  instructions: string;
  explanation: string;
  pairs: readonly SpaceOrderMatchingPairSpec[];
}>;

export const SPACE_ORDER_MATCHING_GENTLE_ROUNDS: readonly SpaceOrderMatchingRound[] = [
  {
    id: "space-ord-match-g1",
    instructions: "Match each planet to its place from the Sun — 1 is closest.",
    explanation: "כדור הארץ, מאדים.",
    pairs: [
      { pairId: "so-g-e", planet: "Earth" },
      { pairId: "so-g-m", planet: "Mars" },
    ],
  },
  {
    id: "space-ord-match-g2",
    instructions: "Two more orbits — match place numbers.",
    explanation: "צדק ושבתאי.",
    pairs: [
      { pairId: "so-g-j", planet: "Jupiter" },
      { pairId: "so-g-s", planet: "Saturn" },
    ],
  },
];

export const SPACE_ORDER_MATCHING_STEADY_ROUNDS: readonly SpaceOrderMatchingRound[] = [
  {
    id: "space-ord-match-s1",
    instructions: "Same four friends from gentle — now all together on the map",
    explanation: "חיזור על כדור הארץ, מאדים, צדק ושבתאי לפני הוספת נוגה ונפטון.",
    pairs: [
      { pairId: "so-s-e", planet: "Earth" },
      { pairId: "so-s-m", planet: "Mars" },
      { pairId: "so-s-j", planet: "Jupiter" },
      { pairId: "so-s-s", planet: "Saturn" },
    ],
  },
  {
    id: "space-ord-match-s2",
    instructions: "Two new orbits — Venus and Neptune join the game",
    explanation: "נוגה (#2) ונפטון (#8) אחרי שהרגענו עם הארבעה המוכרים.",
    pairs: [
      { pairId: "so-s-v", planet: "Venus" },
      { pairId: "so-s-n", planet: "Neptune" },
      { pairId: "so-s-e2", planet: "Earth" },
      { pairId: "so-s-m2", planet: "Mars" },
    ],
  },
];

/** שאלות סדר (MC) אוצרות — gentle */
export type SpaceOrderMcCuratedSpec = Readonly<{
  id: string;
  instructions: string;
  explanation: string;
  correctPlanet: SpaceCatalogPlanetId;
  distractorPlanets: readonly SpaceCatalogPlanetId[];
  prompt: Readonly<
    { kind: "planet"; planet: SpaceCatalogPlanetId } | { kind: "sun"; altHe: string }
  >;
}>;

export const SPACE_ORDER_MC_CURATED_GENTLE: readonly SpaceOrderMcCuratedSpec[] = [
  {
    id: "space-ord-mc-gentle-curated-0",
    instructions: "Who comes right after Earth?\n(one step away from the Sun)",
    explanation: "אחרי Earth מגיע Mars (מיקום 4 מהשמש).",
    correctPlanet: "Mars",
    distractorPlanets: ["Jupiter", "Saturn"],
    prompt: { kind: "planet", planet: "Earth" },
  },
  {
    id: "space-ord-mc-gentle-curated-1",
    instructions: "Who comes right after Mars?",
    explanation: "אחרי Mars מגיע Jupiter (מיקום 5 מהשמש).",
    correctPlanet: "Jupiter",
    distractorPlanets: ["Earth", "Saturn"],
    prompt: { kind: "planet", planet: "Mars" },
  },
  {
    id: "space-ord-mc-gentle-curated-2",
    instructions: "Who comes right before Jupiter?",
    explanation: "לפני Jupiter נמצא Mars.",
    correctPlanet: "Mars",
    distractorPlanets: ["Earth", "Saturn"],
    prompt: { kind: "planet", planet: "Jupiter" },
  },
  {
    id: "space-ord-mc-gentle-curated-3",
    instructions: "Which planet is 3rd from the Sun?\n(Earth's place)",
    explanation: "המקום השלישי הוא Earth.",
    correctPlanet: "Earth",
    distractorPlanets: ["Mars", "Jupiter"],
    prompt: { kind: "sun", altHe: "השמש — סופרים מהקרוב אליה" },
  },
  {
    id: "space-ord-mc-gentle-curated-4",
    instructions: "Which planet is 5th from the Sun?\n(big orange one)",
    explanation: "המקום החמישי הוא Jupiter.",
    correctPlanet: "Jupiter",
    distractorPlanets: ["Saturn", "Mars"],
    prompt: { kind: "sun", altHe: "השמש" },
  },
];

/** שאלות סדר (MC) — steady bridge */
export const SPACE_ORDER_MC_CURATED_STEADY: readonly SpaceOrderMcCuratedSpec[] = [
  {
    id: "space-ord-mc-steady-bridge-0",
    instructions: "Who comes right after Earth?",
    explanation: "אחרי Earth מגיע Mars (4 מהשמש).",
    correctPlanet: "Mars",
    distractorPlanets: ["Jupiter", "Saturn", "Venus"],
    prompt: { kind: "planet", planet: "Earth" },
  },
  {
    id: "space-ord-mc-steady-bridge-1",
    instructions: "Who comes right after Mars?",
    explanation: "אחרי Mars מגיע Jupiter.",
    correctPlanet: "Jupiter",
    distractorPlanets: ["Earth", "Saturn", "Neptune"],
    prompt: { kind: "planet", planet: "Mars" },
  },
  {
    id: "space-ord-mc-steady-bridge-2",
    instructions: "Who comes right before Jupiter?",
    explanation: "לפני Jupiter נמצא Mars.",
    correctPlanet: "Mars",
    distractorPlanets: ["Earth", "Saturn", "Venus"],
    prompt: { kind: "planet", planet: "Jupiter" },
  },
  {
    id: "space-ord-mc-steady-bridge-3",
    instructions: "Which planet is 2nd from the Sun?\n(after Mercury)",
    explanation: "המקום השני הוא Venus.",
    correctPlanet: "Venus",
    distractorPlanets: ["Earth", "Mars", "Jupiter"],
    prompt: { kind: "sun", altHe: "השמש" },
  },
  {
    id: "space-ord-mc-steady-bridge-4",
    instructions: "Which planet is 8th from the Sun?\n(last in our tour)",
    explanation: "השמיני הוא Neptune.",
    correctPlanet: "Neptune",
    distractorPlanets: ["Jupiter", "Saturn", "Mars"],
    prompt: { kind: "sun", altHe: "השמש" },
  },
  {
    id: "space-ord-mc-steady-bridge-5",
    instructions: "Who comes right after Saturn?",
    explanation: "אחרי Saturn — עוד רגע ומגיעים לנפטון (לא טוענים את כל המסלול בבת אחת).",
    correctPlanet: "Neptune",
    distractorPlanets: ["Jupiter", "Mars", "Earth"],
    prompt: { kind: "planet", planet: "Saturn" },
  },
];

/** שאלות השוואה (MC) אוצרות — gentle */
export type SpaceCompareMcCuratedSpec = Readonly<{
  id: string;
  instructions: string;
  explanation: string;
  correctPlanet: SpaceCatalogPlanetId;
  distractorPlanets: readonly SpaceCatalogPlanetId[];
  promptAltHe: string;
}>;

export const SPACE_COMPARE_MC_CURATED_GENTLE: readonly SpaceCompareMcCuratedSpec[] = [
  {
    id: "space-cmp-gentle-curated-0",
    instructions: "Which planet is closer to the Sun: Earth or Jupiter?",
    explanation: "Earth קרובה יותר לשמש מ־Jupiter.",
    correctPlanet: "Earth",
    distractorPlanets: ["Jupiter", "Neptune"],
    promptAltHe: "השמש — הקרוב אליה חם יותר",
  },
  {
    id: "space-cmp-gentle-curated-1",
    instructions: "Which planet is closer to the Sun: Mars or Saturn?",
    explanation: "Mars קרובה יותר מ־Saturn.",
    correctPlanet: "Mars",
    distractorPlanets: ["Saturn", "Neptune"],
    promptAltHe: "השמש",
  },
  {
    id: "space-cmp-gentle-curated-2",
    instructions: "Which planet is farther from the Sun: Earth or Mars?",
    explanation: "Mars רחוקה יותר מ־Earth.",
    correctPlanet: "Mars",
    distractorPlanets: ["Earth", "Jupiter"],
    promptAltHe: "השמש — הרחוק יותר קריר יותר",
  },
  {
    id: "space-cmp-gentle-facts-0",
    instructions: "Which planet is the biggest in our solar system?\n(very round, many moons)",
    explanation: "Jupiter הכי גדול — ענק גז עם סופות ענק.",
    correctPlanet: "Jupiter",
    distractorPlanets: ["Earth", "Saturn"],
    promptAltHe: "השמש — השוואה בין ענקים",
  },
  {
    id: "space-cmp-gentle-facts-1",
    instructions: "Which planet is famous for icy rings you can see in pictures?",
    explanation: "ל־Saturn יש טבעות בוהקות.",
    correctPlanet: "Saturn",
    distractorPlanets: ["Jupiter", "Neptune"],
    promptAltHe: "מערכת השמש — מה מיוחד בכל אחד",
  },
  {
    id: "space-cmp-gentle-facts-2",
    instructions: "Which planet is the hottest in our whole solar system?\n(clouds trap the heat)",
    explanation: "Venus הכי חמה בזכות עננים עבים שכלואים חום.",
    correctPlanet: "Venus",
    distractorPlanets: ["Mercury", "Mars"],
    promptAltHe: "טמפרטורה — לא תמיד הכי קרוב לשמש",
  },
  {
    id: "space-cmp-gentle-facts-3",
    instructions: "Which rocky planet is closest to the Sun?\n(small and speedy)",
    explanation: "Mercury הכי קרוב לשמש.",
    correctPlanet: "Mercury",
    distractorPlanets: ["Venus", "Earth"],
    promptAltHe: "השמש — צדה הפנימי של המסלול",
  },
];

/** שאלות השוואה (MC) — steady bridge */
export const SPACE_COMPARE_MC_CURATED_STEADY: readonly SpaceCompareMcCuratedSpec[] = [
  {
    id: "space-cmp-steady-bridge-0",
    instructions: "Which planet is closer to the Sun: Earth or Jupiter?",
    explanation: "Earth קרובה יותר מ־Jupiter.",
    correctPlanet: "Earth",
    distractorPlanets: ["Jupiter", "Saturn", "Neptune"],
    promptAltHe: "השמש",
  },
  {
    id: "space-cmp-steady-bridge-1",
    instructions: "Which planet is closer to the Sun: Mars or Saturn?",
    explanation: "Mars קרובה יותר מ־Saturn.",
    correctPlanet: "Mars",
    distractorPlanets: ["Saturn", "Neptune", "Jupiter"],
    promptAltHe: "השמש",
  },
  {
    id: "space-cmp-steady-bridge-2",
    instructions: "Which planet is closer to the Sun: Venus or Jupiter?",
    explanation: "Venus פנימית ל־Jupiter.",
    correctPlanet: "Venus",
    distractorPlanets: ["Jupiter", "Saturn", "Neptune"],
    promptAltHe: "השמש",
  },
  {
    id: "space-cmp-steady-bridge-3",
    instructions: "Which planet is farther from the Sun: Earth or Mars?",
    explanation: "Mars רחוקה יותר מ־Earth.",
    correctPlanet: "Mars",
    distractorPlanets: ["Earth", "Jupiter", "Venus"],
    promptAltHe: "השמש",
  },
  {
    id: "space-cmp-steady-bridge-4",
    instructions: "Which planet is closer to the Sun: Jupiter or Neptune?",
    explanation: "Jupiter פנימית ל־Neptune.",
    correctPlanet: "Jupiter",
    distractorPlanets: ["Neptune", "Saturn", "Mars"],
    promptAltHe: "השמש",
  },
  {
    id: "space-cmp-steady-bridge-5",
    instructions: "Which planet is farther from the Sun: Venus or Earth?",
    explanation: "Earth רחוקה יותר מ־Venus (שניהם פנימיים, אבל Earth חיצונית יותר).",
    correctPlanet: "Earth",
    distractorPlanets: ["Venus", "Mars", "Jupiter"],
    promptAltHe: "השמש",
  },
  {
    id: "space-cmp-steady-facts-0",
    instructions: "Which planet is mostly made of gas like Jupiter, but a bit smaller with rings?",
    explanation: "Saturn — ענק גז עם טבעות.",
    correctPlanet: "Saturn",
    distractorPlanets: ["Earth", "Mars", "Jupiter"],
    promptAltHe: "חומר — גז מול סלע",
  },
  {
    id: "space-cmp-steady-facts-1",
    instructions: "Which planet is farthest from the Sun on our eight-planet tour?",
    explanation: "Neptune הוא השמיני — הכי רחוק.",
    correctPlanet: "Neptune",
    distractorPlanets: ["Uranus", "Saturn", "Jupiter"],
    promptAltHe: "השמש — קצה המסלול",
  },
  {
    id: "space-cmp-steady-facts-2",
    instructions: "Which planet is known as the Red Planet?\n(dusty and a bit like home long ago)",
    explanation: "Mars נקרא כוכב אדום.",
    correctPlanet: "Mars",
    distractorPlanets: ["Venus", "Jupiter", "Earth"],
    promptAltHe: "כוכבי לכת — כינויים ידידותיים",
  },
  {
    id: "space-cmp-steady-facts-3",
    instructions: "Which planet spins almost on its side like a rolling ball?\n(pale blue ice giant)",
    explanation: "Uranus מוטה על צדו.",
    correctPlanet: "Uranus",
    distractorPlanets: ["Neptune", "Saturn", "Mars"],
    promptAltHe: "מערכת השמש — סיבוב מוזר",
  },
  {
    id: "space-cmp-steady-facts-4",
    instructions: "Which world is most like our home: rocky ground, oceans of water, one Moon we know well?",
    explanation: "Earth הוא כוכב הבית שלנו — סלעי עם מים.",
    correctPlanet: "Earth",
    distractorPlanets: ["Jupiter", "Saturn", "Neptune"],
    promptAltHe: "מה דומה לכדור הארץ",
  },
];

/** סדר MC — spark: כל שמונה הכוכבים, מסיחים מהשכנים במסלול */
export const SPACE_ORDER_MC_CURATED_SPARK: readonly SpaceOrderMcCuratedSpec[] = [
  {
    id: "space-ord-mc-spark-curated-0",
    instructions:
      "Who comes right after Venus?\n(count outward from the Sun, one step at a time)",
    explanation: "אחרי Venus (מיקום 2) מגיע Earth (מיקום 3).",
    correctPlanet: "Earth",
    distractorPlanets: ["Mercury", "Mars"],
    prompt: { kind: "planet", planet: "Venus" },
  },
  {
    id: "space-ord-mc-spark-curated-1",
    instructions: "Who comes right before Earth?\n(the planet just closer to the Sun)",
    explanation: "לפני Earth נמצא Venus.",
    correctPlanet: "Venus",
    distractorPlanets: ["Mercury", "Mars"],
    prompt: { kind: "planet", planet: "Earth" },
  },
  {
    id: "space-ord-mc-spark-curated-2",
    instructions: "Who comes right after Saturn?\n(past the big rings)",
    explanation: "אחרי Saturn מגיע Uranus.",
    correctPlanet: "Uranus",
    distractorPlanets: ["Jupiter", "Neptune"],
    prompt: { kind: "planet", planet: "Saturn" },
  },
  {
    id: "space-ord-mc-spark-curated-3",
    instructions:
      "Which planet is 6th from the Sun?\n(between the largest planet and the tilted blue one)",
    explanation: "המקום השישי הוא Saturn.",
    correctPlanet: "Saturn",
    distractorPlanets: ["Jupiter", "Uranus"],
    prompt: { kind: "sun", altHe: "השמש — סופרים מהקרוב אליה" },
  },
  {
    id: "space-ord-mc-spark-curated-4",
    instructions: "Which planet is 7th from the Sun?\n(ice giant, tilted axis)",
    explanation: "השביעי הוא Uranus.",
    correctPlanet: "Uranus",
    distractorPlanets: ["Saturn", "Neptune"],
    prompt: { kind: "sun", altHe: "השמש" },
  },
  {
    id: "space-ord-mc-spark-curated-5",
    instructions: "Which planet is closest to the Sun?\n(small and very hot)",
    explanation: "הראשון מהשמש הוא Mercury.",
    correctPlanet: "Mercury",
    distractorPlanets: ["Venus", "Earth"],
    prompt: { kind: "sun", altHe: "השמש — מהכי קרוב ביותר" },
  },
];

/** השוואה MC — spark: זוגות צפופים במסלול + מסיחים מהשכנים */
export const SPACE_COMPARE_MC_CURATED_SPARK: readonly SpaceCompareMcCuratedSpec[] = [
  {
    id: "space-cmp-spark-curated-0",
    instructions: "Which planet is closer to the Sun: Mercury or Venus?",
    explanation: "Mercury פנימית ל־Venus.",
    correctPlanet: "Mercury",
    distractorPlanets: ["Mars", "Earth"],
    promptAltHe: "השמש — שני כוכבים פנימיים קרובים",
  },
  {
    id: "space-cmp-spark-curated-1",
    instructions: "Which planet is closer to the Sun: Uranus or Neptune?",
    explanation: "Uranus פנימית ל־Neptune.",
    correctPlanet: "Uranus",
    distractorPlanets: ["Saturn", "Jupiter"],
    promptAltHe: "השמש — ענקי קרח רחוקים",
  },
  {
    id: "space-cmp-spark-curated-2",
    instructions: "Which planet is closer to the Sun: Earth or Mars?",
    explanation: "Earth פנימית ל־Mars.",
    correctPlanet: "Earth",
    distractorPlanets: ["Venus", "Jupiter"],
    promptAltHe: "השמש",
  },
  {
    id: "space-cmp-spark-curated-3",
    instructions: "Which planet is farther from the Sun: Jupiter or Saturn?",
    explanation: "Saturn רחוקה יותר מ־Jupiter.",
    correctPlanet: "Saturn",
    distractorPlanets: ["Jupiter", "Mars"],
    promptAltHe: "השמש — שני ענקי גז",
  },
  {
    id: "space-cmp-spark-curated-4",
    instructions: "Which planet is farther from the Sun: Venus or Earth?",
    explanation: "Earth רחוקה יותר מ־Venus.",
    correctPlanet: "Earth",
    distractorPlanets: ["Venus", "Mercury"],
    promptAltHe: "השמש — כוכבי לכת פנימיים",
  },
  {
    id: "space-cmp-spark-curated-5",
    instructions: "Which planet is closer to the Sun: Mars or Jupiter?",
    explanation: "Mars פנימית ל־Jupiter.",
    correctPlanet: "Mars",
    distractorPlanets: ["Jupiter", "Earth"],
    promptAltHe: "השמש",
  },
  {
    id: "space-cmp-spark-facts-0",
    instructions: "Where is the Great Red Spot?\n(a giant storm you can see for hundreds of years)",
    explanation: "הסופה הגדולה נמצאת ב־Jupiter.",
    correctPlanet: "Jupiter",
    distractorPlanets: ["Saturn", "Neptune"],
    promptAltHe: "ענקי גז — סערות",
  },
  {
    id: "space-cmp-spark-facts-1",
    instructions:
      "Scientists now group Pluto as a dwarf planet.\nWhich of these is still one of the eight big planets?",
    explanation: "Neptune הוא השמיני ברשימת שמונת כוכבי הלכת הגדולים.",
    correctPlanet: "Neptune",
    distractorPlanets: ["Uranus", "Saturn"],
    promptAltHe: "שמונה כוכבי לכת מלאים",
  },
  {
    id: "space-cmp-spark-facts-2",
    instructions: "Which planet is both small and zips around the Sun the fastest?\n(think: first place in line)",
    explanation: "Mercury קטן ומהיר במסלול.",
    correctPlanet: "Mercury",
    distractorPlanets: ["Mars", "Venus"],
    promptAltHe: "מסלול ומהירות",
  },
  {
    id: "space-cmp-spark-facts-3",
    instructions: "Which icy giant is a pretty blue color and comes just before the last planet?",
    explanation: "Uranus לפני Neptune — שניהם ענקי קרח.",
    correctPlanet: "Uranus",
    distractorPlanets: ["Saturn", "Jupiter"],
    promptAltHe: "צבע ומרחק",
  },
  {
    id: "space-cmp-spark-facts-4",
    instructions: "Which inner planet has thick air and shines very bright in the evening sky?\n(sometimes called Earth's twin in size, not in weather)",
    explanation: "Venus בוהק ועבה באטמוספירה.",
    correctPlanet: "Venus",
    distractorPlanets: ["Mercury", "Mars"],
    promptAltHe: "שמיים בערב — מה נוצץ",
  },
];
