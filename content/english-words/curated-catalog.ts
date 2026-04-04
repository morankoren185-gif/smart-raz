/**
 * מקור אמת אוצר — englishWords: gentle, גשר steady, spark, והרכבת צעדי matching.
 * כל משחקי העולם נשענים כאן כדי להימנע מסטייה בין MC / listen / build / matching / משימות.
 */

/** מילים לרמה העדינה — קצרות ומוכרות */
export const ENGLISH_WORDS_GENTLE_ORDER = [
  "cat",
  "dog",
  "sun",
  "car",
  "mom",
  "dad",
] as const;

/**
 * גשר מ־gentle ל־steady: קודם מילי מעבר (הוסרו מ־gentle), אחר כך הרחבה רגועה.
 */
export const ENGLISH_WORDS_STEADY_NEAR_GENTLE = ["hat", "fish", "apple", "tree"] as const;

export const ENGLISH_WORDS_STEADY_NEXT = ["house", "water", "book", "chair", "green", "happy"] as const;

export const ENGLISH_WORDS_STEADY_ORDERED = [
  ...ENGLISH_WORDS_STEADY_NEAR_GENTLE,
  ...ENGLISH_WORDS_STEADY_NEXT,
] as const;

export type EnglishWordMatchingPairSpec = Readonly<{ pairId: string; word: string }>;

export type EnglishWordsMatchingRound = Readonly<{
  instructions: string;
  explanation: string;
  pairs: readonly EnglishWordMatchingPairSpec[];
}>;

/** סיבובי matching — gentle; מילים מתוך `ENGLISH_WORDS_GENTLE_ORDER` בלבד */
export const ENGLISH_WORDS_MATCHING_GENTLE_ROUNDS: readonly EnglishWordsMatchingRound[] = [
  {
    instructions: "Match each picture to its English word — small wins!",
    explanation: "זיווג אימוג׳י עם מילה באנגלית.",
    pairs: [
      { pairId: "ew-g1", word: "cat" },
      { pairId: "ew-g2", word: "dog" },
    ],
  },
  {
    instructions: "A few more friendly pairs",
    explanation: "מילים מוכרות מהרמה העדינה.",
    pairs: [
      { pairId: "ew-g3", word: "sun" },
      { pairId: "ew-g4", word: "car" },
      { pairId: "ew-g5", word: "mom" },
      { pairId: "ew-g6", word: "dad" },
    ],
  },
];

/** סיבובי matching — steady לפי סדר הגשר */
export const ENGLISH_WORDS_MATCHING_STEADY_ROUNDS: readonly EnglishWordsMatchingRound[] = [
  {
    instructions: "עוד צעד קטן — אותו כיף של זיווג",
    explanation: "גשר מ־gentle: כובע, דג, תפוח, עץ.",
    pairs: [
      { pairId: "ew-s1", word: "hat" },
      { pairId: "ew-s2", word: "fish" },
      { pairId: "ew-s3", word: "apple" },
    ],
  },
  {
    instructions: "ממשיכים בקצב נחמד",
    explanation: "עץ ובית, ואז עוד קצת אוצר.",
    pairs: [
      { pairId: "ew-s4", word: "tree" },
      { pairId: "ew-s5", word: "house" },
      { pairId: "ew-s6", word: "water" },
      { pairId: "ew-s7", word: "book" },
    ],
  },
  {
    instructions: "סיום רך לרמה הזו — שלוש מילים אחרונות",
    explanation: "כיסא, צבע, רגש — אחרי שכבר התחממנו.",
    pairs: [
      { pairId: "ew-s8", word: "chair" },
      { pairId: "ew-s9", word: "green" },
      { pairId: "ew-s10", word: "happy" },
    ],
  },
];

/**
 * מילות spark — ארוכות יותר מ־steady אבל עדיין קריאות; כולן בלקסיקון.
 */
export const ENGLISH_WORDS_SPARK_ORDERED = [
  "pencil",
  "window",
  "rabbit",
  "banana",
  "elephant",
  "purple",
  "airplane",
] as const;

/** matching ל־spark — רק מילים מהרשימה לעיל */
export const ENGLISH_WORDS_MATCHING_SPARK_ROUNDS: readonly EnglishWordsMatchingRound[] = [
  {
    instructions: "Spark — read each word, then match the picture",
    explanation: "אורכים שונים — קריאה אמיתית, לא רק ניחוש מאימוג׳י.",
    pairs: [
      { pairId: "ew-sp-1", word: "pencil" },
      { pairId: "ew-sp-2", word: "window" },
      { pairId: "ew-sp-3", word: "rabbit" },
    ],
  },
  {
    instructions: "Keep going — same calm focus",
    explanation: "פירות, חיה גדולה, צבע ומילת תנועה.",
    pairs: [
      { pairId: "ew-sp-4", word: "banana" },
      { pairId: "ew-sp-5", word: "elephant" },
      { pairId: "ew-sp-6", word: "purple" },
      { pairId: "ew-sp-7", word: "airplane" },
    ],
  },
];
