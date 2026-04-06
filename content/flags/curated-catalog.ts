/**
 * מקור אמת אוצר — flags: gentle, steady, spark (מפתחי בחירה, תוויות, אימוג׳י דגל, מפות).
 * משחקי MC / מפה / matching נשענים על אותו סט כדי למנוע דריפט.
 */

export type FlagChoiceKey =
  | "jp"
  | "il"
  | "br"
  | "ca"
  | "fr"
  | "au"
  | "it"
  | "eg"
  | "cl"
  | "gb"
  | "us"
  | "uk"
  | "ie"
  | "de"
  | "es"
  | "gr"
  | "mx"
  | "ar"
  | "za"
  | "cn"
  | "in"
  | "sa"
  | "jo"
  | "tr"
  | "ae";

/** חמש המדינות המאוחדות ל־gentle בכל משחקי הדגלים */
export const FLAGS_GENTLE_CHOICE_KEYS_ORDER = ["jp", "il", "br", "ca", "fr"] as const;

export type FlagGentleKey = (typeof FLAGS_GENTLE_CHOICE_KEYS_ORDER)[number];

/** מפתח ראשון שנוסף ב־steady (אחרי חמש הליבה) */
export const FLAGS_STEADY_FIRST_NEW_KEY = "au" as const;

/** מפתחות מותרים לשאלות MC/map ב־gentle */
export const FLAGS_GENTLE_ALLOWED_KEY_SET = new Set<string>(FLAGS_GENTLE_CHOICE_KEYS_ORDER);

/** מפתחות שלא אמורים להופיע ב־gentle */
export const FLAGS_DISALLOWED_IN_GENTLE = new Set<string>([
  "au",
  "gb",
  "us",
  "it",
  "eg",
  "cl",
  "uk",
  "ie",
  "de",
  "es",
  "gr",
  "mx",
  "ar",
  "za",
  "cn",
  "in",
  "sa",
  "jo",
  "tr",
  "ae",
]);

export const FLAG_LABEL_HE: Readonly<Record<FlagGentleKey | typeof FLAGS_STEADY_FIRST_NEW_KEY, string>> = {
  jp: "יפן",
  il: "ישראל",
  br: "ברזיל",
  ca: "קנדה",
  fr: "צרפת",
  au: "אוסטרליה",
};

export const FLAG_FLAG_EMOJI: Readonly<Record<FlagGentleKey | typeof FLAGS_STEADY_FIRST_NEW_KEY, string>> = {
  jp: "🇯🇵",
  il: "🇮🇱",
  br: "🇧🇷",
  ca: "🇨🇦",
  fr: "🇫🇷",
  au: "🇦🇺",
};

/** אימוג׳י דגל לכל מפתח — כולל הרחבות ל־spark (matching + MC) */
export const FLAG_CHOICE_EMOJI: Readonly<Record<FlagChoiceKey, string>> = {
  jp: "🇯🇵",
  il: "🇮🇱",
  br: "🇧🇷",
  ca: "🇨🇦",
  fr: "🇫🇷",
  au: "🇦🇺",
  it: "🇮🇹",
  eg: "🇪🇬",
  cl: "🇨🇱",
  gb: "🇬🇧",
  us: "🇺🇸",
  uk: "🇬🇧",
  ie: "🇮🇪",
  de: "🇩🇪",
  es: "🇪🇸",
  gr: "🇬🇷",
  mx: "🇲🇽",
  ar: "🇦🇷",
  za: "🇿🇦",
  cn: "🇨🇳",
  in: "🇮🇳",
  sa: "🇸🇦",
  jo: "🇯🇴",
  tr: "🇹🇷",
  ae: "🇦🇪",
};

/** יעדי מפה ב־gentle — רק יפן / ישראל / ברזיל (שאר המפתחות מופיעים כמסיחי טקסט בלבד) */
export const FLAGS_GENTLE_MAP_SHAPE_BY_KEY: Readonly<
  Record<"jp" | "il" | "br", { mapId: string; highlightedShapeId: string }>
