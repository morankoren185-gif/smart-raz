"use client";

import { KidListenButton } from "@/components/kid/KidListenButton";
import { KidShell } from "@/components/layout/KidShell";
import {
  cancelOngoingSpeech,
  normalizeEnglishInstructionForSpeech,
  normalizeSpeechText,
} from "@/lib/audio/speech";
import type { FlagRegionId } from "@/content/flags/flag-regions";
import type { DifficultyKey } from "@/content/index";
import { filterFlagMatchingBank } from "@/lib/flags/flag-region-play-filter";
import type { MatchingQuestion } from "@/lib/game-types/matching";
import { prepareMatchingPuzzleFromBank } from "@/lib/play/buildMatchingPlayableCards";
import type { MatchingPlayableCard } from "@/lib/play/buildMatchingPlayableCards";
import type { MatchingPlayableGame } from "@/lib/play/matchingPlayableGame";
import { IllustrationWithEmojiFallback } from "@/components/kid/IllustrationWithEmojiFallback";
import { FlagsMissionPlayEndActions } from "@/components/game/FlagsMissionPlayEndActions";
import { resolveEnglishWordMissionPlayEndFlow } from "@/lib/english-words/english-words-mission-return-flow";
import { resolveFlagMissionPlayEndFlow } from "@/lib/flags/flag-mission-return-flow";
import { resolveSpaceMissionPlayEndFlow } from "@/lib/space/space-mission-return-flow";
import { SolarOrderHintCard } from "@/components/space/SolarOrderHintCard";
import type { AppProgress } from "@/lib/progress/storage";
import { addStars, loadProgress, markGameCompleted, recordLearningItemOutcome } from "@/lib/progress/storage";
import { isSrsWorld, learningItemKeyMatchingPair } from "@/lib/progress/learning-items";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const STARS_PER_PAIR = 1;

const pairPraise = ["יופי! זוג מתאים!", "נחמד מאוד!", "הנה זוג יפה!", "מתקדמים נהדר!"];
const tryAgain = ["כמעט — בוחרים שני פריטים אחרים.", "בוא ננסה עוד שילוב עדין."];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

type Phase = "playing" | "summary";

type MatchingGameClientProps = {
  playable: MatchingPlayableGame;
  initialDifficulty: DifficultyKey;
  flagsRegionFilter?: FlagRegionId;
  flagsMissionContextId?: string;
  flagsMissionStepId?: string;
  englishWordsMissionContextId?: string;
  englishWordsMissionStepId?: string;
  spaceMissionContextId?: string;
  spaceMissionStepId?: string;
};

