import { describe, expect, it } from "vitest";

import { validateCourseForPublishing } from "./validate-course-for-publishing";

describe("validateCourseForPublishing", () => {
  const validCourse = {
    title: "React Performance Masterclass",
    description: "A practical course about optimizing React applications.",
    level: "intermediate" as const,
  };

  it("accepts a course with modules and valid lessons", () => {
    const result = validateCourseForPublishing(validCourse, [
      {
        title: "Getting started",
        lessons: [
          {
            title: "Welcome",
            type: "text",
            content: "Welcome to the course.",
          },
        ],
      },
    ]);

    expect(result).toEqual({
      isValid: true,
      errors: [],
    });
  });

  it("rejects a course without modules", () => {
    const result = validateCourseForPublishing(validCourse, []);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Course must have at least one module.");
  });

  it("rejects modules without lessons", () => {
    const result = validateCourseForPublishing(validCourse, [
      {
        title: "Introduction",
        lessons: [],
      },
    ]);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Module "Introduction" must have at least one lesson.',
    );
  });

  it("rejects text lessons without content", () => {
    const result = validateCourseForPublishing(validCourse, [
      {
        title: "Introduction",
        lessons: [
          {
            title: "Welcome",
            type: "text",
            content: "   ",
          },
        ],
      },
    ]);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Text lesson "Welcome" must have content.');
  });

  it("allows video lessons without text content", () => {
    const result = validateCourseForPublishing(validCourse, [
      {
        title: "Introduction",
        lessons: [
          {
            title: "Intro video",
            type: "video",
            content: null,
          },
        ],
      },
    ]);

    expect(result.isValid).toBe(true);
  });
});