> = {
  jp: { mapId: "asia-pacific", highlightedShapeId: "japan" },
  il: { mapId: "mid-east-europe", highlightedShapeId: "israel" },
  br: { mapId: "americas-south", highlightedShapeId: "brazil" },
};

type McTemplate = {
  correct: FlagGentleKey;
  distractors: [FlagGentleKey, FlagGentleKey];
  instructions: string;
  explanation: string;
};

export const FLAGS_MC_GENTLE_TEMPLATES: readonly McTemplate[] = [
  {
    correct: "jp",
    distractors: ["il", "br"],
    instructions: "נתחיל ברוגע — לאיזו מדינה הדגל?",
    explanation: "דגל יפן — עיגול אדום על רקע לבן.",
  },
  {
    correct: "il",
    distractors: ["jp", "ca"],
    instructions: "ממשיכים בקלות — לאיזו מדינה הדגל?",
    explanation: "דגל ישראל — מגן דוד כחול.",
  },
  {
    correct: "br",
    distractors: ["il", "fr"],
    instructions: "מזהים את זה?",
    explanation: "דגל ברזיל — ירוק עם מעגל כחול ומטען צבעוני.",
  },
  {
    correct: "ca",
    distractors: ["jp", "br"],
    instructions: "עוד דגל ברור — לאיזו מדינה?",
    explanation: "עלה אדום על רקע לבן — קנדה.",
  },
  {
    correct: "fr",
    distractors: ["il", "ca"],
    instructions: "ועוד אחד — לאיזו מדינה הדגל?",
    explanation: "זיהוי דגל צרפת — שלושה צבעים אנכיים.",
  },
];

/** ברירות רק מהחמש + אוסטרליה, או שלוש מדינות אירופה ברורות ב־steady */
type SteadyMcDistractorKey = FlagGentleKey | typeof FLAGS_STEADY_FIRST_NEW_KEY;
type McSteadyTemplate = {
  correct: SteadyMcDistractorKey | "de" | "es" | "gr" | "eg" | "sa" | "jo" | "tr" | "ae";
  distractors: [SteadyMcDistractorKey, SteadyMcDistractorKey, SteadyMcDistractorKey];
  instructions: string;
  explanation: string;
};

type McSparkTemplate = {
  correct: FlagChoiceKey;
  distractors: [FlagChoiceKey, FlagChoiceKey, FlagChoiceKey];
  instructions: string;
  explanation: string;
};

