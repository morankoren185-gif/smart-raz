"use client";

import type { GameModule } from "@/content/index";
import {
  MISSION_PLAY_LEVEL_QUERY,
  parseMissionPlayLevelParam,
} from "@/lib/progress/mission-recommended-difficulty";
import { useAppProgress } from "@/lib/progress/storage";
import type { MultipleChoicePlayableGame } from "@/lib/play/multipleChoicePlayableGame";
import type { MatchingPlayableGame } from "@/lib/play/matchingPlayableGame";
import {
  FLAG_REGION_QUERY_PARAM,
  parseFlagRegionQueryParam,
} from "@/lib/flags/flag-region-play-filter";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ChoiceGameClient } from "./ChoiceGameClient";
import { MatchingGameClient } from "./MatchingGameClient";

export type PlayGameClientProps =
  | { playableMultipleChoice: MultipleChoicePlayableGame; playableMatching?: never; legacyModule?: never }
  | { playableMatching: MatchingPlayableGame; playableMultipleChoice?: never; legacyModule?: never }
  | { legacyModule: GameModule; playableMultipleChoice?: never; playableMatching?: never };

function PlayGameClientInner(props: PlayGameClientProps) {
  const progress = useAppProgress();
  const search = useSearchParams();
  const flagsMissionContextId =
    search.get("flagsMission")?.trim().replace(/\/+$/, "") || undefined;
  const flagsMissionStepId = search.get("flagsStep")?.trim() || undefined;
  const englishWordsMissionContextId =
    search.get("wordMission")?.trim().replace(/\/+$/, "") || undefined;
  const englishWordsMissionStepId = search.get("wordStep")?.trim() || undefined;
  const spaceMissionContextId =
    search.get("spaceMission")?.trim().replace(/\/+$/, "") || undefined;
  const spaceMissionStepId = search.get("spaceStep")?.trim() || undefined;

  const worldId =
    props.playableMultipleChoice != null
      ? props.playableMultipleChoice.worldId
      : props.playableMatching != null
        ? props.playableMatching.worldId
        : props.legacyModule.worldId;

  const fromMission = parseMissionPlayLevelParam(search.get(MISSION_PLAY_LEVEL_QUERY));
  const initialDifficulty = fromMission ?? progress.worlds[worldId].difficulty;
  const flagsRegionFilter =
    worldId === "flags" ? parseFlagRegionQueryParam(search.get(FLAG_REGION_QUERY_PARAM)) : undefined;

  if (props.playableMultipleChoice != null) {
    return (
      <ChoiceGameClient
        playableMultipleChoice={props.playableMultipleChoice}
        initialDifficulty={initialDifficulty}
        flagsRegionFilter={flagsRegionFilter}
        flagsMissionContextId={flagsMissionContextId}
        flagsMissionStepId={flagsMissionStepId}
        englishWordsMissionContextId={englishWordsMissionContextId}
        englishWordsMissionStepId={englishWordsMissionStepId}
        spaceMissionContextId={spaceMissionContextId}
        spaceMissionStepId={spaceMissionStepId}
      />
    );
  }

  if (props.playableMatching != null) {
    return (
      <MatchingGameClient
        playable={props.playableMatching}
        initialDifficulty={initialDifficulty}
        flagsRegionFilter={flagsRegionFilter}
        flagsMissionContextId={flagsMissionContextId}
        flagsMissionStepId={flagsMissionStepId}
        englishWordsMissionContextId={englishWordsMissionContextId}
        englishWordsMissionStepId={englishWordsMissionStepId}
        spaceMissionContextId={spaceMissionContextId}
        spaceMissionStepId={spaceMissionStepId}
      />
    );
  }

  return (
    <ChoiceGameClient
      legacyModule={props.legacyModule}
      initialDifficulty={initialDifficulty}
      flagsMissionContextId={flagsMissionContextId}
      flagsMissionStepId={flagsMissionStepId}
      englishWordsMissionContextId={englishWordsMissionContextId}
      englishWordsMissionStepId={englishWordsMissionStepId}
      spaceMissionContextId={spaceMissionContextId}
      spaceMissionStepId={spaceMissionStepId}
    />
  );
}

export function PlayGameClient(props: PlayGameClientProps) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-slate-950" aria-hidden />}>
      <PlayGameClientInner {...props} />
    </Suspense>
  );
}
