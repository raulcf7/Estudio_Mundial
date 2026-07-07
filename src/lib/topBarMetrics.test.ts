import { describe, expect, it } from "vitest";

import { average, goalsForShooterGoalkeeperDistance } from "./topBarMetrics";
import type { GoalRecord } from "./types";

function goal(id: string, isGoal: boolean, distance: number | null): GoalRecord {
  return {
    id,
    match: {},
    participants: {},
    shot: { isGoal },
    goalkeeper: { distanceToShooterRaw: distance },
    goalMouth: {},
    sequence: { isFallback: false, reason: "", events: [] },
    metrics: {},
    tags: {},
    rawRefs: {},
  } as GoalRecord;
}

describe("top bar metrics", () => {
  it("uses every visible shot for shooter-goalkeeper distance in all-shots mode", () => {
    const goals = [goal("g1", true, 2), goal("s1", false, 6), goal("s2", false, 10)];

    const selected = goalsForShooterGoalkeeperDistance(goals, "all");

    expect(selected.map((item) => item.id)).toEqual(["g1", "s1", "s2"]);
    expect(average(selected, (item) => item.goalkeeper.distanceToShooterRaw)).toBe(6);
  });

  it("keeps goal shots for shooter-goalkeeper distance in goals-only mode", () => {
    const goals = [goal("g1", true, 2), goal("s1", false, 10)];

    expect(goalsForShooterGoalkeeperDistance(goals, "goals").map((item) => item.id)).toEqual(["g1"]);
  });
});