/** MC spark — מדינות נוספות מעל steady; מסיחים ללא זוגות "דגל כמעט זהה" באותה שאלה */
export const FLAGS_MC_SPARK_TEMPLATES: readonly McSparkTemplate[] = [
  {
    correct: "gb",
    distractors: ["fr", "il", "jp"],
    instructions: "Spark — איזו מדינה לפי הדגל?",
    explanation: "בריטניה — Union Jack; המסיחים ממדינות עם דגלים שונים לגמרי.",
  },
  {
    correct: "us",
    distractors: ["br", "ca", "eg"],
    instructions: "בוחרים לפי הפסים והכוכבים",
    explanation: "ארצות הברית — אין כאן מדינה עם דגל דומה באותה שאלה.",
  },
  {
    correct: "jp",
    distractors: ["il", "ca", "cl"],
    instructions: "מזהים את העיגול האדום?",
    explanation: "יפן — חוזרים על צורה ברורה מהמסלול המוכר.",
  },
  {
    correct: "il",
    distractors: ["eg", "it", "fr"],
    instructions: "עוד פעם המגן — איזו מדינה?",
    explanation: "ישראל — מול מצרים, איטליה וצרפת (צורות שונות לגמרי).",
  },
  {
    correct: "au",
    distractors: ["jp", "ca", "eg"],
    instructions: "כחול עם כוכבי דרום — איזו מדינה?",
    explanation: "אוסטרליה — שום דגל בריכת המסיחים לא דומה לה.",
  },
  {
    correct: "cl",
    distractors: ["br", "eg", "jp"],
    instructions: "כוכב אחד על רקע ברור — איזו מדינה בדרום אמריקה?",
    explanation: "צ׳ילה — מול ברזיל, מצרים ויפן; בלי GB+US באותה שאלה.",
  },
  {
    correct: "mx",
    distractors: ["ca", "br", "fr"],
    instructions: "Spark — שלושת הצבעים האנכיים — איזו מדינה מצפון אמריקה?",
    explanation: "מקסיקו — המסיחים ממדינות שהדגלים שלהן שונים לחלוטין.",
  },
  {
    correct: "ar",
    distractors: ["br", "cl", "eg"],
    instructions: "שמש ופסים כחולים — איזו מדינה בדרום אמריקה?",
    explanation: "ארגנטינה — מול ברזיל, צ׳ילה ומצרים.",
  },
  {
    correct: "cn",
    distractors: ["jp", "au", "eg"],
    instructions: "רקע אדום וכוכבים עליו — איזו מדינה גדולה באסיה?",
    explanation: "סין — המסיחים כוללים יפן, אוסטרליה ומצרים.",
  },
  {
    correct: "in",
    distractors: ["jp", "br", "eg"],
    instructions: "שלושת הצבעים וסמל כחול — איזו מדינה?",
    explanation: "הודו — לעומת יפן, ברזיל ומצרים.",
  },
  {
    correct: "za",
    distractors: ["eg", "au", "it"],
    instructions: "הרבה צבעים וצורת Y — איזו מדינה בדרום אפריקה?",
    explanation: "דרום אפריקה — מול מצרים, אוסטרליה ואיטליה.",
  },
  {
    correct: "gr",
    distractors: ["it", "il", "jp"],
    instructions: "פסי כחול ולבן — מדינה ליד הים התיכון",
    explanation: "יוון — לעומת איטליה, ישראל ויפן; דגלים ברורים זה מזה.",
  },
  {
    correct: "sa",
    distractors: ["il", "eg", "jp"],
    instructions: "שחור לבנדיר מעל לבן — איזו מדינה גדולה בערבות?",
    explanation: "סעודיה — לעומת ישראל, מצרים ויפן; בלי GB+US באותה שאלה.",
  },
  {
    correct: "jo",
    distractors: ["eg", "il", "fr"],
    instructions: "שלושה פסים אופקיים לאורך — מדינה שכנה לישראל",
    explanation: "ירדן — מול מצרים, ישראל וצרפת; דגלים ברורים.",
  },
  {
    correct: "tr",
    distractors: ["gr", "il", "eg"],
    instructions: "סהר וכוכב על רקע אדום — איזו מדינה?",
    explanation: "טורקיה — לעומת יוון, ישראל ומצרים.",
  },
  {
    correct: "ae",
    distractors: ["sa", "eg", "jp"],
    instructions: "אדום ירוק לבן אנכי עם פסים — איזו מדינה?",
    explanation: "איחוד האמירויות — מול סעודיה, מצרים ויפן.",
  },
];

