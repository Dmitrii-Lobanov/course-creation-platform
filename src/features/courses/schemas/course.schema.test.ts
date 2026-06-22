import { describe, expect, it } from "vitest";

import { createCourseSchema } from "./course.schema";

describe("createCourseSchema", () => {
  it("accepts valid course input", () => {
    const result = createCourseSchema.safeParse({
      title: "Advanced React Performance",
      description:
        "A practical course about diagnosing and optimizing React application performance.",
      level: "advanced",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a title shorter than 3 characters", () => {
    const result = createCourseSchema.safeParse({
      title: "JS",
      description:
        "A practical course about diagnosing and optimizing React application performance.",
      level: "advanced",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title?.[0]).toBe(
        "Course title must be at least 3 characters.",
      );
    }
  });

  it("rejects a short description", () => {
    const result = createCourseSchema.safeParse({
      title: "React Performance",
      description: "Too short",
      level: "advanced",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.description?.[0]).toBe(
        "Course description must be at least 20 characters.",
      );
    }
  });

  it("rejects an unsupported level", () => {
    const result = createCourseSchema.safeParse({
      title: "React Performance",
      description:
        "A practical course about diagnosing and optimizing React application performance.",
      level: "expert",
    });

    expect(result.success).toBe(false);
  });
});