type OptaCoordinate = {
  x: unknown;
  y: unknown;
};

function finiteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function mirrorOptaValue(value: unknown) {
  const numeric = finiteNumber(value);
  return numeric === null ? null : Number((100 - numeric).toFixed(2));
}

export function mirrorOptaCoordinate({ x, y }: OptaCoordinate) {
  return {
    x: mirrorOptaValue(x),
    y: mirrorOptaValue(y),
  };
}

export function normalizeGoalPitchCoordinate(coordinate: OptaCoordinate, ownGoal: boolean) {
  if (ownGoal) return mirrorOptaCoordinate(coordinate);

  return {
    x: finiteNumber(coordinate.x),
    y: finiteNumber(coordinate.y),
  };
}

export function normalizeGoalMouthY(goalMouthY: unknown, ownGoal: boolean) {
  return ownGoal ? mirrorOptaValue(goalMouthY) : finiteNumber(goalMouthY);
}

export function pitchPoint(optaX: number | null, optaY: number | null, _width?: number, _height?: number) {
  const x = optaX ?? 0;
  const y = optaY ?? 0;
  return {
    x: Number(((y / 100) * 68).toFixed(2)),
    y: Number((((x / 100) * 105) - 52.5).toFixed(2)),
  };
}

export function fullPitchPoint(optaX: number | null, optaY: number | null) {
  const x = optaX ?? 0;
  const y = optaY ?? 0;
  return {
    x: Number((32 + (x / 100) * 936).toFixed(2)),
    y: Number((32 + (y / 100) * 616).toFixed(2)),
  };
}

export function goalMouthPoint(
  goalMouthY: number | null,
  goalMouthZ: number | null,
  width: number,
  height: number,
) {
  return {
    x: Math.round(((goalMouthY ?? 50) / 100) * width),
    y: Math.round(height - ((goalMouthZ ?? 0) / 100) * height),
  };
}
