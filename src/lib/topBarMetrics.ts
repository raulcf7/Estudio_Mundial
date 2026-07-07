import type { GoalRecord, ShotView } from "./types";

export function average(goals: GoalRecord[], selector: (goal: GoalRecord) => unknown) {
  const values = goals
    .map(selector)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

export function goalsForShooterGoalkeeperDistance(goals: GoalRecord[], shotView: ShotView) {
  return shotView === "goals" ? goals.filter((goal) => goal.shot.isGoal === true) : goals;
}
