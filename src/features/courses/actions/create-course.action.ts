"use server";

import { redirect } from "next/navigation";

import { createCourseSchema } from "../schemas/course.schema";
import { createCourseDraft } from "../services/create-course-draft";

export type CreateCourseActionState = {
  values?: {
    title?: string;
    description?: string;
    level?: string;
  };
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
  const values = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    level: String(formData.get("level") ?? ""),
  };

  const parsed = createCourseSchema.safeParse(values);

  if (!parsed.success) {
    return {
      values,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  let courseId: string;

  try {
    const createdCourse = await createCourseDraft(parsed.data);
    courseId = createdCourse.id;
  } catch {
    return {
      values,
      errors: {
        form: ["Something went wrong while creating the course."],
      },
    };
  }

  redirect(`/dashboard/courses/${courseId}/builder`);
}