export const FLAGS_MC_STEADY_TEMPLATES: readonly McSteadyTemplate[] = [
  {
    correct: "jp",
    distractors: ["il", "br", "ca"],
    instructions: "עוד צעד קטן — איזו מדינה?",
    explanation: "חזרה על יפן, עם אפשרות רביעית מהמדינות שהכרנו.",
  },
  {
    correct: "il",
    distractors: ["jp", "br", "fr"],
    instructions: "מורידים את העיניים לדגל — איזו מדינה?",
    explanation: "ישראל מול שאר חמש המוכרות.",
  },
  {
    correct: "br",
    distractors: ["jp", "il", "ca"],
    instructions: "בטוחים בעצמנו — איזו מדינה?",
    explanation: "ברזיל — כל המסיחים מהמסלול המוכר.",
  },
  {
    correct: "ca",
    distractors: ["jp", "il", "br"],
    instructions: "עוד מהמוכרים",
    explanation: "קנדה — בלי מדינות “חדשות” במסיחים.",
  },
  {
    correct: "fr",
    distractors: ["jp", "il", "br"],
    instructions: "ועוד אחד מהחבילה",
    explanation: "צרפת — עדיין רק החמש שהכרת.",
  },
  {
    correct: "au",
    distractors: ["jp", "il", "br"],
    instructions: "דגל חדש — קל להבחין",
    explanation: "אוסטרליה — הרחבה ראשונה אחרי החמש המוכרות.",
  },
  {
    correct: "de",
    distractors: ["fr", "jp", "il"],
    instructions: "שלושה פסים אופקיים — עוד מדינה מוכרת",
    explanation: "גרמניה — כל המסיחים מהחמש שהכרת מההתחלה.",
  },
  {
    correct: "es",
    distractors: ["fr", "ca", "br"],
    instructions: "אדום־צהוב — מזהים את המדינה?",
    explanation: "ספרד — המסיחים רק מהחמש שהכרת מההתחלה.",
  },
  {
    correct: "gr",
    distractors: ["jp", "il", "ca"],
    instructions: "כחול ולבן — צעד נעים",
    explanation: "יוון — המסיחים רק מהמדינות שהכרנו ב־gentle.",
  },
  {
    correct: "eg",
    distractors: ["jp", "il", "br"],
    instructions: "קארמה זהובה ומגן על רקע — מדינה מהמפה ליד ישראל",
    explanation: "מצרים — המסיחים רק מהחמש שהכרת ואוסטרליה לא כאן; דגל ברור.",
  },
  {
    correct: "sa",
    distractors: ["jp", "il", "fr"],
    instructions: "כתב ירוק וחרב על רקע לבן — איזו מדינה גדולה עם הרבה מדבר?",
    explanation: "סעודיה — דגל ברור ליד המדינות שהכרנו מתחילת המסלול.",
  },
  {
    correct: "jo",
    distractors: ["ca", "il", "br"],
    instructions: "שלושה פסים אופקיים — שחור, לבן וירוק. מדינה שכנה לישראל.",
    explanation: "ירדן — המסיחים רק מהרגילים; קל להבחין בדגל.",
  },
  {
    correct: "tr",
    distractors: ["fr", "jp", "il"],
    instructions: "סהר וכוכב על רקע אדום — מדינה גדולה מצפון לים התיכון.",
    explanation: "טורקיה — צבעים חדים ליד צרפת, יפן וישראל.",
  },
  {
    correct: "ae",
    distractors: ["jp", "br", "ca"],
    instructions: "ארבעה צבעים אנכיים — אדום, ירוק, לבן ושחור. מדינה ליד המפרץ.",
    explanation: "איחוד האמירויות — דגל צבעוני ליד המדינות הראשונות שלמדנו.",
  },
];

type MapGentleTemplate = {
  correct: "jp" | "il" | "br";
  distractors: [FlagGentleKey, FlagGentleKey];
  instructions: string;
  explanation: string;
};

