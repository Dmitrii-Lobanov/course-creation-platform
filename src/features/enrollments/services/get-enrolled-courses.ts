import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { courseModules, courses, enrollments, lessons } from "@/db/schema";
import { getCourseProgress } from "@/features/progress/services/get-course-progress";

type GetEnrolledCoursesInput = {
  studentId: string;
};

export async function getEnrolledCourses({
  studentId,
}: GetEnrolledCoursesInput) {
  const enrolledCourses = await db
    .select({
      enrollmentId: enrollments.id,
      enrolledAt: enrollments.createdAt,
      courseId: courses.id,
      title: courses.title,
      description: courses.description,
      level: courses.level,
      status: courses.status,
      updatedAt: courses.updatedAt,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.studentId, studentId))
    .orderBy(desc(enrollments.createdAt));

  return Promise.all(
    enrolledCourses.map(async (course) => {
      const lessonRows = await db
        .select({
          id: lessons.id,
        })
        .from(lessons)
        .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
        .where(eq(courseModules.courseId, course.courseId));

      const lessonIds = lessonRows.map((lesson) => lesson.id);

      const progress = await getCourseProgress({
        courseId: course.courseId,
        studentId,
        lessonIds,
      });

      return {
        ...course,
        completedLessons: progress.completedCount,
        totalLessons: progress.totalCount,
        completionPercentage: progress.completionPercentage,
      };
    }),
  );
}
