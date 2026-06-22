import { describe, expect, it } from "vitest";

import { slugify } from "./slugify";

describe("slugify", () => {
  it("converts a title into a URL-safe slug", () => {
    expect(slugify("Advanced React Performance")).toBe(
      "advanced-react-performance",
    );
  });

  it("trims spaces and removes duplicated separators", () => {
    expect(slugify("  Build   Better   Courses  ")).toBe(
      "build-better-courses",
    );
  });

  it("removes quotes", () => {
    expect(slugify(`"React" Course`)).toBe("react-course");
  });

  it("removes leading and trailing separators", () => {
    expect(slugify("---React Architecture---")).toBe("react-architecture");
  });
});