export const FLAGS_MAP_GENTLE_TEMPLATES: readonly MapGentleTemplate[] = [
  {
    correct: "jp",
    distractors: ["il", "br"],
    instructions: "נתחיל ממפה פשוטה — באיזו מדינה מסומן האזור?",
    explanation: "יפן על מפת אסיה — צורת איים קטנה וברורה.",
  },
  {
    correct: "il",
    distractors: ["jp", "ca"],
    instructions: "ממשיכים ברוגע — אותה שאלה: איזו מדינה?",
    explanation: "ישראל ליד הים התיכון במפה המאוגדת.",
  },
  {
    correct: "br",
    distractors: ["il", "jp"],
    instructions: "מזהים את הצורה הגדולה? איזו מדינה?",
    explanation: "ברזיל — הגוש הגדול בדרום אמריקה במפה.",
  },
  {
    correct: "il",
    distractors: ["br", "fr"],
    instructions: "חיזוק קטן — שוב ליד הים התיכון. איזו מדינה?",
    explanation: "חזרה עדינה על ישראל על המפה — עם מסיחים אחרים.",
  },
  {
    correct: "br",
    distractors: ["jp", "ca"],
    instructions: "עוד פעם בדרום אמריקה — אותה שאלה נחמדה.",
    explanation: "חזרה על ברזיל — המסיחים כוללים את קנדה והיפן מהמסלול המוכר.",
  },
];

type MapSteadyTemplate = {
  correct: FlagChoiceKey;
  distractors: [FlagChoiceKey, FlagChoiceKey, FlagChoiceKey];
  mapCountry: { mapId: string; highlightedShapeId: string };
  instructions: string;
  explanation: string;
};

export const FLAGS_MAP_STEADY_TEMPLATES: readonly MapSteadyTemplate[] = [
  {
    correct: "jp",
    distractors: ["il", "br", "ca"],
    mapCountry: { mapId: "asia-pacific", highlightedShapeId: "japan" },
    instructions: "עוד צעד על המפה — איזו מדינה מסומנת?",
    explanation: "חזרה על יפן — מסיחים מהמדינות שהכרנו בדגלים.",
  },
  {
    correct: "il",
    distractors: ["jp", "br", "fr"],
    mapCountry: { mapId: "mid-east-europe", highlightedShapeId: "israel" },
    instructions: "ממשיכים ברוגע — אותו אזור. איזו מדינה?",
    explanation: "ישראל על המפה — עם מסיחי טקסט מוכרים.",
  },
  {
    correct: "br",
    distractors: ["jp", "il", "ca"],
    mapCountry: { mapId: "americas-south", highlightedShapeId: "brazil" },
    instructions: "דרום אמריקה שוב — איזו מדינה?",
    explanation: "ברזיל — המסיחים עדיין ממדינות המפתח.",
  },
  {
    correct: "it",
    distractors: ["il", "eg", "jp"],
    mapCountry: { mapId: "mid-east-europe", highlightedShapeId: "italy" },
    instructions: "צורה חדשה באותה מפה — באיזו מדינה מדובר?",
    explanation: "איטליה — ליד ישראל ומצרים על המפה המוכרת.",
  },
  {
    correct: "cl",
    distractors: ["br", "jp", "il"],
    mapCountry: { mapId: "americas-south", highlightedShapeId: "chile" },
    instructions: "רצועה צרה ליד ברזיל — איזו מדינה?",
    explanation: "צ׳ילה ליד ברזיל — שתי צורות שונות על אותה מפה.",
  },
  {
    correct: "eg",
    distractors: ["il", "it", "jp"],
    mapCountry: { mapId: "mid-east-europe", highlightedShapeId: "egypt" },
    instructions: "גוש גדול דרומית לים — איזו מדינה?",
    explanation: "מצרים — אחרי שכבר ראינו את ישראל ואיטליה כאן.",
  },
  {
    correct: "de",
    distractors: ["fr", "jp", "il"],
    mapCountry: { mapId: "europe-core", highlightedShapeId: "germany" },
    instructions: "מפת אירופה — הגוש המסומן במרכז־צפון. איזו מדינה?",
    explanation: "גרמניה — המסיחים לשמות שכבר הכרת בדגלים.",
  },
  {
    correct: "es",
    distractors: ["fr", "ca", "br"],
    mapCountry: { mapId: "europe-core", highlightedShapeId: "spain" },
    instructions: "חצי אי מערבית באירופה — איזו מדינה מסומנת?",
    explanation: "ספרד — מול צרפת, קנדה וברזיל כשמות.",
  },
  {
    correct: "mx",
    distractors: ["ca", "jp", "br"],
    mapCountry: { mapId: "americas-north", highlightedShapeId: "mexico" },
    instructions: "דרומית לארצות הברית על המפה הפשוטה — איזו מדינה?",
    explanation: "מקסיקו — מסיחים מהמדינות שהכרנו מהמסלול הראשון.",
  },
  {
    correct: "ar",
    distractors: ["br", "cl", "jp"],
    mapCountry: { mapId: "americas-south", highlightedShapeId: "argentina" },
    instructions: "רחוקה מעט מברזיל הגדולה — איזו מדינה בדרום?",
    explanation: "ארגנטינה — ליד ברזיל וצ׳ילה על אותה מפה.",
  },
];

