import { describe, expect, it } from "vitest";
import { labelFor, t } from "./i18n";

describe("i18n", () => {
  it("translates UI keys in Spanish and English", () => {
    expect(t("es", "goals")).toBe("Goles");
    expect(t("en", "goals")).toBe("Goals");
  });

  it("translates known internal values and falls back to raw value", () => {
    expect(labelFor("es", "transition_finish")).toBe("Finalización en transición");
    expect(labelFor("en", "low_depth")).toBe("Low depth");
    expect(labelFor("es", "unknown_code")).toBe("unknown_code");
  });
});
