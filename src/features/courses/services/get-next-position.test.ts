import { describe, expect, it } from "vitest";

import { getNextPosition } from "./get-next-position";

describe("getNextPosition", () => {
  it("returns 1 for an empty list", () => {
    expect(getNextPosition([])).toBe(1);
  });

  it("returns the next position after the highest existing position", () => {
    expect(
      getNextPosition([{ position: 1 }, { position: 2 }, { position: 3 }]),
    ).toBe(4);
  });

  it("does not assume the input is already sorted", () => {
    expect(
      getNextPosition([{ position: 10 }, { position: 2 }, { position: 7 }]),
    ).toBe(11);
  });
});