/** map-country ל־spark — ארבע אפשרויות כמו steady; מסיח אחד "רחוק" להקלה על ההבחנה */
export const FLAGS_MAP_SPARK_TEMPLATES: readonly MapSteadyTemplate[] = [
  {
    correct: "it",
    distractors: ["eg", "il", "jp"],
    mapCountry: { mapId: "mid-east-europe", highlightedShapeId: "italy" },
    instructions: "Spark — מי המדינה המסומנת? (חצי־אי ארוך ליד הים)",
    explanation: "איטליה לעומת מצרים וישראל; יפן ממפה אחרת כמסיח מרחיק.",
  },
  {
    correct: "cl",
    distractors: ["br", "au", "jp"],
    mapCountry: { mapId: "americas-south", highlightedShapeId: "chile" },
    instructions: "רצועה צרה בדרום — לא ברזיל הגדולה. מי זו?",
    explanation: "צ׳ילה מול ברזיל; אוסטרליה ויפן רחוקות גיאוגרפית.",
  },
  {
    correct: "jp",
    distractors: ["au", "uk", "br"],
    mapCountry: { mapId: "asia-pacific", highlightedShapeId: "japan" },
    instructions: "אי קטן במזרח — מי המדינה?",
    explanation: "יפן מול אוסטרליה ובריטניה; ברזיל מהמפה האמריקאית.",
  },
  {
    correct: "uk",
    distractors: ["ie", "jp", "br"],
    mapCountry: { mapId: "north-atlantic", highlightedShapeId: "uk" },
    instructions: "אי ליד אירלנד — מי המדינה המסומנת?",
    explanation: "בריטניה לעומת אירלנד; יפן וברזיל כמסיחים רחוקים.",
  },
  {
    correct: "eg",
    distractors: ["il", "it", "cl"],
    mapCountry: { mapId: "mid-east-europe", highlightedShapeId: "egypt" },
    instructions: "גוש גדול דרומית לים התיכון — מי זו?",
    explanation: "מצרים מול ישראל ואיטליה; צ׳ילה על מפת אמריקה.",
  },
  {
    correct: "il",
    distractors: ["eg", "jo", "tr"],
    mapCountry: { mapId: "mid-east-europe", highlightedShapeId: "israel" },
    instructions: "מדינה קטנה ליד הים — בין מצרים לירדן. מי מסומנת?",
    explanation: "ישראל — לעומת מצרים, ירדן וטורקיה על אותה מפה רגועה.",
  },
  {
    correct: "ie",
    distractors: ["uk", "jp", "eg"],
    mapCountry: { mapId: "north-atlantic", highlightedShapeId: "ireland" },
    instructions: "אי ירוק מערבית לבריטניה — מי זו?",
    explanation: "אירלנד מול בריטניה; יפן ומצרים כהבחנה ברורה.",
  },
  {
    correct: "gr",
    distractors: ["it", "es", "eg"],
    mapCountry: { mapId: "europe-core", highlightedShapeId: "greece" },
    instructions: "Spark — ארץ איים וחופים בדרום אירופה. מי מסומנת?",
    explanation: "יוון לעומת איטליה, ספרד ומצרים — צורות שונות.",
  },
  {
    correct: "cn",
    distractors: ["jp", "in", "au"],
    mapCountry: { mapId: "asia-pacific", highlightedShapeId: "china" },
    instructions: "גוש גדול בצפון מזרח אסיה — איזו מדינה?",
    explanation: "סין מול יפן, הודו ואוסטרליה.",
  },
  {
    correct: "in",
    distractors: ["cn", "jp", "eg"],
    mapCountry: { mapId: "asia-pacific", highlightedShapeId: "india" },
    instructions: "משולש צדפה בין ים ליבשת — מי המדינה?",
    explanation: "הודו — לעומת סין, יפן ומצרים.",
  },
  {
    correct: "za",
    distractors: ["eg", "au", "br"],
    mapCountry: { mapId: "africa-southern", highlightedShapeId: "south_africa" },
    instructions: "בקצה הדרומי של יבשת אפריקה — מי המדינה המסומנת?",
    explanation: "דרום אפריקה מול מצרים, אוסטרליה וברזיל.",
  },
  {
    correct: "sa",
    distractors: ["eg", "il", "jo"],
    mapCountry: { mapId: "mid-east-europe", highlightedShapeId: "saudi_arabia" },
    instructions: "Spark — גוש גדול דרומית מירדן — איזו מדינה?",
    explanation: "סעודיה — לעומת מצרים, ישראל וירדן על אותה מפה פשוטה.",
  },
  {
    correct: "jo",
    distractors: ["il", "eg", "ae"],
    mapCountry: { mapId: "mid-east-europe", highlightedShapeId: "jordan" },
    instructions: "מדינה קטנה צפונית למסומן הגדול של מצרים — מי זו?",
    explanation: "ירדן — לעומת ישראל, מצרים והאמירויות.",
  },
  {
    correct: "tr",
    distractors: ["gr", "eg", "il"],
    mapCountry: { mapId: "mid-east-europe", highlightedShapeId: "turkey" },
    instructions: "גוש בצפון המפה — בין אירופה לים — מי המדינה?",
    explanation: "טורקיה — לעומת יוון, מצרים וישראל.",
  },
  {
    correct: "ae",
    distractors: ["sa", "eg", "jo"],
    mapCountry: { mapId: "mid-east-europe", highlightedShapeId: "uae" },
    instructions: "צורת חוף קטנה ליד המפרץ — איזו מדינה?",
    explanation: "איחוד האמירויות — מול סעודיה, מצרים וירדן.",
  },
];

