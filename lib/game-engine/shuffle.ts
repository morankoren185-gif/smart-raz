import type { PlayableMultipleChoiceRound } from "./playableRound";

/** ערבוב פישר-ייטס — טהור, ללא תלות ב-React */
export function shuffleArray<T>(items: T[], random: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function shuffleRoundChoices(
  round: PlayableMultipleChoiceRound,
  maxChoices: number,
  random: () => number = Math.random,
): PlayableMultipleChoiceRound {
  let choices = shuffleArray(round.choices, random);
  const hasCorrect = choices.some((c) => c.id === round.correctChoiceId);

  if (!hasCorrect) {
    return { ...round, choices };
  }

  const correct = choices.find((c) => c.id === round.correctChoiceId)!;
  const wrongPool = choices.filter((c) => c.id !== round.correctChoiceId);
  const limit = Math.min(maxChoices, choices.length);
  const wrongKeep = Math.max(0, limit - 1);
  const trimmedWrong = shuffleArray(wrongPool, random).slice(0, wrongKeep);
  choices = shuffleArray([correct, ...trimmedWrong], random);

  return { ...round, choices };
}

/** בוחר סיבובים — אם הבנק קצר, חוזרים על פריטים בערבוב כדי לשמור על אורך מפגש יציב */
export function pickRounds(
  bank: PlayableMultipleChoiceRound[],
  count: number,
  random: () => number = Math.random,
): PlayableMultipleChoiceRound[] {
  if (bank.length === 0) return [];
  const shuffled = shuffleArray(bank, random);
  const out: PlayableMultipleChoiceRound[] = [];
  for (let i = 0; i < count; i += 1) {
    const template = shuffled[i % shuffled.length]!;
    out.push({
      ...template,
      id: `${template.id}::${i}`,
    });
  }
  return out;
}

/** בוחר סיבובים לפי סדר הבנק (ללא ערבוב הבנק) — לאחר סידור עדיפויות SRS */
export function pickRoundsInOrder(
  bank: PlayableMultipleChoiceRound[],
  count: number,
): PlayableMultipleChoiceRound[] {
  if (bank.length === 0) return [];
  const out: PlayableMultipleChoiceRound[] = [];
  for (let i = 0; i < count; i += 1) {
    const template = bank[i % bank.length]!;
    out.push({
      ...template,
      id: `${template.id}::${i}`,
    });
  }
  return out;
}
