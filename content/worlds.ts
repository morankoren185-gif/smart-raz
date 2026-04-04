import type { WorldId } from "./types";

export type WorldMeta = {
  id: WorldId;
  title: string;
  /** קו עיצובי קצר */
  metaphor: string;
  gradient: string;
};

export const WORLDS: WorldMeta[] = [
  {
    id: "english",
    title: "עולם האנגלית",
    metaphor: "מעבורות מילים בין כוכבים",
    gradient: "from-indigo-500/30 via-sky-400/20 to-transparent",
  },
  {
    id: "englishWords",
    title: "מילים באנגלית",
    metaphor: "מילים קטנות ובטוחות — כל ניצחון סופר",
    gradient: "from-sky-500/35 via-indigo-400/25 to-transparent",
  },
  {
    id: "hebrew",
    title: "עולם העברית",
    metaphor: "אותיות זוהרות במסלולים",
    gradient: "from-violet-500/30 via-fuchsia-400/20 to-transparent",
  },
  {
    id: "math",
    title: "עולם החשבון",
    metaphor: "כוכבים לספירה",
    gradient: "from-amber-400/30 via-orange-400/20 to-transparent",
  },
  {
    id: "flags",
    title: "דגלים ומדינות",
    metaphor: "מסע צבעוני בין דגלים מוכרים",
    gradient: "from-teal-500/30 via-emerald-400/20 to-transparent",
  },
  {
    id: "space",
    title: "מסע בחלל",
    metaphor: "כוכבי לכת מוכרים — קצב רגוע וסקרן",
    gradient: "from-violet-600/30 via-indigo-500/25 to-transparent",
  },
];

export function getWorldMeta(id: WorldId): WorldMeta | undefined {
  return WORLDS.find((w) => w.id === id);
}
