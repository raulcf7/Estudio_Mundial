import { normalizeGoalPitchCoordinate } from "./geometry";
import type { GoalRecord } from "./types";

const METERS_PER_OPTA_X = 1.05;
const METERS_PER_OPTA_Y = 0.68;

function finiteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function optaDistanceToMeters(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot((a.x - b.x) * METERS_PER_OPTA_X, (a.y - b.y) * METERS_PER_OPTA_Y);
}

export function categorizeReactionTime(seconds: number) {
  if (seconds < 0.35) return "very_short";
  if (seconds < 0.55) return "short";
  if (seconds <= 0.8) return "medium";
  return "long";
}

export function getDisplayGoalMetrics(goal: GoalRecord) {
  const ownGoal = goal.shot.ownGoal === true;
  const shot = normalizeGoalPitchCoordinate({ x: goal.shot.x, y: goal.shot.y }, ownGoal);
  const goalkeeper = {
    x: finiteNumber(goal.goalkeeper.x),
    y: finiteNumber(goal.goalkeeper.y),
  };
  let shotDistanceToGoalM = finiteNumber(goal.metrics.shotDistanceToGoalM);
  let goalkeeperDistanceToShooterM = finiteNumber(goal.goalkeeper.distanceToShooterRaw);

  if (shot.x !== null && shot.y !== null) {
    const shotCoordinate = { x: shot.x, y: shot.y };
    shotDistanceToGoalM = optaDistanceToMeters(shotCoordinate, { x: 100, y: 50 });

    if (goalkeeper.x !== null && goalkeeper.y !== null) {
      goalkeeperDistanceToShooterM = optaDistanceToMeters(shotCoordinate, {
        x: goalkeeper.x,
        y: goalkeeper.y,
      });
    }
  }

  const goalkeeperDistanceToGoalLineM =
    goalkeeper.x === null
      ? finiteNumber(goal.goalkeeper.distanceToGoalLineRaw)
      : Math.abs(100 - goalkeeper.x) * METERS_PER_OPTA_X;

  const shotSpeedMps = finiteNumber(goal.metrics.shotSpeedEstimatedMps);
  const goalkeeperReactionTimeEstimatedS =
    shotDistanceToGoalM === null || shotSpeedMps === null || shotSpeedMps <= 0
      ? finiteNumber(goal.metrics.goalkeeperReactionTimeEstimatedS)
      : shotDistanceToGoalM / shotSpeedMps;

  return {
    shotDistanceToGoalM,
    goalkeeperDistanceToShooterM,
    goalkeeperDistanceToGoalLineM,
    goalkeeperReactionTimeEstimatedS,
    reactionTimeCategory:
      goalkeeperReactionTimeEstimatedS === null
        ? String(goal.metrics.reactionTimeCategory ?? "")
        : categorizeReactionTime(goalkeeperReactionTimeEstimatedS),
  };
}
