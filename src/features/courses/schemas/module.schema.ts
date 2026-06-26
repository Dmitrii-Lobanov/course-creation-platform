import { z } from "zod";

export const createModuleSchema = z.object({
  courseId: z.string().uuid("Invalid course id."),

  title: z
    .string()
    .trim()
    .min(3, "Module title must be at least 3 characters.")
    .max(120, "Module title must be shorter than 120 characters."),
});

export const updateModuleSchema = createModuleSchema.extend({
  moduleId: z.string().uuid("Invalid module id."),
});

export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;
