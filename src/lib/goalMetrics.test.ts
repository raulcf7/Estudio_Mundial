import { describe, expect, it } from "vitest";

import { getDisplayGoalMetrics } from "./goalMetrics";
import type { GoalRecord } from "./types";

function goal(overrides: Partial<GoalRecord>): GoalRecord {
  return {
    id: "goal",
    match: {},
    participants: {},
    shot: {},
    goalkeeper: {},
    goalMouth: {},
    sequence: { isFallback: false, reason: "", events: [] },
    metrics: {},
    tags: {},
    rawRefs: {},
    ...overrides,
  } as GoalRecord;
}

describe("getDisplayGoalMetrics", () => {
  it("recomputes own-goal distances and reaction time from the mirrored shot", () => {
    const metrics = getDisplayGoalMetrics(
      goal({
        shot: { x: 4.6, y: 44.9, ownGoal: true },
        goalkeeper: { x: 99.1, y: 51.3, distanceToGoalLineRaw: 0.9 },
        metrics: {
          shotDistanceToGoalM: 100.23,
          shotSpeedEstimatedMps: 17.78,
          goalkeeperReactionTimeEstimatedS: 5.64,
          reactionTimeCategory: "long",
        },
      }),
    );

    expect(metrics.shotDistanceToGoalM).toBeCloseTo(5.95, 2);
    expect(metrics.goalkeeperDistanceToShooterM).toBeCloseTo(4.67, 2);
    expect(metrics.goalkeeperDistanceToGoalLineM).toBeCloseTo(0.95, 2);
    expect(metrics.goalkeeperReactionTimeEstimatedS).toBeCloseTo(0.33, 2);
    expect(metrics.reactionTimeCategory).toBe("very_short");
  });

  it("keeps regular-goal shot distance and reaction aligned with the source model", () => {
    const metrics = getDisplayGoalMetrics(
      goal({
        shot: { x: 79.3, y: 55.6, ownGoal: false },
        goalkeeper: { x: 97.3, y: 51.1, distanceToGoalLineRaw: 2.7 },
        metrics: {
          shotDistanceToGoalM: 22.07,
          shotSpeedEstimatedMps: 23.89,
          goalkeeperReactionTimeEstimatedS: 0.92,
          reactionTimeCategory: "long",
        },
      }),
    );

    expect(metrics.shotDistanceToGoalM).toBeCloseTo(22.07, 2);
    expect(metrics.goalkeeperReactionTimeEstimatedS).toBeCloseTo(0.92, 2);
    expect(metrics.reactionTimeCategory).toBe("long");
  });
});
