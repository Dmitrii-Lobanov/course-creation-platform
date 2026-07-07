import { z } from "zod";

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Course title must be at least 3 characters.")
    .max(120, "Course title must be shorter than 120 characters."),

  description: z
    .string()
    .trim()
    .min(20, "Course description must be at least 20 characters.")
    .max(1000, "Course description must be shorter than 1000 characters."),

  level: z.enum(["beginner", "intermediate", "advanced"], {
    error: "Select a course level.",
  }),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = createCourseSchema.extend({
  courseId: z.string().uuid("Invalid course id."),
});

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
