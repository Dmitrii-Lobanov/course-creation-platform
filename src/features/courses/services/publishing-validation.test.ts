import { describe, expect, it } from "vitest";

import { validateCourseForPublishing } from "./publishing-validation";

describe("validateCourseForPublishing", () => {
  it("returns no issues for a valid course", () => {
    const issues = validateCourseForPublishing({
      title: "Advanced React Performance",
      description: "A practical course about React performance.",
      modules: [
        {
          id: "module-1",
          title: "Rendering fundamentals",
          lessons: [
            {
              id: "lesson-1",
              title: "Render and commit phases",
              content: "Lesson content",
            },
          ],
        },
      ],
    });

    expect(issues).toEqual([]);
  });

  it("requires at least one module", () => {
    const issues = validateCourseForPublishing({
      title: "Advanced React Performance",
      description: "A practical course about React performance.",
      modules: [],
    });

    expect(issues).toContainEqual({
      field: "modules",
      message: "Course must have at least one module.",
    });
  });

  it("requires at least one lesson", () => {
    const issues = validateCourseForPublishing({
      title: "Advanced React Performance",
      description: "A practical course about React performance.",
      modules: [
        {
          id: "module-1",
          title: "Rendering fundamentals",
          lessons: [],
        },
      ],
    });

    expect(issues).toContainEqual({
      field: "lessons",
      message: "Course must have at least one lesson.",
    });
  });

  it("reports missing nested module and lesson fields", () => {
    const issues = validateCourseForPublishing({
      title: "",
      description: "",
      modules: [
        {
          id: "module-1",
          title: "",
          lessons: [
            {
              id: "lesson-1",
              title: "",
              content: "",
            },
          ],
        },
      ],
    });

    expect(issues).toEqual([
      {
        field: "title",
        message: "Course title is required.",
      },
      {
        field: "description",
        message: "Course description is required.",
      },
      {
        field: "modules.0.title",
        message: "Module title is required.",
      },
      {
        field: "modules.0.lessons.0.title",
        message: "Lesson title is required.",
      },
      {
        field: "modules.0.lessons.0.content",
        message: "Lesson content is required.",
      },
    ]);
  });
});
