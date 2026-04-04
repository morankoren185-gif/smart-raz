/**
 * שער הורה קל ל־MVP: חידת חשבון פשוטה + זכירה ב-sessionStorage לזמן מוגבל.
 * אין אימות אמיתי — רק מניעת כניסה מקרית של ילדים צעירים.
 */

export type ParentGatePuzzle = Readonly<{
  /** טקסט להצגה (עברית) */
  prompt: string;
  /** התשובה הנכונה (מספר שלם) */
  answer: number;
}>;

const PUZZLE_POOL: ParentGatePuzzle[] = [
  { prompt: "כמה זה 7 + 5?", answer: 12 },
  { prompt: "כמה זה 9 − 3?", answer: 6 },
  { prompt: "כמה זה 4 + 8?", answer: 12 },
  { prompt: "כמה זה 6 + 7?", answer: 13 },
  { prompt: "כמה זה 15 − 8?", answer: 7 },
  { prompt: "כמה זה 11 + 4?", answer: 15 },
  { prompt: "כמה זה 18 − 9?", answer: 9 },
];

/** מפתח sessionStorage — ניתן להרחיב למסלולים נוספים בעתיד */
export const PARENT_GATE_SESSION_KEY = "smart-raz.parent-gate.at";

/** כמה זמן (מילישניות) נחשב "אותו session" לאחר מעבר מוצלח */
export const PARENT_GATE_MAX_AGE_MS = 2 * 60 * 60 * 1000;

export function pickParentGatePuzzle(): ParentGatePuzzle {
  const i = Math.floor(Math.random() * PUZZLE_POOL.length);
  return PUZZLE_POOL[i]!;
}

export function parseGateNumericInput(raw: string): number | null {
  const t = raw.trim().replace(/\s+/g, "");
  if (!t) return null;
  if (!/^-?\d+$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function isParentGateAnswerCorrect(
  puzzle: ParentGatePuzzle,
  rawInput: string,
): boolean {
  const n = parseGateNumericInput(rawInput);
  if (n === null) return false;
  return n === puzzle.answer;
}

/** Vitest ו־Node משתמשים ב־`globalThis.window` אחרי stubGlobal — לא בזיהוי `window` החופשי */
function getSessionStorage(): Storage | null {
  if (typeof globalThis === "undefined") return null;
  const w = (globalThis as unknown as { window?: { sessionStorage?: Storage } }).window;
  return w?.sessionStorage ?? null;
}

export function unlockParentGate(): void {
  try {
    const ss = getSessionStorage();
    if (!ss) return;
    ss.setItem(PARENT_GATE_SESSION_KEY, String(Date.now()));
  } catch {
    /* לדוגמה מצב פרטי עם חסימת אחסון */
  }
}

export function isParentGateUnlocked(): boolean {
  try {
    const ss = getSessionStorage();
    if (!ss) return false;
    const raw = ss.getItem(PARENT_GATE_SESSION_KEY);
    if (!raw) return false;
    const at = Number(raw);
    if (!Number.isFinite(at)) return false;
    return Date.now() - at < PARENT_GATE_MAX_AGE_MS;
  } catch {
    return false;
  }
}

/** לבדיקות / ניקוי ידני בלבד */
export function clearParentGateSession(): void {
  try {
    const ss = getSessionStorage();
    if (!ss) return;
    ss.removeItem(PARENT_GATE_SESSION_KEY);
  } catch {
    /* noop */
  }
}

export const PARENT_GATE_WRONG_HINTS = [
  "לא בדיוק, ננסה שוב.",
  "כמעט — אפשר לנסות שוב.",
  "עוד ניסיון עדין?",
] as const;
