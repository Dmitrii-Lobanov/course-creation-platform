"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db/client";
import { courseModules, courses, lessons } from "@/db/schema";

import { createLessonSchema } from "../schemas/lesson.schema";

export type CreateLessonActionState = {
  errors?: {
    moduleId?: string[];
    title?: string[];
    type?: string[];
    content?: string[];
    form?: string[];
  };
};

export async function createLessonAction(
  _previousState: CreateLessonActionState,
  formData: FormData,
): Promise<CreateLessonActionState> {
  const parsed = createLessonSchema.safeParse({
    moduleId: formData.get("moduleId"),
    title: formData.get("title"),
    type: formData.get("type"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { moduleId, title, type, content } = parsed.data;

  try {
    const [module] = await db
      .select({
        id: courseModules.id,
        courseId: courseModules.courseId,
        courseStatus: courses.status,
      })
      .from(courseModules)
      .innerJoin(courses, eq(courseModules.courseId, courses.id))
      .where(and(eq(courseModules.id, moduleId), eq(courses.status, "draft")))
      .limit(1);

    if (!module) {
      return {
        errors: {
          form: ["Draft module was not found."],
        },
      };
    }

    const [lastLesson] = await db
      .select({
        position: lessons.position,
      })
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId))
      .orderBy(desc(lessons.position))
      .limit(1);

    const nextPosition = lastLesson ? lastLesson.position + 1 : 1;

    await db.insert(lessons).values({
      moduleId,
      title,
      type,
      content: content || null,
      position: nextPosition,
    });

    revalidatePath(`/dashboard/courses/${module.courseId}/builder`);
  } catch {
    return {
      errors: {
        form: ["Something went wrong while creating the lesson."],
      },
    };
  }

  return {};
}
