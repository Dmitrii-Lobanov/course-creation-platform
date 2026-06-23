import { describe, expect, it } from "vitest";

import { createCourseSchema } from "./course.schema";

describe("createCourseSchema", () => {
  it("accepts valid course draft input", () => {
    const result = createCourseSchema.safeParse({
      title: "React Performance Masterclass",
      description:
        "A practical course about optimizing real React applications.",
      level: "intermediate",
    });

    expect(result.success).toBe(true);
  });

  it("trims title and description", () => {
    const result = createCourseSchema.parse({
      title: "  React Performance  ",
      description:
        "  A practical course about optimizing real React applications.  ",
      level: "advanced",
    });

    expect(result.title).toBe("React Performance");
    expect(result.description).toBe(
      "A practical course about optimizing real React applications.",
    );
  });

  it("rejects short titles", () => {
    const result = createCourseSchema.safeParse({
      title: "JS",
      description: "A practical course about JavaScript fundamentals.",
      level: "beginner",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title).toContain(
        "Course title must be at least 3 characters.",
      );
    }
  });

  it("rejects short descriptions", () => {
    const result = createCourseSchema.safeParse({
      title: "JavaScript Basics",
      description: "Too short",
      level: "beginner",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.description).toContain(
        "Course description must be at least 20 characters.",
      );
    }
  });

  it("rejects unsupported levels", () => {
    const result = createCourseSchema.safeParse({
      title: "JavaScript Basics",
      description: "A practical course about JavaScript fundamentals.",
      level: "expert",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.level).toBeDefined();
    }
  });
});
