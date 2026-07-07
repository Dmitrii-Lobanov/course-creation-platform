import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/db/client";
import { courseModules, courses, lessons } from "@/db/schema";
import { resetDatabase } from "@/test/integration/reset-database";

import { deleteModuleAction } from "./delete-module.action";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("deleteModuleAction", () => {
  beforeEach(async () => {
    await resetDatabase();
    vi.clearAllMocks();
  });

  it("returns validation errors for invalid ids", async () => {
    const formData = new FormData();

    formData.set("courseId", "not-a-valid-course-id");
    formData.set("moduleId", "not-a-valid-module-id");

    const result = await deleteModuleAction({}, formData);

    expect(result.errors?.courseId).toBeDefined();
    expect(result.errors?.moduleId).toBeDefined();
    expect(result.success).toBeUndefined();
  });

  it("deletes a module and its lessons from a draft course", async () => {
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

    await db.insert(lessons).values([
      {
        moduleId: module.id,
        title: "Render phase",
        type: "text",
        content: "Render phase content",
        position: 1,
      },
      {
        moduleId: module.id,
        title: "Commit phase",
        type: "text",
        content: "Commit phase content",
        position: 2,
      },
    ]);

    const formData = new FormData();

    formData.set("courseId", course.id);
    formData.set("moduleId", module.id);

    const result = await deleteModuleAction({}, formData);

    expect(result).toEqual({
      success: true,
    });

    const deletedModules = await db
      .select({ id: courseModules.id })
      .from(courseModules)
      .where(eq(courseModules.id, module.id));

    const deletedLessons = await db
      .select({ id: lessons.id })
      .from(lessons)
      .where(eq(lessons.moduleId, module.id));

    expect(deletedModules).toEqual([]);
    expect(deletedLessons).toEqual([]);
  });

  it("does not delete a module from a published course", async () => {
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
        title: "Published module",
        position: 1,
      })
      .returning({
        id: courseModules.id,
      });

    const formData = new FormData();

    formData.set("courseId", course.id);
    formData.set("moduleId", module.id);

    const result = await deleteModuleAction({}, formData);

    expect(result.errors?.form).toEqual(["Draft module was not found."]);
    expect(result.success).toBeUndefined();

    const [existingModule] = await db
      .select({
        id: courseModules.id,
        title: courseModules.title,
      })
      .from(courseModules)
      .where(eq(courseModules.id, module.id))
      .limit(1);

    expect(existingModule).toEqual({
      id: module.id,
      title: "Published module",
    });
  });
});