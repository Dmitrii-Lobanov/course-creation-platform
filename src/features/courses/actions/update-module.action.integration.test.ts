import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/db/client";
import { courseModules, courses } from "@/db/schema";
import { resetDatabase } from "@/test/integration/reset-database";

import { updateModuleAction } from "./update-module.action";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("updateModuleAction", () => {
  beforeEach(async () => {
    await resetDatabase();
    vi.clearAllMocks();
  });

  it("preserves submitted values when validation fails", async () => {
    const formData = new FormData();

    formData.set("courseId", "not-a-valid-course-id");
    formData.set("moduleId", "not-a-valid-module-id");
    formData.set("title", "");

    const result = await updateModuleAction({}, formData);

    expect(result.values).toEqual({
      title: "",
    });

    expect(result.errors?.courseId).toBeDefined();
    expect(result.errors?.moduleId).toBeDefined();
    expect(result.errors?.title).toBeDefined();
    expect(result.success).toBeUndefined();
  });

  it("updates a module for a draft course", async () => {
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
        title: "Old module title",
        position: 1,
      })
      .returning({
        id: courseModules.id,
      });

    const formData = new FormData();

    formData.set("courseId", course.id);
    formData.set("moduleId", module.id);
    formData.set("title", "Updated module title");

    const result = await updateModuleAction({}, formData);

    expect(result).toEqual({
      success: true,
    });

    const [updatedModule] = await db
      .select({
        title: courseModules.title,
      })
      .from(courseModules)
      .where(eq(courseModules.id, module.id))
      .limit(1);

    expect(updatedModule).toEqual({
      title: "Updated module title",
    });
  });

  it("does not update a module from a published course", async () => {
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
        title: "Published module title",
        position: 1,
      })
      .returning({
        id: courseModules.id,
      });

    const formData = new FormData();

    formData.set("courseId", course.id);
    formData.set("moduleId", module.id);
    formData.set("title", "Should not update");

    const result = await updateModuleAction({}, formData);

    expect(result.values).toEqual({
      title: "Should not update",
    });

    expect(result.errors?.form).toEqual(["Draft module was not found."]);
    expect(result.success).toBeUndefined();

    const [unchangedModule] = await db
      .select({
        title: courseModules.title,
      })
      .from(courseModules)
      .where(eq(courseModules.id, module.id))
      .limit(1);

    expect(unchangedModule).toEqual({
      title: "Published module title",
    });
  });
});