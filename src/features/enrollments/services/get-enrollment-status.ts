import { and, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { enrollments } from "@/db/schema";

type GetEnrollmentStatusInput = {
  courseId: string;
  studentId: string;
};

export async function getEnrollmentStatus({
  courseId,
  studentId,
}: GetEnrollmentStatusInput) {
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

  return {
    isEnrolled: Boolean(enrollment),
    enrollment: enrollment ?? null,
  };
}