"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db/client";
import { courses } from "@/db/schema";

import { updateCourseSchema } from "../schemas/course.schema";

export type UpdateCourseActionState = {
  values?: {
    title?: string;
    description?: string;
    level?: string;
  };
  success?: boolean;
  errors?: {
    courseId?: string[];
    title?: string[];
    description?: string[];
    level?: string[];
    form?: string[];
  };
};

export async function updateCourseAction(
  _previousState: UpdateCourseActionState,
  formData: FormData,
): Promise<UpdateCourseActionState> {
  const values = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    level: String(formData.get("level") ?? ""),
  };

  const parsed = updateCourseSchema.safeParse({
    courseId: formData.get("courseId"),
    title: values.title,
    description: values.description,
    level: values.level,
  });

  if (!parsed.success) {
    return {
      values,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { courseId, title, description, level } = parsed.data;

  try {
    const [course] = await db
      .select({
        id: courses.id,
      })
      .from(courses)
      .where(and(eq(courses.id, courseId), eq(courses.status, "draft")))
      .limit(1);

    if (!course) {
      return {
        values,
        errors: {
          form: ["Draft course was not found."],
        },
      };
    }

    await db
      .update(courses)
      .set({
        title,
        description,
        level,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, courseId));

    revalidatePath(`/dashboard/courses/${courseId}/builder`);
    revalidatePath("/dashboard/courses");

    return {
      success: true,
    };
  } catch {
    return {
      values,
      errors: {
        form: ["Something went wrong while updating the course."],
      },
    };
  }
}
