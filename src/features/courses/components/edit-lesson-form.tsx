"use client";

import { useActionState } from "react";

import {
  updateLessonAction,
  type UpdateLessonActionState,
} from "../actions/update-lesson.action";

type EditLessonFormProps = {
  lesson: {
    id: string;
    moduleId: string;
    title: string;
    type: "text" | "video";
    content?: string | null;
  };
};

const initialState: UpdateLessonActionState = {};

export function EditLessonForm({ lesson }: EditLessonFormProps) {
  const [state, action, isPending] = useActionState(
    updateLessonAction,
    initialState,
  );

  return (
    <form
      action={action}
      className="mt-3 rounded-2xl border border-border bg-background/80 p-4"
    >
      <input type="hidden" name="lessonId" value={lesson.id} />
      <input type="hidden" name="moduleId" value={lesson.moduleId} />

      <div className="grid gap-4 md:grid-cols-[1fr_160px]">
        <div>
          <label
            htmlFor={`edit-lesson-title-${lesson.id}`}
            className="text-sm font-semibold text-foreground"
          >
            Lesson title
          </label>

          <input
            id={`edit-lesson-title-${lesson.id}`}
            name="title"
            type="text"
            defaultValue={state.values?.title ?? lesson.title}
            className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-primary/10"
          />

          {state.errors?.title ? (
            <p className="mt-2 text-sm text-destructive">
              {state.errors.title[0]}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor={`edit-lesson-type-${lesson.id}`}
            className="text-sm font-semibold text-foreground"
          >
            Type
          </label>

          <select
            id={`edit-lesson-type-${lesson.id}`}
            name="type"
            defaultValue={state.values?.type ?? lesson.type}
            className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-primary/10"
          >
            <option value="text">Text</option>
            <option value="video">Video</option>
          </select>

          {state.errors?.type ? (
            <p className="mt-2 text-sm text-destructive">
              {state.errors.type[0]}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor={`edit-lesson-content-${lesson.id}`}
          className="text-sm font-semibold text-foreground"
        >
          Content
        </label>

        <textarea
          id={`edit-lesson-content-${lesson.id}`}
          name="content"
          rows={4}
          defaultValue={state.values?.content ?? lesson.content ?? ""}
          className="mt-2 w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-primary/10"
        />

        {state.errors?.content ? (
          <p className="mt-2 text-sm text-destructive">
            {state.errors.content[0]}
          </p>
        ) : null}
      </div>

      {state.errors?.form ? (
        <p className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.errors.form[0]}
        </p>
      ) : null}

      {state.success ? (
        <p className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          Lesson updated.
        </p>
      ) : null}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving lesson..." : "Save lesson"}
        </button>
      </div>
    </form>
  );
}