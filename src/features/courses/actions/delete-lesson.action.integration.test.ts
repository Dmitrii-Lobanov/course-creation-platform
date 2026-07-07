import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/db/client";
import { courseModules, courses, lessons } from "@/db/schema";
import { resetDatabase } from "@/test/integration/reset-database";

import { deleteLessonAction } from "./delete-lesson.action";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("deleteLessonAction", () => {
  beforeEach(async () => {
    await resetDatabase();
    vi.clearAllMocks();
  });

  it("returns validation errors for invalid ids", async () => {
    const formData = new FormData();

    formData.set("lessonId", "not-a-valid-lesson-id");
    formData.set("moduleId", "not-a-valid-module-id");

    const result = await deleteLessonAction({}, formData);

    expect(result.errors?.lessonId).toBeDefined();
    expect(result.errors?.moduleId).toBeDefined();
    expect(result.success).toBeUndefined();
  });

  it("deletes a lesson from a draft course", async () => {
    const [course] = await db
      .insert(courses)
      .values({
        title: "React Performance",
        description: "A course about React performance.",
        level: "advanced",
        status: "draft",
      })
      .returning({
        id: courses.id,
      });

    const [module] = await db
      .insert(courseModules)
      .values({
        courseId: course.id,
        title: "Rendering fundamentals",
        position: 1,
      })
      .returning({
        id: courseModules.id,
      });

    const [lesson] = await db
      .insert(lessons)
      .values({
        moduleId: module.id,
        title: "Lesson to delete",
        type: "text",
        content: "Temporary content",
        position: 1,
      })
      .returning({
        id: lessons.id,
      });

    const formData = new FormData();

    formData.set("lessonId", lesson.id);
    formData.set("moduleId", module.id);

    const result = await deleteLessonAction({}, formData);

    expect(result).toEqual({
      success: true,
    });

    const deletedLessons = await db
      .select({
        id: lessons.id,
      })
      .from(lessons)
      .where(eq(lessons.id, lesson.id));

    expect(deletedLessons).toEqual([]);
  });

  it("does not delete a lesson from a published course", async () => {
    const [course] = await db
      .insert(courses)
      .values({
        title: "React Performance",
        description: "A course about React performance.",
        level: "advanced",
        status: "published",
      })
      .returning({
        id: courses.id,
      });

    const [module] = await db
      .insert(courseModules)
      .values({
        courseId: course.id,
        title: "Rendering fundamentals",
        position: 1,
      })
      .returning({
        id: courseModules.id,
      });

    const [lesson] = await db
      .insert(lessons)
      .values({
        moduleId: module.id,
        title: "Published lesson",
        type: "text",
        content: "Published content",
        position: 1,
      })
      .returning({
        id: lessons.id,
      });

    const formData = new FormData();

    formData.set("lessonId", lesson.id);
    formData.set("moduleId", module.id);

    const result = await deleteLessonAction({}, formData);

    expect(result.errors?.form).toEqual(["Draft lesson was not found."]);
    expect(result.success).toBeUndefined();

    const [existingLesson] = await db
      .select({
        id: lessons.id,
        title: lessons.title,
      })
      .from(lessons)
      .where(eq(lessons.id, lesson.id))
      .limit(1);

    expect(existingLesson).toEqual({
      id: lesson.id,
      title: "Published lesson",
    });
  });
});
