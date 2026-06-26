import { z } from "zod";

export const createLessonSchema = z.object({
  moduleId: z.string().uuid("Invalid module id."),

  title: z
    .string()
    .trim()
    .min(3, "Lesson title must be at least 3 characters.")
    .max(120, "Lesson title must be shorter than 120 characters."),

  type: z.enum(["text", "video"], {
    error: "Select a lesson type.",
  }),

  content: z.string().trim().optional(),
});

export const updateLessonSchema = createLessonSchema.extend({
  lessonId: z.string().uuid("Invalid lesson id."),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
