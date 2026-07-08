"use client";

import { useActionState } from "react";

import {
  reorderLessonAction,
  type ReorderLessonActionState,
} from "../actions/reorder-lesson.action";

type ReorderLessonFormProps = {
  lessonId: string;
  moduleId: string;
  direction: "up" | "down";
  disabled?: boolean;
};

const initialState: ReorderLessonActionState = {};

export function ReorderLessonForm({
  lessonId,
  moduleId,
  direction,
  disabled = false,
}: ReorderLessonFormProps) {
  const [state, action, isPending] = useActionState(
    reorderLessonAction,
    initialState,
  );

  return (
    <form action={action}>
      <input type="hidden" name="lessonId" value={lessonId} />
      <input type="hidden" name="moduleId" value={moduleId} />
      <input type="hidden" name="direction" value={direction} />

      <button
        type="submit"
        disabled={disabled || isPending}
        className="inline-flex items-center justify-center rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        {direction === "up" ? "Up" : "Down"}
      </button>

      {state.errors?.form ? (
        <p className="mt-2 text-xs text-destructive">{state.errors.form[0]}</p>
      ) : null}
    </form>
  );
}
