import { randomUUID } from "node:crypto";

import { beforeEach, describe, expect, it } from "vitest";

import { db } from "@/db/client";
import { courseModules, courses, lessons } from "@/db/schema";
import { resetDatabase } from "@/test/integration/reset-database";

import { getCourseBuilderData } from "./get-course-builder-data";

describe("getCourseBuilderData integration", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("returns null when the course does not exist", async () => {
    const result = await getCourseBuilderData(randomUUID());

    expect(result).toBeNull();
  });

  it("returns course builder data with modules and lessons grouped by module", async () => {
    const [course] = await db
      .insert(courses)
      .values({
        title: "React Performance Masterclass",
        description: "A practical course about optimizing React applications.",
        level: "advanced",
        status: "draft",
      })
      .returning({
        id: courses.id,
      });

    const [advancedModule] = await db
      .insert(courseModules)
      .values({
        courseId: course.id,
        title: "Advanced rendering",
        position: 2,
      })
      .returning({
        id: courseModules.id,
      });

    const [introModule] = await db
      .insert(courseModules)
      .values({
        courseId: course.id,
        title: "Introduction",
        position: 1,
      })
      .returning({
        id: courseModules.id,
      });

    await db.insert(lessons).values([
      {
        moduleId: introModule.id,
        title: "Welcome",
        type: "text",
        content: "Welcome to the course.",
        position: 1,
      },
      {
        moduleId: introModule.id,
        title: "Setup",
        type: "video",
        content: null,
        position: 2,
      },
      {
        moduleId: advancedModule.id,
        title: "Avoiding re-render cascades",
        type: "text",
        content: "Use stable selectors and state boundaries.",
        position: 1,
      },
    ]);

    const result = await getCourseBuilderData(course.id);

    expect(result).not.toBeNull();

    expect(result?.course).toMatchObject({
      id: course.id,
      title: "React Performance Masterclass",
      description: "A practical course about optimizing React applications.",
      level: "advanced",
      status: "draft",
    });

    expect(result?.modules).toEqual([
      {
        id: introModule.id,
        title: "Introduction",
        position: 1,
        lessons: [
          {
            id: expect.any(String),
            moduleId: introModule.id,
            title: "Welcome",
            type: "text",
            position: 1,
          },
          {
            id: expect.any(String),
            moduleId: introModule.id,
            title: "Setup",
            type: "video",
            position: 2,
          },
        ],
      },
      {
        id: advancedModule.id,
        title: "Advanced rendering",
        position: 2,
        lessons: [
          {
            id: expect.any(String),
            moduleId: advancedModule.id,
            title: "Avoiding re-render cascades",
            type: "text",
            position: 1,
          },
        ],
      },
    ]);
  });
});
