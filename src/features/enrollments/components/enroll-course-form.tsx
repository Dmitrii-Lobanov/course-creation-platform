"use client";

import { CheckCircle2 } from "lucide-react";
import { useActionState } from "react";

import {
  enrollInCourseAction,
  type EnrollInCourseActionState,
} from "../actions/enroll-in-course.action";

type EnrollCourseFormProps = {
  courseId: string;
  isEnrolled: boolean;
};

const initialState: EnrollInCourseActionState = {};

export function EnrollCourseForm({
  courseId,
  isEnrolled,
}: EnrollCourseFormProps) {
  const [state, action, isPending] = useActionState(
    enrollInCourseAction,
    initialState,
  );

  const enrolled = isEnrolled || state.success;

  return (
    <form action={action} className="mt-6 space-y-3">
      <input type="hidden" name="courseId" value={courseId} />

      {state.error ? (
        <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending || enrolled}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enrolled ? (
          <>
            <CheckCircle2 className="size-4" />
            Enrolled
          </>
        ) : isPending ? (
          "Enrolling..."
        ) : (
          "Enroll in course"
        )}
      </button>
    </form>
  );
}