export type FlagsMatchingPairSpec = Readonly<{ pairId: string; key: FlagChoiceKey }>;

export type FlagsMatchingRound = Readonly<{
  instructions: string;
  explanation: string;
  pairs: readonly FlagsMatchingPairSpec[];
}>;

export const FLAGS_MATCHING_GENTLE_ROUNDS: readonly FlagsMatchingRound[] = [
  {
    instructions: "מזווגים דגל למדינה — מתחילים רך וברור",
    explanation: "יפן וישראל — צורות דגל שונות לגמרי.",
    pairs: [
      { pairId: "fg-g1", key: "jp" },
      { pairId: "fg-g2", key: "il" },
    ],
  },
  {
    instructions: "עוד דגלים מוכרים — כל זוג קל להבחין",
    explanation: "ברזיל, קנדה וצרפת — כל אחד נראה אחרת לגמרי.",
    pairs: [
      { pairId: "fg-g3", key: "br" },
      { pairId: "fg-g4", key: "ca" },
      { pairId: "fg-g5", key: "fr" },
    ],
  },
];

export const FLAGS_MATCHING_STEADY_ROUNDS: readonly FlagsMatchingRound[] = [
  {
    instructions: "גשר נחמד — אותן מדינות שכבר הכרת, פלוס קנדה",
    explanation: "ארבעה דגלים מהמסלול הראשון + קנדה.",
    pairs: [
      { pairId: "fs-s1", key: "jp" },
      { pairId: "fs-s2", key: "il" },
      { pairId: "fs-s3", key: "br" },
      { pairId: "fs-s4", key: "ca" },
    ],
  },
  {
    instructions: "צרפת והחברים הוותיקים",
    explanation: "צרפת חדשה בזיווג, השאר חוזרים לביטחון.",
    pairs: [
      { pairId: "fs-s5", key: "fr" },
      { pairId: "fs-s6", key: "jp" },
      { pairId: "fs-s7", key: "il" },
      { pairId: "fs-s8", key: "br" },
    ],
  },
  {
    instructions: "אירופה ברוגע — גרמניה, ספרד ויוון",
    explanation: "שלושה דגלים ברורים אחרי שכבר הרגלתם לדגלים מוכרים.",
    pairs: [
      { pairId: "fs-s9", key: "de" },
      { pairId: "fs-s10", key: "es" },
      { pairId: "fs-s11", key: "gr" },
    ],
  },
];

