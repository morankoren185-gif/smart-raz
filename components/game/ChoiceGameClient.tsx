"use client";

import { MapCountryQuestionVisual } from "@/components/game/MapCountryQuestionVisual";
import { BigChoiceButton } from "@/components/kid/BigChoiceButton";
import { ChoicePromptVisual } from "@/components/kid/ChoicePromptVisual";
import { KidListenButton } from "@/components/kid/KidListenButton";
import { KidShell } from "@/components/layout/KidShell";
import {
  cancelOngoingSpeech,
  joinChoiceLabelsForSpeech,
  normalizeEnglishInstructionForSpeech,
  normalizeSpeechText,
} from "@/lib/audio/speech";
import type { DifficultyKey, GameModule } from "@/content/index";
import { bumpDifficulty } from "@/lib/game-engine/adaptive";
import { maxChoicesForDifficulty } from "@/lib/game-engine/config";
import type { PlayableMultipleChoiceRound } from "@/lib/game-engine/playableRound";
import { pickRounds, pickRoundsInOrder, shuffleArray, shuffleRoundChoices } from "@/lib/game-engine/shuffle";
import { mcQuestionToPlayableRound } from "@/lib/play/mapGameDefinitionToMultipleChoicePlayableGame";
import type { MultipleChoicePlayableGame } from "@/lib/play/multipleChoicePlayableGame";
import { FlagsMissionPlayEndActions } from "@/components/game/FlagsMissionPlayEndActions";
import { resolveEnglishWordMissionPlayEndFlow } from "@/lib/english-words/english-words-mission-return-flow";
import { resolveFlagMissionPlayEndFlow } from "@/lib/flags/flag-mission-return-flow";
import { resolveSpaceMissionPlayEndFlow } from "@/lib/space/space-mission-return-flow";
import { inferOrderMcHighlightPlanet } from "@/lib/space/solar-order-hint";
import { SolarOrderHintCard } from "@/components/space/SolarOrderHintCard";
import type { AppProgress } from "@/lib/progress/storage";
import {
  addStars,
  loadProgress,
  markGameCompleted,
  recordLearningItemOutcome,
  recordWorldDifficulty,
  type LearningItemsProgressState,
} from "@/lib/progress/storage";
import { isSrsWorld, learningItemKeyMc, orderMcTemplatesForSrs } from "@/lib/progress/learning-items";
import type { FlagRegionId } from "@/content/flags/flag-regions";
import { filterFlagMultipleChoiceBank } from "@/lib/flags/flag-region-play-filter";
import type { MultipleChoiceQuestion } from "@/lib/game-types/multiple-choice";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const ROUNDS_PER_SESSION = 6;
const STARS_PER_CORRECT = 1;
const STREAK_TO_BUMP = 4;

const praise = [
  "יופי, מתקדמים!",
  "איזה כיף לראות את ההתקדמות!",
  "נחמד וברור — כל הכבוד!",
  "נפלא, עוד כוכב נצבר!",
];

const gentleTryAgain = [
  "כמעט — בוא ננסה שוב יחד.",
  "אפשר לנסות שוב בקצב שלך.",
  "לקחת רגע? אין בעיה, אנחנו כאן.",
];

function randomItem<T>(arr: T[], r: () => number): T {
  return arr[Math.floor(r() * arr.length)]!;
}

type Phase = "playing" | "summary";

export type ChoiceGameClientProps =
  | {
      initialDifficulty: DifficultyKey;
      playableMultipleChoice: MultipleChoicePlayableGame;
      legacyModule?: undefined;
      flagsRegionFilter?: FlagRegionId;
      flagsMissionContextId?: string;
      flagsMissionStepId?: string;
      englishWordsMissionContextId?: string;
      englishWordsMissionStepId?: string;
      spaceMissionContextId?: string;
      spaceMissionStepId?: string;
    }
  | {
      initialDifficulty: DifficultyKey;
      legacyModule: GameModule;
      playableMultipleChoice?: undefined;
      flagsRegionFilter?: FlagRegionId;
      flagsMissionContextId?: string;
      flagsMissionStepId?: string;
      englishWordsMissionContextId?: string;
      englishWordsMissionStepId?: string;
      spaceMissionContextId?: string;
      spaceMissionStepId?: string;
    };

