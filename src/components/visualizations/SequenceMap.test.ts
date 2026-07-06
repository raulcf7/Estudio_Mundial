import { describe, expect, it } from "vitest";

import { sequenceMapWidgetCoordinate } from "./SequenceMap.geometry";

describe("SequenceMap widget geometry", () => {
  it("mirrors only the lateral axis inside the sequence widget", () => {
    expect(sequenceMapWidgetCoordinate({ x: 20, y: 35 })).toEqual({ x: 20, y: 65 });
    expect(sequenceMapWidgetCoordinate({ x: 100, y: 50 })).toEqual({ x: 100, y: 50 });
    expect(sequenceMapWidgetCoordinate({ x: null, y: null })).toEqual({ x: null, y: null });
  });
});
