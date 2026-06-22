"use server";

import { redirect } from "next/navigation";

import { createCourseSchema } from "../schemas/course.schema";

export type CreateCourseActionState = {
  errors?: {
    title?: string[];
    description?: string[];
    level?: string[];
    form?: string[];
  };
};

export async function createCourseAction(
  _previousState: CreateCourseActionState,
  formData: FormData,
): Promise<CreateCourseActionState> {
  const parsed = createCourseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    level: formData.get("level"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Temporary placeholder until Drizzle/Postgres is connected.
  const courseId = crypto.randomUUID();

  redirect(`/dashboard/courses/${courseId}/builder`);
}