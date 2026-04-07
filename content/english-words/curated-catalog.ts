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
  "bird",
  "ball",
  "milk",
  "red",
] as const;

/**
 * גשר מ־gentle ל־steady: קודם מילי מעבר (הוסרו מ־gentle), אחר כך הרחבה רגועה.
 */
export const ENGLISH_WORDS_STEADY_NEAR_GENTLE = ["hat", "fish", "apple", "tree"] as const;

export const ENGLISH_WORDS_STEADY_NEXT = ["house", "water", "book", "chair", "green", "happy"] as const;

export const ENGLISH_WORDS_STEADY_EXTENDED = [
  "star",
  "bed",
  "bus",
  "cup",
  "cake",
  "shoe",
  "duck",
  "frog",
] as const;

export const ENGLISH_WORDS_STEADY_ORDERED = [
  ...ENGLISH_WORDS_STEADY_NEAR_GENTLE,
  ...ENGLISH_WORDS_STEADY_NEXT,
  ...ENGLISH_WORDS_STEADY_EXTENDED,
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
  {
    instructions: "New friends — colors, food, and play",
    explanation: "ציפור, כדור, חלב ואדום.",
    pairs: [
      { pairId: "ew-g7", word: "bird" },
      { pairId: "ew-g8", word: "ball" },
      { pairId: "ew-g9", word: "milk" },
      { pairId: "ew-g10", word: "red" },
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
  {
    instructions: "Sky, sleep, wheels, and sips",
    explanation: "כוכב, מיטה, אוטובוס וספל.",
    pairs: [
      { pairId: "ew-s11", word: "star" },
      { pairId: "ew-s12", word: "bed" },
      { pairId: "ew-s13", word: "bus" },
      { pairId: "ew-s14", word: "cup" },
    ],
  },
  {
    instructions: "Sweet treat, feet, quack, hop",
    explanation: "עוגה, נעל, ברווז וצפרדע.",
    pairs: [
      { pairId: "ew-s15", word: "cake" },
      { pairId: "ew-s16", word: "shoe" },
      { pairId: "ew-s17", word: "duck" },
      { pairId: "ew-s18", word: "frog" },
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
  "tiger",
  "monkey",
  "train",
  "yellow",
  "orange",
  "flower",
  "spoon",
  "sister",
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
  {
    instructions: "Spark — jungle, trees, and rides",
    explanation: "טיגריס, קוף ורכבת.",
    pairs: [
      { pairId: "ew-sp-8", word: "tiger" },
      { pairId: "ew-sp-9", word: "monkey" },
      { pairId: "ew-sp-10", word: "train" },
    ],
  },
  {
    instructions: "Colors, kitchen, family",
    explanation: "צהוב, כתום, פרח וכפית.",
    pairs: [
      { pairId: "ew-sp-11", word: "yellow" },
      { pairId: "ew-sp-12", word: "orange" },
      { pairId: "ew-sp-13", word: "flower" },
      { pairId: "ew-sp-14", word: "spoon" },
    ],
  },
  {
    instructions: "One more warm match",
    explanation: "בני משפחה.",
    pairs: [{ pairId: "ew-sp-15", word: "sister" }],
  },
];
