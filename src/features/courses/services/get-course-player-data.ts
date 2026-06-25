import { and, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { enrollments } from "@/db/schema";

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

  const firstLesson = allLessons[0] ?? null;

  return {
    enrollment,
    course: courseDetail.course,
    modules: courseDetail.modules,
    currentLesson: selectedLesson ?? firstLesson,
  };
}
