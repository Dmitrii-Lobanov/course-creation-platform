"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db/client";
import { courseModules, courses, lessons } from "@/db/schema";

import { updateLessonSchema } from "../schemas/lesson.schema";

export type UpdateLessonActionState = {
  values?: {
    title?: string;
    type?: string;
    content?: string;
  };
  success?: boolean;
  errors?: {
    lessonId?: string[];
    moduleId?: string[];
    title?: string[];
    type?: string[];
    content?: string[];
    form?: string[];
  };
};

export async function updateLessonAction(
  _previousState: UpdateLessonActionState,
  formData: FormData,
): Promise<UpdateLessonActionState> {
  const values = {
    title: String(formData.get("title") ?? ""),
    type: String(formData.get("type") ?? "text"),
    content: String(formData.get("content") ?? ""),
  };

  const parsed = updateLessonSchema.safeParse({
    lessonId: formData.get("lessonId"),
    moduleId: formData.get("moduleId"),
    title: values.title,
    type: values.type,
    content: values.content,
  });

  if (!parsed.success) {
    return {
      values,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { lessonId, moduleId, title, type, content } = parsed.data;

  try {
    const [lesson] = await db
      .select({
        id: lessons.id,
        courseId: courseModules.courseId,
        courseStatus: courses.status,
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
        values,
        errors: {
          form: ["Draft lesson was not found."],
        },
      };
    }

    await db
      .update(lessons)
      .set({
        title,
        type,
        content: content || null,
        updatedAt: new Date(),
      })
      .where(eq(lessons.id, lessonId));

    revalidatePath(`/dashboard/courses/${lesson.courseId}/builder`);

    return {
      success: true,
    };
  } catch {
    return {
      values,
      errors: {
        form: ["Something went wrong while updating the lesson."],
      },
    };
  }
}