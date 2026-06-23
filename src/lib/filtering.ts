import { getDisplayGoalMetrics } from "./goalMetrics";
import type { GoalFilters, GoalRecord } from "./types";

function includesOrEmpty(values: string[], value: unknown) {
  return values.length === 0 || values.includes(String(value ?? ""));
}

function hasWarning(goal: GoalRecord) {
  return Object.values(goal.tags).some((value) => value === true);
}

export function applyFilters(goals: GoalRecord[], filters: GoalFilters) {
  const query = filters.search.trim().toLowerCase();
  return goals.filter((goal) => {
    const minute = Number(goal.match.minute ?? 0);
    const searchable = [
      goal.id,
      goal.participants.scorerName,
      goal.participants.goalkeeperName,
      goal.participants.scoringTeam,
      goal.participants.concedingTeam,
      goal.match.homeTeam,
      goal.match.awayTeam,
      goal.match.venue,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      minute >= filters.minuteRange[0] &&
      minute <= filters.minuteRange[1] &&
      includesOrEmpty(filters.scoringTeams, goal.participants.scoringTeam) &&
      includesOrEmpty(filters.concedingTeams, goal.participants.concedingTeam) &&
      includesOrEmpty(filters.goalkeepers, goal.participants.goalkeeperName) &&
      includesOrEmpty(filters.scorers, goal.participants.scorerName) &&
      includesOrEmpty(filters.bodyParts, goal.shot.bodyPart) &&
      includesOrEmpty(filters.playPatterns, goal.shot.playPattern) &&
      includesOrEmpty(filters.tacticalSituations, goal.tags.tacticalSituationPrimary) &&
      includesOrEmpty(filters.vrScenarios, goal.tags.vrScenarioFamily) &&
      includesOrEmpty(filters.goalkeeperDepths, goal.goalkeeper.depthCategory) &&
      includesOrEmpty(filters.goalMouthHeights, goal.goalMouth.heightCategory) &&
      includesOrEmpty(filters.finishCorners, goal.goalMouth.finishCornerCategory) &&
      includesOrEmpty(filters.shotSpeedCategories, goal.metrics.shotSpeedCategory) &&
      includesOrEmpty(filters.reactionTimeCategories, getDisplayGoalMetrics(goal).reactionTimeCategory) &&
      (!filters.warningsOnly || hasWarning(goal))
    );
  });
}

export function nextSelectedGoalId(filteredGoals: GoalRecord[], selectedGoalId: string) {
  if (filteredGoals.some((goal) => goal.id === selectedGoalId)) return selectedGoalId;
  return filteredGoals[0]?.id ?? "";
}
