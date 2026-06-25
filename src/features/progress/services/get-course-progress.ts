import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db/client";
import { lessonProgress } from "@/db/schema";

type GetCourseProgressInput = {
  courseId: string;
  studentId: string;
  lessonIds: string[];
};

export async function getCourseProgress({
  courseId,
  studentId,
  lessonIds,
}: GetCourseProgressInput) {
  if (lessonIds.length === 0) {
    return {
      completedLessonIds: new Set<string>(),
      completedCount: 0,
      totalCount: 0,
      completionPercentage: 0,
    };
  }

  const completedRows = await db
    .select({
      lessonId: lessonProgress.lessonId,
    })
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.courseId, courseId),
        eq(lessonProgress.studentId, studentId),
        eq(lessonProgress.completed, true),
        inArray(lessonProgress.lessonId, lessonIds),
      ),
    );

  const completedLessonIds = new Set(completedRows.map((row) => row.lessonId));

  const completedCount = completedLessonIds.size;
  const totalCount = lessonIds.length;

  return {
    completedLessonIds,
    completedCount,
    totalCount,
    completionPercentage:
      totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100),
  };
}
