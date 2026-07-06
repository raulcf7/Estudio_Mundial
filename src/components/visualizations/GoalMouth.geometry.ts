const GOAL_MOUTH_Y_MIN = 44.6;
const GOAL_MOUTH_Y_MAX = 55.4;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function goalMouthWidgetLateralPercent(value: unknown) {
  const numeric = typeof value === "number" && Number.isFinite(value) ? value : 50;
  const normalized = ((numeric - GOAL_MOUTH_Y_MIN) / (GOAL_MOUTH_Y_MAX - GOAL_MOUTH_Y_MIN)) * 100;
  return Number((100 - clamp(normalized, 0, 100)).toFixed(2));
}
