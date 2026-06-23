import { describe, expect, it } from "vitest";
import { goalMouthPoint, mirrorOptaCoordinate, normalizeGoalMouthY, normalizeGoalPitchCoordinate, pitchPoint } from "./geometry";

describe("geometry", () => {
  it("maps Opta pitch coordinates into SVG bounds", () => {
    expect(pitchPoint(0, 0)).toEqual({ x: 0, y: -52.5 });
    expect(pitchPoint(100, 100)).toEqual({ x: 68, y: 52.5 });
    expect(pitchPoint(50, 50)).toEqual({ x: 34, y: 0 });
  });

  it("maps goal-mouth y and z into a front goal projection", () => {
    expect(goalMouthPoint(50, 0, 732, 244)).toEqual({ x: 366, y: 244 });
    expect(goalMouthPoint(0, 100, 732, 244)).toEqual({ x: 0, y: 0 });
    expect(goalMouthPoint(100, 100, 732, 244)).toEqual({ x: 732, y: 0 });
  });

  it("mirrors Opta pitch coordinates for own goals", () => {
    expect(mirrorOptaCoordinate({ x: 4.6, y: 44.9 })).toEqual({ x: 95.4, y: 55.1 });
    expect(normalizeGoalPitchCoordinate({ x: 4.6, y: 44.9 }, true)).toEqual({ x: 95.4, y: 55.1 });
    expect(normalizeGoalPitchCoordinate({ x: 79.3, y: 55.6 }, false)).toEqual({ x: 79.3, y: 55.6 });
  });

  it("mirrors only the lateral goal-mouth axis for own goals", () => {
    expect(normalizeGoalMouthY(46.4, true)).toBe(53.6);
    expect(normalizeGoalMouthY(46.4, false)).toBe(46.4);
    expect(normalizeGoalMouthY(null, true)).toBeNull();
  });
});
