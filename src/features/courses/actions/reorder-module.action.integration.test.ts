import { asc, eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/db/client";
import { courseModules, courses } from "@/db/schema";
import { resetDatabase } from "@/test/integration/reset-database";

import { reorderModuleAction } from "./reorder-module.action";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("reorderModuleAction", () => {
  beforeEach(async () => {
    await resetDatabase();
    vi.clearAllMocks();
  });

  it("returns validation errors for invalid input", async () => {
    const formData = new FormData();

    formData.set("courseId", "not-a-valid-course-id");
    formData.set("moduleId", "not-a-valid-module-id");
    formData.set("direction", "sideways");

    const result = await reorderModuleAction({}, formData);

    expect(result.errors?.courseId).toBeDefined();
    expect(result.errors?.moduleId).toBeDefined();
    expect(result.errors?.direction).toBeDefined();
    expect(result.success).toBeUndefined();
  });

  it("moves a draft course module up", async () => {
    const [course] = await db
      .insert(courses)
      .values({
        title: "React Performance",
        description: "A course about React performance.",
        level: "advanced",
        status: "draft",
      })
      .returning({ id: courses.id });

    const insertedModules = await db
      .insert(courseModules)
      .values([
        {
          courseId: course.id,
          title: "First module",
          position: 1,
        },
        {
          courseId: course.id,
          title: "Second module",
          position: 2,
        },
      ])
      .returning({
        id: courseModules.id,
        title: courseModules.title,
      });

    const secondModule = insertedModules.find(
      (module) => module.title === "Second module",
    );

    expect(secondModule).toBeDefined();

    const formData = new FormData();

    formData.set("courseId", course.id);
    formData.set("moduleId", secondModule!.id);
    formData.set("direction", "up");

    const result = await reorderModuleAction({}, formData);

    expect(result).toEqual({
      success: true,
    });

    const reorderedModules = await db
      .select({
        title: courseModules.title,
        position: courseModules.position,
      })
      .from(courseModules)
      .where(eq(courseModules.courseId, course.id))
      .orderBy(asc(courseModules.position));

    expect(reorderedModules).toEqual([
      {
        title: "Second module",
        position: 1,
      },
      {
        title: "First module",
        position: 2,
      },
    ]);
  });

  it("moves a draft course module down", async () => {
    const [course] = await db
      .insert(courses)
      .values({
        title: "React Performance",
        description: "A course about React performance.",
        level: "advanced",
        status: "draft",
      })
      .returning({ id: courses.id });

    const insertedModules = await db
      .insert(courseModules)
      .values([
        {
          courseId: course.id,
          title: "First module",
          position: 1,
        },
        {
          courseId: course.id,
          title: "Second module",
          position: 2,
        },
      ])
      .returning({
        id: courseModules.id,
        title: courseModules.title,
      });

    const firstModule = insertedModules.find(
      (module) => module.title === "First module",
    );

    expect(firstModule).toBeDefined();

    const formData = new FormData();

    formData.set("courseId", course.id);
    formData.set("moduleId", firstModule!.id);
    formData.set("direction", "down");

    const result = await reorderModuleAction({}, formData);

    expect(result).toEqual({
      success: true,
    });

    const reorderedModules = await db
      .select({
        title: courseModules.title,
        position: courseModules.position,
      })
      .from(courseModules)
      .where(eq(courseModules.courseId, course.id))
      .orderBy(asc(courseModules.position));

    expect(reorderedModules).toEqual([
      {
        title: "Second module",
        position: 1,
      },
      {
        title: "First module",
        position: 2,
      },
    ]);
  });

  it("does not reorder modules from a published course", async () => {
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

    const formData = new FormData();

    formData.set("courseId", course.id);
    formData.set("moduleId", module.id);
    formData.set("direction", "down");

    const result = await reorderModuleAction({}, formData);

    expect(result.errors?.form).toEqual(["Draft module was not found."]);
    expect(result.success).toBeUndefined();
  });
});