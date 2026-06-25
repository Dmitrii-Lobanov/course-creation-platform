import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { courses, enrollments } from "@/db/schema";

type GetEnrolledCoursesInput = {
  studentId: string;
};

export async function getEnrolledCourses({
  studentId,
}: GetEnrolledCoursesInput) {
  return db
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
}