/** matching spark — רק דגלים שקל להבדיל; בלי GB+US באותו סיבוב */
export const FLAGS_MATCHING_SPARK_ROUNDS: readonly FlagsMatchingRound[] = [
  {
    instructions: "Spark — כל דגל נראה אחרת; בוחרים בביטחון",
    explanation: "יפן, צרפת, ברזיל, אוסטרליה וישראל.",
    pairs: [
      { pairId: "fsp-1", key: "jp" },
      { pairId: "fsp-2", key: "fr" },
      { pairId: "fsp-3", key: "br" },
      { pairId: "fsp-4", key: "au" },
      { pairId: "fsp-5", key: "il" },
    ],
  },
  {
    instructions: "עוד ארבעה — מדינות מהמסלול המורחב",
    explanation: "קנדה, איטליה, צ׳ילה ומצרים.",
    pairs: [
      { pairId: "fsp-6", key: "ca" },
      { pairId: "fsp-7", key: "it" },
      { pairId: "fsp-8", key: "cl" },
      { pairId: "fsp-9", key: "eg" },
    ],
  },
  {
    instructions: "Spark — יבשות שונות; כל דגל מסוג אחר",
    explanation: "מקסיקו, ארגנטינה, סין, הודו ודרום אפריקה.",
    pairs: [
      { pairId: "fsp-10", key: "mx" },
      { pairId: "fsp-11", key: "ar" },
      { pairId: "fsp-12", key: "cn" },
      { pairId: "fsp-13", key: "in" },
      { pairId: "fsp-14", key: "za" },
    ],
  },
  {
    instructions: "Spark — דגלים מהמזרח התיכון; כל אחד ברור",
    explanation: "ישראל, מצרים, סעודיה, ירדן, טורקיה ואיחוד האמירויות.",
    pairs: [
      { pairId: "fsp-15", key: "il" },
      { pairId: "fsp-16", key: "eg" },
      { pairId: "fsp-17", key: "sa" },
      { pairId: "fsp-18", key: "jo" },
      { pairId: "fsp-19", key: "tr" },
      { pairId: "fsp-20", key: "ae" },
    ],
  },
];

export const FLAG_EXTENDED_LABEL_HE: Readonly<Record<FlagChoiceKey, string>> = {
  ...FLAG_LABEL_HE,
  it: "איטליה",
  eg: "מצרים",
  cl: "צ׳ילה",
  gb: "בריטניה",
  us: "ארצות הברית",
  uk: "בריטניה",
  ie: "אירלנד",
  de: "גרמניה",
  es: "ספרד",
  gr: "יוון",
  mx: "מקסיקו",
  ar: "ארגנטינה",
  za: "דרום אפריקה",
  cn: "סין",
  in: "הודו",
  sa: "סעודיה",
  jo: "ירדן",
  tr: "טורקיה",
  ae: "איחוד האמירויות",
};