export function ChoiceGameClient(props: ChoiceGameClientProps) {
  const {
    initialDifficulty,
    flagsRegionFilter,
    flagsMissionContextId,
    flagsMissionStepId,
    englishWordsMissionContextId,
    englishWordsMissionStepId,
    spaceMissionContextId,
    spaceMissionStepId,
  } = props;
  const router = useRouter();
  const session =
    props.playableMultipleChoice != null
      ? {
          worldId: props.playableMultipleChoice.worldId,
          slug: props.playableMultipleChoice.slug,
          title: props.playableMultipleChoice.title,
        }
      : {
          worldId: props.legacyModule.worldId,
          slug: props.legacyModule.slug,
          title: props.legacyModule.title,
        };

  const [phase, setPhase] = useState<Phase>("playing");
  const [roundIndex, setRoundIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongClicks, setWrongClicks] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [, setStreak] = useState(0);
  const [inputLocked, setInputLocked] = useState(false);
  const [progressAfterSession, setProgressAfterSession] = useState<AppProgress | null>(null);

  const [difficulty, setDifficulty] = useState<DifficultyKey>(initialDifficulty);
  const [rounds, setRounds] = useState<PlayableMultipleChoiceRound[]>(() => {
    const learning = loadProgress().learningItemsProgress;
    return props.playableMultipleChoice != null
      ? buildRoundsFromPlayableMc(
          props.playableMultipleChoice,
          initialDifficulty,
          learning,
          flagsRegionFilter,
        )
      : buildRoundsFromLegacyModule(props.legacyModule, initialDifficulty, learning);
  });

  const current = rounds[roundIndex];
  const progressLabel = `${roundIndex + 1} / ${rounds.length}`;

  useEffect(() => {
    return () => cancelOngoingSpeech();
  }, [roundIndex]);

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

  const handleCorrect = useCallback(() => {
    setInputLocked(true);
    setMessage(randomItem(praise, Math.random));
    addStars(STARS_PER_CORRECT);
    setCorrectCount((c) => c + 1);

    setStreak((s) => {
      const nextStreak = s + 1;
      if (nextStreak >= STREAK_TO_BUMP) {
        const p = loadProgress();
        const currentD = p.worlds[session.worldId].difficulty;
        const bumped = bumpDifficulty(currentD);
        if (bumped !== currentD) {
          recordWorldDifficulty(session.worldId, bumped);
          setDifficulty(bumped);
        }
        return 0;
      }
      return nextStreak;
    });

    window.setTimeout(() => {
      setRoundIndex((i) => {
        if (i + 1 >= rounds.length) {
          finishSession();
          return i;
        }
        return i + 1;
      });
      setMessage(null);
      setHintUsed(false);
      setInputLocked(false);
    }, 850);
  }, [finishSession, session.worldId, rounds.length]);

  const recordMcOutcomeForSrs = (correct: boolean) => {
    if (!current || !isSrsWorld(session.worldId)) return;
    recordLearningItemOutcome(learningItemKeyMc(session.slug, current.id), correct);
  };

  const handleChoice = (choiceId: string) => {
    if (!current || phase !== "playing" || inputLocked) return;
    if (choiceId === current.correctChoiceId) {
      recordMcOutcomeForSrs(true);
      handleCorrect();
      return;
    }
    recordMcOutcomeForSrs(false);
    setWrongClicks((w) => w + 1);
    setStreak(0);
    setMessage(randomItem(gentleTryAgain, Math.random));
  };

  const applyHint = () => {
    if (!current || hintUsed || inputLocked) return;
    setHintUsed(true);
    setRounds((prev) => {
      const copy = [...prev];
      const r = copy[roundIndex]!;
      const wrong = r.choices.filter((c) => c.id !== r.correctChoiceId);
      if (wrong.length <= 0) return prev;
      const drop = wrong[0]!;
      copy[roundIndex] = {
        ...r,
        choices: r.choices.filter((c) => c.id !== drop.id),
      };
      return copy;
    });
    setMessage("הנה רמז עדין — נשארו פחות אפשרויות.");
  };

  const promptBlock = useMemo(() => {
    if (!current) return null;
    if (current.mapCountry) {
      return (
        <div
          dir={current.direction}
          className="mb-6 rounded-3xl border border-white/20 bg-white/10 px-4 py-5 text-center shadow-inner backdrop-blur sm:px-6"
        >
          <MapCountryQuestionVisual mapCountry={current.mapCountry} caption={current.prompt} />
        </div>
      );
    }
    return (
      <div
        dir={current.direction}
        className="mb-6 rounded-3xl border border-white/20 bg-white/10 px-5 py-6 text-center text-xl font-bold leading-normal shadow-inner backdrop-blur"
      >
        {current.promptVisual ? (
          <div className="mb-4 flex min-h-[4rem] items-center justify-center">
            <ChoicePromptVisual visual={current.promptVisual} />
          </div>
        ) : null}
        <p className="whitespace-pre-line">{current.prompt}</p>
      </div>
    );
  }, [current]);

  if (phase === "summary") {
    const sessionStars = correctCount * STARS_PER_CORRECT;
    const ratio =
      correctCount + wrongClicks > 0
        ? Math.round((correctCount / (correctCount + wrongClicks)) * 100)
        : 100;
    const safeNote =
      wrongClicks > rounds.length
        ? "היה פה מאמץ גדול — בפעם הבאה נעלה בעדינות."
        : "כל הכבוד על הריכוז והסבלנות!";

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
      <KidShell title="סיימנו את המסלול!" subtitle={session.title} backHref="/" backLabel="למסך הבית">
        <div className="mt-6 space-y-6 text-center">
          <p className="text-3xl" aria-live="polite">
            ⭐️ × {sessionStars}
          </p>
          <p className="text-lg text-white/90">{safeNote}</p>
          <p className="text-sm text-white/70">
            דיוק במסלול הזה (בערך): {Math.min(100, Math.max(0, ratio))}%
          </p>
          <p className="text-sm text-white/70">רמת קושי נוכחית בעולם: {difficultyLabel(difficulty)}</p>
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

  const instructionSpeech = current
    ? session.worldId === "englishWords" || session.worldId === "space"
      ? normalizeEnglishInstructionForSpeech(current.prompt)
      : normalizeSpeechText(current.prompt)
    : "";
  const choicesSpeech = current ? joinChoiceLabelsForSpeech(current.choices) : "";

  return (
    <KidShell
      title={session.title}
      subtitle={`כוכבים במסלול — ${progressLabel}`}
      backHref={`/world/${session.worldId}`}
    >
      {(session.slug === "space-planet-order-mc" ||
        session.slug === "space-planet-compare") &&
      current ? (
        <div className="mb-4">
          <SolarOrderHintCard
            variant="compact"
            highlightPlanet={
              session.slug === "space-planet-order-mc"
                ? inferOrderMcHighlightPlanet(current.prompt, current.promptVisual)
                : undefined
            }
          />
        </div>
      ) : null}
      {promptBlock}
      {current ? (
        <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
          <KidListenButton
            worldId={session.worldId}
            text={instructionSpeech}
            label="להקשיב להנחיה"
            variant="primary"
          />
          {choicesSpeech.trim().length > 0 ? (
            <KidListenButton
              worldId={session.worldId}
              text={choicesSpeech}
              label="להקשיב לאפשרויות"
              variant="secondary"
            />
          ) : null}
        </div>
      ) : null}
      {message ? (
        <p
          role="status"
          aria-live="polite"
          className="mb-4 min-h-[3.5rem] rounded-2xl border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-center text-base font-medium text-amber-50"
        >
          {message}
        </p>
      ) : (
        <div className="mb-4 min-h-[3.5rem]" aria-hidden />
      )}
      <div className="flex flex-col gap-3" role="group" aria-label="אפשרויות תשובה">
        {current?.choices.map((c) => (
          <BigChoiceButton
            key={c.id}
            label={c.label}
            emoji={c.emoji}
            imageSrc={c.imageSrc}
            altHe={c.altHe}
            onClick={() => handleChoice(c.id)}
            disabled={inputLocked}
          />
        ))}
      </div>
      <div className="mt-8 flex justify-center gap-3">
        <button
          type="button"
          onClick={applyHint}
          disabled={hintUsed || inputLocked}
          className="min-h-12 rounded-full border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white disabled:opacity-40"
        >
          רוצה רמז?
        </button>
      </div>
    </KidShell>
  );
}

function buildRoundsFromPlayableMc(
  game: MultipleChoicePlayableGame,
  difficulty: DifficultyKey,
  learning?: LearningItemsProgressState,
  flagsRegionFilter?: FlagRegionId,
): PlayableMultipleChoiceRound[] {
  const rawBank = game.banks[difficulty] ?? game.banks.gentle;
  const bankMc =
    game.worldId === "flags" && flagsRegionFilter
      ? filterFlagMultipleChoiceBank(rawBank as MultipleChoiceQuestion[], flagsRegionFilter)
      : rawBank;
  const templates = bankMc.map(mcQuestionToPlayableRound);
  const items = learning?.items ?? {};
  const useSrs = isSrsWorld(game.worldId);
  const ordered = useSrs
    ? orderMcTemplatesForSrs(templates, game.slug, items, new Date())
    : shuffleArray(templates);
  const picked = useSrs
    ? pickRoundsInOrder(ordered, ROUNDS_PER_SESSION)
    : pickRounds(ordered, ROUNDS_PER_SESSION);
  const cap = maxChoicesForDifficulty(difficulty);
  return picked.map((r) => shuffleRoundChoices(r, cap));
}

/** מסלול זמני: ChoiceRound מובנה כמו PlayableMultipleChoiceRound */
function buildRoundsFromLegacyModule(
  game: GameModule,
  difficulty: DifficultyKey,
  learning?: LearningItemsProgressState,
): PlayableMultipleChoiceRound[] {
  const bank = game.banks[difficulty] ?? game.banks.gentle;
  const bankPlayable: PlayableMultipleChoiceRound[] = bank.map((r) => ({
    id: r.id,
    prompt: r.prompt,
    direction: r.direction,
    correctChoiceId: r.correctChoiceId,
    choices: r.choices.map((c) => ({ id: c.id, label: c.label, emoji: c.emoji })),
  }));
  const items = learning?.items ?? {};
  const useSrs = isSrsWorld(game.worldId);
  const ordered = useSrs
    ? orderMcTemplatesForSrs(bankPlayable, game.slug, items, new Date())
    : shuffleArray(bankPlayable);
  const picked = useSrs
    ? pickRoundsInOrder(ordered, ROUNDS_PER_SESSION)
    : pickRounds(ordered, ROUNDS_PER_SESSION);
  const cap = maxChoicesForDifficulty(difficulty);
  return picked.map((r) => shuffleRoundChoices(r, cap));
}

function difficultyLabel(d: DifficultyKey): string {
  switch (d) {
    case "gentle":
      return "עדינה";
    case "steady":
      return "יציבה";
    case "spark":
      return "ניצוצות";
    default:
      return d;
  }
}