export function MatchingGameClient({
  playable,
  initialDifficulty,
  flagsRegionFilter,
  flagsMissionContextId,
  flagsMissionStepId,
  englishWordsMissionContextId,
  englishWordsMissionStepId,
  spaceMissionContextId,
  spaceMissionStepId,
}: MatchingGameClientProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("playing");
  const [difficulty] = useState(initialDifficulty);

  const session = useMemo(
    () => ({
      worldId: playable.worldId,
      slug: playable.slug,
      title: playable.title,
    }),
    [playable.slug, playable.title, playable.worldId],
  );

  const puzzle = useMemo(() => {
    const rawBank = playable.banks[difficulty] ?? playable.banks.gentle;
    const bank =
      playable.worldId === "flags" && flagsRegionFilter
        ? filterFlagMatchingBank(rawBank as MatchingQuestion[], flagsRegionFilter)
        : rawBank;
    if (!isSrsWorld(playable.worldId)) {
      return prepareMatchingPuzzleFromBank(bank);
    }
    const items = loadProgress().learningItemsProgress?.items;
    return prepareMatchingPuzzleFromBank(bank, {
      gameSlug: playable.slug,
      learningItems: items,
      now: new Date(),
    });
  }, [playable.banks, playable.slug, playable.worldId, difficulty, flagsRegionFilter]);

  const [cards] = useState<MatchingPlayableCard[]>(() => puzzle?.cards ?? []);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(() => new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [blockPick, setBlockPick] = useState(false);
  const [progressAfterSession, setProgressAfterSession] = useState<AppProgress | null>(null);

  const totalPairs = puzzle?.question.pairs.length ?? 0;
  const matchedCount = matchedPairIds.size;

  const finishSession = useCallback(() => {
    setPhase("summary");
    const opts =
      session.worldId === "flags" && flagsMissionContextId
        ? { flagsMissionId: flagsMissionContextId }
        : session.worldId === "englishWords" && englishWordsMissionContextId
          ? { englishWordsMissionId: englishWordsMissionContextId }
          : session.worldId === "space" && spaceMissionContextId
            ? { spaceMissionId: spaceMissionContextId }
            : undefined;
    const next = markGameCompleted(session.worldId, session.slug, opts);
    setProgressAfterSession(next);
  }, [
    englishWordsMissionContextId,
    flagsMissionContextId,
    spaceMissionContextId,
    session.slug,
    session.worldId,
  ]);

  useEffect(() => {
    if (phase !== "playing" || totalPairs === 0 || matchedCount < totalPairs) return;
    const t = window.setTimeout(() => finishSession(), 550);
    return () => window.clearTimeout(t);
  }, [matchedCount, totalPairs, phase, finishSession]);

  useEffect(() => {
    if (phase === "summary") cancelOngoingSpeech();
  }, [phase]);

  useEffect(() => {
    return () => cancelOngoingSpeech();
  }, []);

  if (!puzzle) {
    return (
      <KidShell title="בקרוב" subtitle={session.title} backHref="/" backLabel="למסך הבית">
        <p className="mt-8 text-center text-white/80">אין עדיין פאזל לרמה הזו.</p>
      </KidShell>
    );
  }

  const { question } = puzzle;

  const onCardPress = (card: MatchingPlayableCard) => {
    if (phase !== "playing" || blockPick) return;
    if (matchedPairIds.has(card.pairId)) return;

    if (selectedId == null) {
      setSelectedId(card.cardId);
      return;
    }

    if (selectedId === card.cardId) {
      setSelectedId(null);
      return;
    }

    const first = cards.find((c) => c.cardId === selectedId);
    setSelectedId(null);
    if (!first) return;

    if (first.pairId === card.pairId) {
      setBlockPick(true);
      setMessage(randomItem(pairPraise));
      addStars(STARS_PER_PAIR);
      if (isSrsWorld(session.worldId)) {
        recordLearningItemOutcome(learningItemKeyMatchingPair(session.slug, card.pairId), true);
      }
      setMatchedPairIds((prev) => new Set([...prev, card.pairId]));
      window.setTimeout(() => {
        setMessage(null);
        setBlockPick(false);
      }, 700);
      return;
    }

    setMessage(randomItem(tryAgain));
    window.setTimeout(() => setMessage(null), 900);
  };

  if (phase === "summary") {
    const sessionStars = matchedCount * STARS_PER_PAIR;
    const missionEndFlow =
      session.worldId === "flags" && progressAfterSession
        ? resolveFlagMissionPlayEndFlow(progressAfterSession, {
            missionId: flagsMissionContextId,
            stepId: flagsMissionStepId,
            gameSlug: session.slug,
          })
        : session.worldId === "englishWords" && progressAfterSession
          ? resolveEnglishWordMissionPlayEndFlow(progressAfterSession, {
              missionId: englishWordsMissionContextId,
              stepId: englishWordsMissionStepId,
              gameSlug: session.slug,
            })
          : session.worldId === "space" && progressAfterSession
            ? resolveSpaceMissionPlayEndFlow(progressAfterSession, {
                missionId: spaceMissionContextId,
                stepId: spaceMissionStepId,
                gameSlug: session.slug,
              })
            : null;
    return (
      <KidShell title="סיימנו את הזיווגים!" subtitle={session.title} backHref="/" backLabel="למסך הבית">
        <div className="mt-6 space-y-6 text-center">
          <p className="text-3xl" aria-live="polite">
            ⭐️ × {sessionStars}
          </p>
          <p className="text-lg text-white/90">כל הכבוד על הריכוז וההתאמות!</p>
          {missionEndFlow ? <FlagsMissionPlayEndActions flow={missionEndFlow} /> : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              className="min-h-14 rounded-2xl bg-amber-400 px-6 text-lg font-bold text-slate-900 shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
              onClick={() => router.push(`/world/${session.worldId}`)}
            >
              עוד משחק באותו עולם
            </button>
            <button
              type="button"
              className="min-h-14 rounded-2xl border border-white/30 bg-white/10 px-6 text-lg font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
              onClick={() => router.push("/")}
            >
              חזרה לכוכב הבית
            </button>
          </div>
        </div>
      </KidShell>
    );
  }

  return (
    <KidShell
      title={session.title}
      subtitle="מוצאים זוגות מתאימים"
      backHref={`/world/${session.worldId}`}
    >
      {playable.slug === "space-planet-order-matching" ? (
        <div className="mb-4">
          <SolarOrderHintCard variant="compact" />
        </div>
      ) : null}
      <div
        dir={question.textDirection}
        className="mb-5 rounded-3xl border border-white/20 bg-white/10 px-4 py-5 text-center text-lg font-bold leading-snug sm:text-xl"
      >
        {question.instructions}
      </div>
      <div className="mb-4 flex justify-center">
        <KidListenButton
          worldId={session.worldId}
          text={
            session.worldId === "englishWords" || session.worldId === "space"
              ? normalizeEnglishInstructionForSpeech(question.instructions)
              : normalizeSpeechText(question.instructions)
          }
          label="להקשיב להנחיה"
          variant="primary"
        />
      </div>
      {message ? (
        <p
          role="status"
          aria-live="polite"
          className="mb-4 min-h-12 rounded-2xl border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-center text-base font-medium text-amber-50"
        >
          {message}
        </p>
      ) : (
        <div className="mb-4 min-h-12" aria-hidden />
      )}
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
        role="group"
        aria-label="כרטיסי זיווג"
      >
        {cards.map((card) => {
          const isMatched = matchedPairIds.has(card.pairId);
          const isSelected = selectedId === card.cardId;
          return (
            <button
              key={card.cardId}
              type="button"
              disabled={isMatched || blockPick}
              onClick={() => onCardPress(card)}
              className={[
                "flex min-h-[5.5rem] flex-col items-center justify-center rounded-2xl border-2 px-3 py-4 text-base font-semibold shadow-lg transition",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200",
                "active:scale-[0.98] disabled:cursor-default",
                isMatched
                  ? "border-emerald-400/60 bg-emerald-500/20 text-white opacity-60"
                  : isSelected
                    ? "border-amber-300 bg-amber-400/25 text-white"
                    : "border-white/25 bg-white/15 text-white hover:bg-white/25",
              ].join(" ")}
            >
              {!card.label.trim() && (card.imageSrc?.trim() || card.emoji) ? (
                <div className="flex min-h-[4.5rem] w-full items-center justify-center">
                  <IllustrationWithEmojiFallback
                    imageSrc={card.imageSrc}
                    emoji={card.emoji ?? "⭐"}
                    alt={(card.altHe?.trim() || card.label || "").trim()}
                    imgClassName="max-h-16 w-auto max-w-full object-contain sm:max-h-[4.5rem]"
                    emojiClassName="text-4xl leading-none"
                  />
                </div>
              ) : (
                <>
                  {card.label ? <span className="text-center">{card.label}</span> : null}
                  {card.emoji ? (
                    <span className="mt-1 text-3xl leading-none" aria-hidden>
                      {card.emoji}
                    </span>
                  ) : null}
                </>
              )}
            </button>
          );
        })}
      </div>
    </KidShell>
  );
}
