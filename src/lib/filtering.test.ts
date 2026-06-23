import { describe, expect, it } from "vitest";
import { applyFilters, nextSelectedGoalId } from "./filtering";
import type { GoalFilters, GoalRecord } from "./types";

const baseGoal: GoalRecord = {
  id: "g1",
  match: {
    minute: 10,
    homeTeam: "A",
    awayTeam: "B",
    finalHomeGoals: 1,
    finalAwayGoals: 0,
    venue: "Test Stadium",
  },
  participants: {
    scorerName: "Scorer",
    goalkeeperName: "Keeper",
    scoringTeam: "A",
    concedingTeam: "B",
  },
  shot: {
    x: 80,
    y: 50,
    bodyPart: "Right Footed",
    playPattern: "Regular Play",
    xg: 0.1,
    xgot: 0.7,
  },
  goalkeeper: { x: 97, y: 51, depthCategory: "low_depth" },
  goalMouth: {
    y: 50,
    z: 20,
    heightCategory: "mid",
    finishCornerCategory: "mid_center",
  },
  sequence: { isFallback: false, reason: "", events: [] },
  metrics: {
    shotSpeedEstimatedKmh: 90,
    shotSpeedCategory: "high",
    goalkeeperReactionTimeEstimatedS: 0.5,
    reactionTimeCategory: "short",
  },
  tags: {
    tacticalSituationPrimary: "transition_finish",
    vrScenarioFamily: "transition_and_depth_management",
  },
  rawRefs: { sourceFile: "A_B.json", goalEventId: 10, auditAvailable: true },
};

describe("filtering", () => {
  it("filters by search, team, tactical situation, speed, and reaction category", () => {
    const filters: GoalFilters = {
      search: "keeper",
      scoringTeams: ["A"],
      concedingTeams: ["B"],
      goalkeepers: ["Keeper"],
      scorers: [],
      bodyParts: ["Right Footed"],
      playPatterns: ["Regular Play"],
      tacticalSituations: ["transition_finish"],
      vrScenarios: [],
      goalkeeperDepths: [],
      goalMouthHeights: [],
      finishCorners: [],
      shotSpeedCategories: ["high"],
      reactionTimeCategories: ["short"],
      minuteRange: [0, 90],
      warningsOnly: false,
    };

    expect(applyFilters([baseGoal], filters)).toHaveLength(1);
    expect(applyFilters([baseGoal], { ...filters, search: "missing" })).toHaveLength(0);
  });

  it("selects the first filtered goal when the active selection is excluded", () => {
    expect(nextSelectedGoalId([{ ...baseGoal, id: "g2" }], "g1")).toBe("g2");
    expect(nextSelectedGoalId([{ ...baseGoal, id: "g1" }], "g1")).toBe("g1");
    expect(nextSelectedGoalId([], "g1")).toBe("");
  });
});
