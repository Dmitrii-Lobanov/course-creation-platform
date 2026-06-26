import { beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { courseModules, courses, lessons } from "@/db/schema";
import { resetDatabase } from "@/test/integration/reset-database";

import { updateLessonAction } from "./update-lesson.action";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("updateLessonAction", () => {
  beforeEach(async () => {
    await resetDatabase();
    vi.clearAllMocks();
  });

  it("preserves submitted values when validation fails", async () => {
    const formData = new FormData();

    formData.set("lessonId", "not-a-valid-lesson-id");
    formData.set("moduleId", "not-a-valid-module-id");
    formData.set("title", "");
    formData.set("type", "video");
    formData.set("content", "https://example.com/video");

    const result = await updateLessonAction({}, formData);

    expect(result.values).toEqual({
      title: "",
      type: "video",
      content: "https://example.com/video",
    });

    expect(result.errors?.lessonId).toBeDefined();
    expect(result.errors?.moduleId).toBeDefined();
    expect(result.errors?.title).toBeDefined();
    expect(result.success).toBeUndefined();
  });

  it("updates a lesson for a draft course", async () => {
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
        title: "Old title",
        type: "text",
        content: "Old content",
        position: 1,
      })
      .returning({
        id: lessons.id,
      });

    const formData = new FormData();

    formData.set("lessonId", lesson.id);
    formData.set("moduleId", module.id);
    formData.set("title", "Updated lesson title");
    formData.set("type", "video");
    formData.set("content", "https://example.com/updated-video");

    const result = await updateLessonAction({}, formData);

    expect(result).toEqual({
      success: true,
    });

    const [updatedLesson] = await db
      .select({
        title: lessons.title,
        type: lessons.type,
        content: lessons.content,
      })
      .from(lessons)
      .where(eq(lessons.id, lesson.id))
      .limit(1);

    expect(updatedLesson).toEqual({
      title: "Updated lesson title",
      type: "video",
      content: "https://example.com/updated-video",
    });
  });
});
