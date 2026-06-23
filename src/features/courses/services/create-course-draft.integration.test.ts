import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";

import { db } from "@/db/client";
import { courses } from "@/db/schema";
import { resetDatabase } from "@/test/integration/reset-database";

import { createCourseDraft } from "./create-course-draft";

describe("createCourseDraft integration", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("creates a draft course in Postgres", async () => {
    const createdCourse = await createCourseDraft({
      title: "React Performance Masterclass",
      description: "A practical course about optimizing React applications.",
      level: "intermediate",
    });

    const [storedCourse] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, createdCourse.id))
      .limit(1);

    expect(storedCourse).toMatchObject({
      id: createdCourse.id,
      title: "React Performance Masterclass",
      description: "A practical course about optimizing React applications.",
      level: "intermediate",
      status: "draft",
    });

    expect(storedCourse.createdAt).toBeInstanceOf(Date);
    expect(storedCourse.updatedAt).toBeInstanceOf(Date);
  });
});
