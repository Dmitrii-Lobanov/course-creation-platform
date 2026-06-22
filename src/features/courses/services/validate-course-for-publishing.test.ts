import { describe, expect, it } from "vitest";

import { validateCourseForPublishing } from "./validate-course-for-publishing";

describe("validateCourseForPublishing", () => {
  const validCourse = {
    title: "React Performance Masterclass",
    description: "A practical course about optimizing React applications.",
    level: "intermediate" as const,
  };

  it("accepts a course with at least one module and valid lessons", () => {
    const result = validateCourseForPublishing(validCourse, [
      {
        title: "Getting started",
        lessons: [
          {
            title: "Welcome",
            type: "text",
            content: "Welcome to the course.",
          },
          {
            title: "Setup video",
            type: "video",
            content: null,
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
        title: "Getting started",
        lessons: [],
      },
    ]);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Module "Getting started" must have at least one lesson.',
    );
  });

  it("rejects text lessons without content", () => {
    const result = validateCourseForPublishing(validCourse, [
      {
        title: "Getting started",
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
        title: "Getting started",
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

  it("collects multiple validation errors", () => {
    const result = validateCourseForPublishing(
      {
        title: "",
        description: "",
        level: "beginner",
      },
      [
        {
          title: "",
          lessons: [
            {
              title: "",
              type: "text",
              content: null,
            },
          ],
        },
      ],
    );

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "Course title is required.",
        "Course description is required.",
        "Each module must have a title.",
        'Module "" has a lesson without a title.',
        'Text lesson "Untitled lesson" must have content.',
      ]),
    );
  });
});