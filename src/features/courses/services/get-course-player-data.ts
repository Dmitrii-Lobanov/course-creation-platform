import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db/client";
import { enrollments, lessonProgress } from "@/db/schema";

import { getPublishedCourseDetail } from "./get-published-course-detail";

type GetCoursePlayerDataInput = {
  courseId: string;
  studentId: string;
  lessonId?: string;
};

export async function getCoursePlayerData({
  courseId,
  studentId,
  lessonId,
}: GetCoursePlayerDataInput) {
  const [enrollment] = await db
    .select({
      id: enrollments.id,
      courseId: enrollments.courseId,
      studentId: enrollments.studentId,
      createdAt: enrollments.createdAt,
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
    return null;
  }

  const courseDetail = await getPublishedCourseDetail(courseId);

  if (!courseDetail) {
    return null;
  }

  const allLessons = courseDetail.modules.flatMap((module) => module.lessons);

  const selectedLesson = lessonId
    ? allLessons.find((lesson) => lesson.id === lessonId)
    : null;

  if (selectedLesson) {
    return {
      enrollment,
      course: courseDetail.course,
      modules: courseDetail.modules,
      currentLesson: selectedLesson,
    };
  }

  const lessonIds = allLessons.map((lesson) => lesson.id);

  const completedRows =
    lessonIds.length > 0
      ? await db
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
          )
      : [];

  const completedLessonIds = new Set(completedRows.map((row) => row.lessonId));

  const firstIncompleteLesson =
    allLessons.find((lesson) => !completedLessonIds.has(lesson.id)) ?? null;

  const firstLesson = allLessons[0] ?? null;

  return {
    enrollment,
    course: courseDetail.course,
    modules: courseDetail.modules,
    currentLesson: firstIncompleteLesson ?? firstLesson,
  };
}
