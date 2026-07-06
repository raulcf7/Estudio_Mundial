import { describe, expect, it } from "vitest";

import { goalMouthWidgetLateralPercent } from "./GoalMouth.geometry";

describe("GoalMouth widget geometry", () => {
  it("mirrors and clamps lateral positions only inside the goal-mouth widget", () => {
    expect(goalMouthWidgetLateralPercent(44.6)).toBe(100);
    expect(goalMouthWidgetLateralPercent(55.4)).toBe(0);
    expect(goalMouthWidgetLateralPercent(50)).toBe(50);
    expect(goalMouthWidgetLateralPercent(60)).toBe(0);
  });
});
