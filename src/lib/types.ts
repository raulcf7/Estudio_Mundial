export type Language = "es" | "en";
export type ShotView = "goals" | "all";

export type SequenceEvent = {
  eventId: number | null;
  type: string;
  team: string;
  contestantId: string;
  playerId?: string;
  playerName: string;
  x: number | null;
  y: number | null;
  periodId: number | null;
  minute?: number | null;
  second?: number | null;
  outcome?: string;
  isGoal: boolean;
  isAssist: boolean;
};

export type GoalRecord = {
  id: string;
  match: Record<string, string | number | null>;
  participants: Record<string, string>;
  shot: Record<string, string | number | boolean | null>;
  goalkeeper: Record<string, string | number | null>;
  goalMouth: Record<string, string | number | null>;
  sequence: { isFallback: boolean; reason: string; events: SequenceEvent[] };
  metrics: Record<string, string | number | string[]>;
  tags: Record<string, string | boolean | Record<string, boolean>>;
  rawRefs: Record<string, string | number | boolean | null>;
};

export type GoalFilters = {
  search: string;
  scoringTeams: string[];
  concedingTeams: string[];
  goalkeepers: string[];
  scorers: string[];
  bodyParts: string[];
  playPatterns: string[];
  tacticalSituations: string[];
  vrScenarios: string[];
  goalkeeperDepths: string[];
  goalMouthHeights: string[];
  finishCorners: string[];
  shotSpeedCategories: string[];
  reactionTimeCategories: string[];
  shotView: ShotView;
  minuteRange: [number, number];
  warningsOnly: boolean;
};
