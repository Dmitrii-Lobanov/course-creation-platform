import { and, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { enrollments, lessonProgress, lessons } from "@/db/schema";

type MarkLessonCompletedInput = {
  courseId: string;
  lessonId: string;
  studentId: string;
};

export async function markLessonCompleted({
  courseId,
  lessonId,
  studentId,
}: MarkLessonCompletedInput) {
  const [enrollment] = await db
    .select({
      id: enrollments.id,
    })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.courseId, courseId),
        eq(enrollments.studentId, studentId),
      ),
    )
    .limit(1);

  if (!enrollment) {
    return {
      success: false as const,
      error: "You must be enrolled to complete lessons.",
    };
  }

  const [lesson] = await db
    .select({
      id: lessons.id,
    })
    .from(lessons)
    .where(eq(lessons.id, lessonId))
    .limit(1);

  if (!lesson) {
    return {
      success: false as const,
      error: "Lesson was not found.",
    };
  }

  const now = new Date();

  const [existingProgress] = await db
    .select({
      id: lessonProgress.id,
    })
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.courseId, courseId),
        eq(lessonProgress.lessonId, lessonId),
        eq(lessonProgress.studentId, studentId),
      ),
    )
    .limit(1);

  if (existingProgress) {
    const [updatedProgress] = await db
      .update(lessonProgress)
      .set({
        completed: true,
        completedAt: now,
        updatedAt: now,
      })
      .where(eq(lessonProgress.id, existingProgress.id))
      .returning({
        id: lessonProgress.id,
        lessonId: lessonProgress.lessonId,
        completed: lessonProgress.completed,
      });

    return {
      success: true as const,
      progress: updatedProgress,
    };
  }

  const [createdProgress] = await db
    .insert(lessonProgress)
    .values({
      courseId,
      lessonId,
      studentId,
      completed: true,
      completedAt: now,
      updatedAt: now,
    })
    .returning({
      id: lessonProgress.id,
      lessonId: lessonProgress.lessonId,
      completed: lessonProgress.completed,
    });

  return {
    success: true as const,
    progress: createdProgress,
  };
}
