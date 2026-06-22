import { describe, expect, it } from "vitest";

import { calculateProgressPercent } from "./calculate-progress";

describe("calculateProgressPercent", () => {
  it("returns 0 when course has no lessons", () => {
    expect(calculateProgressPercent(0, 0)).toBe(0);
  });

  it("returns 0 when no lessons are completed", () => {
    expect(calculateProgressPercent(0, 10)).toBe(0);
  });

  it("calculates rounded progress percentage", () => {
    expect(calculateProgressPercent(2, 3)).toBe(67);
  });

  it("returns 100 when all lessons are completed", () => {
    expect(calculateProgressPercent(10, 10)).toBe(100);
  });

  it("caps progress at 100", () => {
    expect(calculateProgressPercent(12, 10)).toBe(100);
  });
});