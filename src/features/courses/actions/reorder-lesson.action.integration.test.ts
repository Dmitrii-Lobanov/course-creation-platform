import { asc, eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/db/client";
import { courseModules, courses, lessons } from "@/db/schema";
import { resetDatabase } from "@/test/integration/reset-database";

import { reorderLessonAction } from "./reorder-lesson.action";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("reorderLessonAction", () => {
  beforeEach(async () => {
    await resetDatabase();
    vi.clearAllMocks();
  });

  it("returns validation errors for invalid input", async () => {
    const formData = new FormData();

    formData.set("lessonId", "not-a-valid-lesson-id");
    formData.set("moduleId", "not-a-valid-module-id");
    formData.set("direction", "sideways");

    const result = await reorderLessonAction({}, formData);

    expect(result.errors?.lessonId).toBeDefined();
    expect(result.errors?.moduleId).toBeDefined();
    expect(result.errors?.direction).toBeDefined();
    expect(result.success).toBeUndefined();
  });

  it("moves a draft course lesson up inside its module", async () => {
    const [course] = await db
      .insert(courses)
      .values({
        title: "React Performance",
        description: "A course about React performance.",
        level: "advanced",
        status: "draft",
      })
      .returning({ id: courses.id });

    const [module] = await db
      .insert(courseModules)
      .values({
        courseId: course.id,
        title: "Rendering fundamentals",
        position: 1,
      })
      .returning({ id: courseModules.id });

    const insertedLessons = await db
      .insert(lessons)
      .values([
        {
          moduleId: module.id,
          title: "First lesson",
          type: "text",
          content: "First lesson content",
          position: 1,
        },
        {
          moduleId: module.id,
          title: "Second lesson",
          type: "text",
          content: "Second lesson content",
          position: 2,
        },
      ])
      .returning({
        id: lessons.id,
        title: lessons.title,
      });

    const secondLesson = insertedLessons.find(
      (lesson) => lesson.title === "Second lesson",
    );

    expect(secondLesson).toBeDefined();

    const formData = new FormData();

    formData.set("lessonId", secondLesson!.id);
    formData.set("moduleId", module.id);
    formData.set("direction", "up");

    const result = await reorderLessonAction({}, formData);

    expect(result).toEqual({
      success: true,
    });

    const reorderedLessons = await db
      .select({
        title: lessons.title,
        position: lessons.position,
      })
      .from(lessons)
      .where(eq(lessons.moduleId, module.id))
      .orderBy(asc(lessons.position));

    expect(reorderedLessons).toEqual([
      {
        title: "Second lesson",
        position: 1,
      },
      {
        title: "First lesson",
        position: 2,
      },
    ]);
  });

  it("moves a draft course lesson down inside its module", async () => {
    const [course] = await db
      .insert(courses)
      .values({
        title: "React Performance",
        description: "A course about React performance.",
        level: "advanced",
        status: "draft",
      })
      .returning({ id: courses.id });

    const [module] = await db
      .insert(courseModules)
      .values({
        courseId: course.id,
        title: "Rendering fundamentals",
        position: 1,
      })
      .returning({ id: courseModules.id });

    const insertedLessons = await db
      .insert(lessons)
      .values([
        {
          moduleId: module.id,
          title: "First lesson",
          type: "text",
          content: "First lesson content",
          position: 1,
        },
        {
          moduleId: module.id,
          title: "Second lesson",
          type: "text",
          content: "Second lesson content",
          position: 2,
        },
      ])
      .returning({
        id: lessons.id,
        title: lessons.title,
      });

    const firstLesson = insertedLessons.find(
      (lesson) => lesson.title === "First lesson",
    );

    expect(firstLesson).toBeDefined();

    const formData = new FormData();

    formData.set("lessonId", firstLesson!.id);
    formData.set("moduleId", module.id);
    formData.set("direction", "down");

    const result = await reorderLessonAction({}, formData);

    expect(result).toEqual({
      success: true,
    });

    const reorderedLessons = await db
      .select({
        title: lessons.title,
        position: lessons.position,
      })
      .from(lessons)
      .where(eq(lessons.moduleId, module.id))
      .orderBy(asc(lessons.position));

    expect(reorderedLessons).toEqual([
      {
        title: "Second lesson",
        position: 1,
      },
      {
        title: "First lesson",
        position: 2,
      },
    ]);
  });

  it("does not reorder lessons from a published course", async () => {
    const [course] = await db
      .insert(courses)
      .values({
        title: "React Performance",
        description: "A course about React performance.",
        level: "advanced",
        status: "published",
      })
      .returning({ id: courses.id });

    const [module] = await db
      .insert(courseModules)
      .values({
        courseId: course.id,
        title: "Published module",
        position: 1,
      })
      .returning({ id: courseModules.id });

    const [lesson] = await db
      .insert(lessons)
      .values({
        moduleId: module.id,
        title: "Published lesson",
        type: "text",
        content: "Published lesson content",
        position: 1,
      })
      .returning({ id: lessons.id });

    const formData = new FormData();

    formData.set("lessonId", lesson.id);
    formData.set("moduleId", module.id);
    formData.set("direction", "down");

    const result = await reorderLessonAction({}, formData);

    expect(result.errors?.form).toEqual(["Draft lesson was not found."]);
    expect(result.success).toBeUndefined();
  });
});
