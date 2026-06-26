import { beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/db/client";
import { courses } from "@/db/schema";
import { resetDatabase } from "@/test/integration/reset-database";

import { createModuleAction } from "./create-module.action";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("createModuleAction", () => {
  beforeEach(async () => {
    await resetDatabase();
    vi.clearAllMocks();
  });

  it("preserves submitted values when validation fails", async () => {
    const formData = new FormData();

    formData.set("courseId", "not-a-valid-course-id");
    formData.set("title", "");

    const result = await createModuleAction({}, formData);

    expect(result.values).toEqual({
      title: "",
    });

    expect(result.errors?.title).toBeDefined();
    expect(result.errors?.courseId).toBeDefined();
    expect(result.resetKey).toBeUndefined();
  });

  it("returns reset key after successful module creation", async () => {
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

    const formData = new FormData();

    formData.set("courseId", course.id);
    formData.set("title", "Rendering fundamentals");

    const result = await createModuleAction({}, formData);

    expect(result.errors).toBeUndefined();
    expect(result.values).toBeUndefined();
    expect(result.resetKey).toEqual(expect.any(Number));
  });
});
