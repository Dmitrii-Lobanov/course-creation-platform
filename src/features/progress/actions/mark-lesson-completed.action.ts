"use server";

import { revalidatePath } from "next/cache";

import { markLessonCompleted } from "../services/mark-lesson-completed";

const DEMO_STUDENT_ID = "demo-student";

export type MarkLessonCompletedActionState = {
  success?: boolean;
  error?: string;
};

export async function markLessonCompletedAction(
  _previousState: MarkLessonCompletedActionState,
  formData: FormData,
): Promise<MarkLessonCompletedActionState> {
  const courseId = formData.get("courseId");
  const lessonId = formData.get("lessonId");

  if (typeof courseId !== "string" || typeof lessonId !== "string") {
    return {
      error: "Invalid lesson completion request.",
    };
  }

  const result = await markLessonCompleted({
    courseId,
    lessonId,
    studentId: DEMO_STUDENT_ID,
  });

  if (!result.success) {
    return {
      error: result.error,
    };
  }

  revalidatePath(`/courses/${courseId}/learn`);
  revalidatePath("/my-learning");

  return {
    success: true,
  };
}
