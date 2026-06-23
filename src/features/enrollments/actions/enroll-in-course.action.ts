"use server";

import { revalidatePath } from "next/cache";

import { enrollInCourse } from "../services/enroll-in-course";

export type EnrollInCourseActionState = {
  error?: string;
  success?: boolean;
  alreadyEnrolled?: boolean;
};

const DEMO_STUDENT_ID = "demo-student";

export async function enrollInCourseAction(
  _previousState: EnrollInCourseActionState,
  formData: FormData,
): Promise<EnrollInCourseActionState> {
  const courseId = formData.get("courseId");

  if (typeof courseId !== "string") {
    return {
      error: "Invalid course id.",
    };
  }

  const result = await enrollInCourse({
    courseId,
    studentId: DEMO_STUDENT_ID,
  });

  if (!result.success) {
    return {
      error: result.error,
    };
  }

  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);

  return {
    success: true,
    alreadyEnrolled: result.alreadyEnrolled,
  };
}