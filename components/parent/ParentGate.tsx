"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import {
  isParentGateAnswerCorrect,
  PARENT_GATE_WRONG_HINTS,
  pickParentGatePuzzle,
  unlockParentGate,
} from "@/lib/parent-gate";

type ParentGateProps = {
  onPassed: () => void;
};

function randomHint(): string {
  const i = Math.floor(Math.random() * PARENT_GATE_WRONG_HINTS.length);
  return PARENT_GATE_WRONG_HINTS[i]!;
}

export function ParentGate({ onPassed }: ParentGateProps) {
  const puzzle = useMemo(() => pickParentGatePuzzle(), []);
  const [value, setValue] = useState("");
  const [hint, setHint] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (isParentGateAnswerCorrect(puzzle, value)) {
      unlockParentGate();
      setHint(null);
      onPassed();
      return;
    }
    setHint(randomHint());
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100" dir="rtl">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10 sm:px-6">
        <header className="mb-8 text-center">
          <p className="text-sm font-medium text-amber-200/90">רק להורים</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">אזור הורה</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            כאן מופיעה תמונה על ההתקדמות והזמן. נשמח שתאשרו שאתם מבוגרים האחראים —
            חידה קצרה ופשוטה.
          </p>
        </header>

        <form
          onSubmit={submit}
          className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur"
        >
          <label htmlFor="parent-gate-answer" className="block text-center text-lg font-semibold text-slate-100">
            {puzzle.prompt}
          </label>
          <input
            id="parent-gate-answer"
            name="answer"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (hint) setHint(null);
            }}
            className="mt-5 w-full rounded-2xl border border-white/15 bg-slate-950/80 px-4 py-4 text-center text-2xl font-bold tabular-nums text-white placeholder:text-slate-600 focus:border-amber-300/50 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
            placeholder="התשובה"
            aria-describedby={hint ? "parent-gate-hint" : undefined}
          />
          {hint ? (
            <p
              id="parent-gate-hint"
              role="status"
              className="mt-4 rounded-2xl border border-amber-500/25 bg-amber-950/30 px-4 py-3 text-center text-sm font-medium text-amber-100/95"
            >
              {hint}
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-6 w-full min-h-14 rounded-2xl bg-amber-400 px-4 text-lg font-bold text-slate-900 shadow-lg transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
          >
            המשך לאזור ההורה
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-amber-100 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
          >
            חזרה לכוכב הבית
          </Link>
        </div>
      </div>
    </div>
  );
}
