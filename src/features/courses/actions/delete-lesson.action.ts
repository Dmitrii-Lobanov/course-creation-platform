"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db/client";
import { courseModules, courses, lessons } from "@/db/schema";

import { deleteLessonSchema } from "../schemas/lesson.schema";

export type DeleteLessonActionState = {
  success?: boolean;
  errors?: {
    lessonId?: string[];
    moduleId?: string[];
    form?: string[];
  };
};

export async function deleteLessonAction(
  _previousState: DeleteLessonActionState,
  formData: FormData,
): Promise<DeleteLessonActionState> {
  const parsed = deleteLessonSchema.safeParse({
    lessonId: formData.get("lessonId"),
    moduleId: formData.get("moduleId"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { lessonId, moduleId } = parsed.data;

  try {
    const [lesson] = await db
      .select({
        id: lessons.id,
        courseId: courseModules.courseId,
      })
      .from(lessons)
      .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
      .innerJoin(courses, eq(courseModules.courseId, courses.id))
      .where(
        and(
          eq(lessons.id, lessonId),
          eq(lessons.moduleId, moduleId),
          eq(courses.status, "draft"),
        ),
      )
      .limit(1);

    if (!lesson) {
      return {
        errors: {
          form: ["Draft lesson was not found."],
        },
      };
    }

    await db.delete(lessons).where(eq(lessons.id, lessonId));

    revalidatePath(`/dashboard/courses/${lesson.courseId}/builder`);

    return {
      success: true,
    };
  } catch {
    return {
      errors: {
        form: ["Something went wrong while deleting the lesson."],
      },
    };
  }
}
