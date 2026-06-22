import { describe, expect, it } from "vitest";

import { buildCourseOutline } from "./build-course-outline";

describe("buildCourseOutline", () => {
  it("groups lessons under their parent modules", () => {
    const result = buildCourseOutline(
      [
        {
          id: "module-1",
          title: "Getting started",
          position: 1,
        },
        {
          id: "module-2",
          title: "Advanced patterns",
          position: 2,
        },
      ],
      [
        {
          id: "lesson-1",
          moduleId: "module-1",
          title: "Welcome",
          type: "text",
          position: 1,
        },
        {
          id: "lesson-2",
          moduleId: "module-1",
          title: "Setup",
          type: "video",
          position: 2,
        },
        {
          id: "lesson-3",
          moduleId: "module-2",
          title: "Architecture",
          type: "text",
          position: 1,
        },
      ],
    );

    expect(result).toEqual([
      {
        id: "module-1",
        title: "Getting started",
        position: 1,
        lessons: [
          {
            id: "lesson-1",
            moduleId: "module-1",
            title: "Welcome",
            type: "text",
            position: 1,
          },
          {
            id: "lesson-2",
            moduleId: "module-1",
            title: "Setup",
            type: "video",
            position: 2,
          },
        ],
      },
      {
        id: "module-2",
        title: "Advanced patterns",
        position: 2,
        lessons: [
          {
            id: "lesson-3",
            moduleId: "module-2",
            title: "Architecture",
            type: "text",
            position: 1,
          },
        ],
      },
    ]);
  });

  it("returns modules with empty lesson arrays when there are no matching lessons", () => {
    const result = buildCourseOutline(
      [
        {
          id: "module-1",
          title: "Getting started",
          position: 1,
        },
      ],
      [],
    );

    expect(result).toEqual([
      {
        id: "module-1",
        title: "Getting started",
        position: 1,
        lessons: [],
      },
    ]);
  });

  it("ignores orphan lessons without a matching module", () => {
    const result = buildCourseOutline(
      [
        {
          id: "module-1",
          title: "Getting started",
          position: 1,
        },
      ],
      [
        {
          id: "lesson-1",
          moduleId: "missing-module",
          title: "Orphan lesson",
          type: "text",
          position: 1,
        },
      ],
    );

    expect(result[0].lessons).toEqual([]);
  });
});