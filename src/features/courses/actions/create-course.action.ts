"use server";

import { redirect } from "next/navigation";

import { createCourseSchema } from "../schemas/course.schema";
import { createCourseDraft } from "../services/create-course-draft";

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

  let courseId: string;

  try {
    const createdCourse = await createCourseDraft(parsed.data);
    courseId = createdCourse.id;
  } catch {
    return {
      errors: {
        form: ["Something went wrong while creating the course."],
      },
    };
  }

  redirect(`/dashboard/courses/${courseId}/builder`);
}
