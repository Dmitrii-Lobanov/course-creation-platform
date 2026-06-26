import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/db/client";
import { courseModules, courses } from "@/db/schema";
import { resetDatabase } from "@/test/integration/reset-database";

import { createLessonAction } from "./create-lesson.action";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("createLessonAction", () => {
  beforeEach(async () => {
    await resetDatabase();
    vi.clearAllMocks();
  });

  it("preserves submitted values when validation fails", async () => {
    const formData = new FormData();

    formData.set("moduleId", "not-a-valid-module-id");
    formData.set("title", "");
    formData.set("type", "video");
    formData.set("content", "https://example.com/video");

    const result = await createLessonAction({}, formData);

    expect(result.values).toEqual({
      title: "",
      type: "video",
      content: "https://example.com/video",
    });

    expect(result.errors?.title).toBeDefined();
    expect(result.errors?.moduleId).toBeDefined();
    expect(result.resetKey).toBeUndefined();
  });

  it("returns reset key after successful lesson creation", async () => {
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

    const formData = new FormData();

    formData.set("moduleId", module.id);
    formData.set("title", "Render phase");
    formData.set("type", "text");
    formData.set("content", "Understand when React renders components.");

    const result = await createLessonAction({}, formData);

    expect(result.errors).toBeUndefined();
    expect(result.values).toBeUndefined();
    expect(result.resetKey).toEqual(expect.any(Number));
  });
});
