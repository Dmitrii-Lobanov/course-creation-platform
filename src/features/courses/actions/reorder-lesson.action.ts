"use server";

import { and, asc, desc, eq, gt, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db/client";
import { courseModules, courses, lessons } from "@/db/schema";

import { reorderLessonSchema } from "../schemas/lesson.schema";

export type ReorderLessonActionState = {
  success?: boolean;
  errors?: {
    lessonId?: string[];
    moduleId?: string[];
    direction?: string[];
    form?: string[];
  };
};

export async function reorderLessonAction(
  _previousState: ReorderLessonActionState,
  formData: FormData,
): Promise<ReorderLessonActionState> {
  const parsed = reorderLessonSchema.safeParse({
    lessonId: formData.get("lessonId"),
    moduleId: formData.get("moduleId"),
    direction: formData.get("direction"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { lessonId, moduleId, direction } = parsed.data;

  try {
    const [currentLesson] = await db
      .select({
        id: lessons.id,
        position: lessons.position,
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

    if (!currentLesson) {
      return {
        errors: {
          form: ["Draft lesson was not found."],
        },
      };
    }

    const [targetLesson] = await db
      .select({
        id: lessons.id,
        position: lessons.position,
      })
      .from(lessons)
      .where(
        and(
          eq(lessons.moduleId, moduleId),
          direction === "up"
            ? lt(lessons.position, currentLesson.position)
            : gt(lessons.position, currentLesson.position),
        ),
      )
      .orderBy(
        direction === "up" ? desc(lessons.position) : asc(lessons.position),
      )
      .limit(1);

    if (!targetLesson) {
      return {
        success: true,
      };
    }

    await db.transaction(async (tx) => {
      await tx
        .update(lessons)
        .set({ position: targetLesson.position })
        .where(eq(lessons.id, currentLesson.id));

      await tx
        .update(lessons)
        .set({ position: currentLesson.position })
        .where(eq(lessons.id, targetLesson.id));
    });

    revalidatePath(`/dashboard/courses/${currentLesson.courseId}/builder`);

    return {
      success: true,
    };
  } catch {
    return {
      errors: {
        form: ["Something went wrong while reordering the lesson."],
      },
    };
  }
}
