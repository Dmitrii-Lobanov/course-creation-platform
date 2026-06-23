import { and, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { courses, enrollments } from "@/db/schema";

type EnrollInCourseInput = {
  courseId: string;
  studentId: string;
};

export async function enrollInCourse({
  courseId,
  studentId,
}: EnrollInCourseInput) {
  const [course] = await db
    .select({
      id: courses.id,
      status: courses.status,
    })
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  if (!course) {
    return {
      success: false as const,
      error: "Course was not found.",
    };
  }

  if (course.status !== "published") {
    return {
      success: false as const,
      error: "Only published courses can be joined.",
    };
  }

  const [existingEnrollment] = await db
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

  if (existingEnrollment) {
    return {
      success: true as const,
      enrollment: existingEnrollment,
      alreadyEnrolled: true,
    };
  }

  const [createdEnrollment] = await db
    .insert(enrollments)
    .values({
      courseId,
      studentId,
    })
    .returning({
      id: enrollments.id,
      courseId: enrollments.courseId,
      studentId: enrollments.studentId,
      createdAt: enrollments.createdAt,
    });

  if (!createdEnrollment) {
    return {
      success: false as const,
      error: "Enrollment could not be created.",
    };
  }

  return {
    success: true as const,
    enrollment: createdEnrollment,
    alreadyEnrolled: false,
  };
}