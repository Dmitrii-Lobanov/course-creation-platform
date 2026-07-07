"use client";

import { useActionState } from "react";

import {
  deleteLessonAction,
  type DeleteLessonActionState,
} from "../actions/delete-lesson.action";

type DeleteLessonFormProps = {
  lessonId: string;
  moduleId: string;
};

const initialState: DeleteLessonActionState = {};

export function DeleteLessonForm({
  lessonId,
  moduleId,
}: DeleteLessonFormProps) {
  const [state, action, isPending] = useActionState(
    deleteLessonAction,
    initialState,
  );

  return (
    <form action={action}>
      <input type="hidden" name="lessonId" value={lessonId} />
      <input type="hidden" name="moduleId" value={moduleId} />

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-full border border-destructive/30 px-3 py-1 text-xs font-semibold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>

      {state.errors?.form ? (
        <p className="mt-2 text-xs text-destructive">{state.errors.form[0]}</p>
      ) : null}
    </form>
  );
}
