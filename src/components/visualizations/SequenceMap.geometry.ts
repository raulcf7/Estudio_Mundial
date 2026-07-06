type Coordinate = {
  x: number | null;
  y: number | null;
};

export function sequenceMapWidgetCoordinate(coordinate: Coordinate): Coordinate {
  return {
    x: coordinate.x,
    y: coordinate.y === null ? null : Number((100 - coordinate.y).toFixed(2)),
  };
}
