import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/db/client";
import { courses } from "@/db/schema";
import { resetDatabase } from "@/test/integration/reset-database";

import { updateCourseAction } from "./update-course.action";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("updateCourseAction", () => {
  beforeEach(async () => {
    await resetDatabase();
    vi.clearAllMocks();
  });

  it("preserves submitted values when validation fails", async () => {
    const formData = new FormData();

    formData.set("courseId", "not-a-valid-course-id");
    formData.set("title", "");
    formData.set("description", "Too short");
    formData.set("level", "");

    const result = await updateCourseAction({}, formData);

    expect(result.values).toEqual({
      title: "",
      description: "Too short",
      level: "",
    });

    expect(result.errors?.courseId).toBeDefined();
    expect(result.errors?.title).toBeDefined();
    expect(result.errors?.description).toBeDefined();
    expect(result.errors?.level).toBeDefined();
    expect(result.success).toBeUndefined();
  });

  it("updates a draft course", async () => {
    const [course] = await db
      .insert(courses)
      .values({
        title: "Old course title",
        description: "Old course description with enough length.",
        level: "beginner",
        status: "draft",
      })
      .returning({
        id: courses.id,
      });

    const formData = new FormData();

    formData.set("courseId", course.id);
    formData.set("title", "Updated course title");
    formData.set(
      "description",
      "Updated course description with enough length.",
    );
    formData.set("level", "advanced");

    const result = await updateCourseAction({}, formData);

    expect(result).toEqual({
      success: true,
    });

    const [updatedCourse] = await db
      .select({
        title: courses.title,
        description: courses.description,
        level: courses.level,
      })
      .from(courses)
      .where(eq(courses.id, course.id))
      .limit(1);

    expect(updatedCourse).toEqual({
      title: "Updated course title",
      description: "Updated course description with enough length.",
      level: "advanced",
    });
  });

  it("does not update a published course", async () => {
    const [course] = await db
      .insert(courses)
      .values({
        title: "Published course",
        description: "Published course description with enough length.",
        level: "intermediate",
        status: "published",
      })
      .returning({
        id: courses.id,
      });

    const formData = new FormData();

    formData.set("courseId", course.id);
    formData.set("title", "Should not update");
    formData.set(
      "description",
      "This description should not be persisted.",
    );
    formData.set("level", "advanced");

    const result = await updateCourseAction({}, formData);

    expect(result.values).toEqual({
      title: "Should not update",
      description: "This description should not be persisted.",
      level: "advanced",
    });

    expect(result.errors?.form).toEqual(["Draft course was not found."]);
    expect(result.success).toBeUndefined();

    const [unchangedCourse] = await db
      .select({
        title: courses.title,
        description: courses.description,
        level: courses.level,
      })
      .from(courses)
      .where(eq(courses.id, course.id))
      .limit(1);

    expect(unchangedCourse).toEqual({
      title: "Published course",
      description: "Published course description with enough length.",
      level: "intermediate",
    });
  });
});