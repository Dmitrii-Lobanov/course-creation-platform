"use client";

import { CheckCircle2 } from "lucide-react";
import { useActionState } from "react";

import {
  markLessonCompletedAction,
  type MarkLessonCompletedActionState,
} from "../actions/mark-lesson-completed.action";

type MarkLessonCompletedFormProps = {
  courseId: string;
  lessonId: string;
  isCompleted: boolean;
};

const initialState: MarkLessonCompletedActionState = {};

export function MarkLessonCompletedForm({
  courseId,
  lessonId,
  isCompleted,
}: MarkLessonCompletedFormProps) {
  const [state, action, isPending] = useActionState(
    markLessonCompletedAction,
    initialState,
  );

  const completed = isCompleted || state.success;

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="lessonId" value={lessonId} />

      {state.error ? (
        <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending || completed}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {completed ? (
          <>
            <CheckCircle2 className="size-4" />
            Lesson completed
          </>
        ) : isPending ? (
          "Saving progress..."
        ) : (
          "Mark lesson as completed"
        )}
      </button>
    </form>
  );
}