import { describe, expect, it } from "vitest";

import { formatDistance } from "./format";

describe("formatDistance", () => {
  it("formats finite meter values with one decimal", () => {
    expect(formatDistance(18.553)).toBe("18.6 m");
  });

  it("falls back for missing or non-finite values", () => {
    expect(formatDistance(null)).toBe("-");
    expect(formatDistance(Number.NaN)).toBe("-");
  });
});
