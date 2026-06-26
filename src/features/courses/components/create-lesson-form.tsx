"use client";

import { useActionState } from "react";

import {
  createLessonAction,
  type CreateLessonActionState,
} from "../actions/create-lesson.action";

type CreateLessonFormProps = {
  moduleId: string;
};

const initialState: CreateLessonActionState = {};

export function CreateLessonForm({ moduleId }: CreateLessonFormProps) {
  const [state, action, isPending] = useActionState(
    createLessonAction,
    initialState,
  );

  return (
    <form
      key={state.resetKey}
      action={action}
      className="mt-4 rounded-2xl border border-border bg-muted/40 p-4"
    >
      <input type="hidden" name="moduleId" value={moduleId} />

      <div className="grid gap-4 md:grid-cols-[1fr_160px]">
        <div>
          <label
            htmlFor={`lesson-title-${moduleId}`}
            className="text-sm font-semibold text-foreground"
          >
            Lesson title
          </label>

          <input
            id={`lesson-title-${moduleId}`}
            name="title"
            type="text"
            defaultValue={state.values?.title ?? ""}
            placeholder="Example: Welcome and setup"
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
            htmlFor={`lesson-type-${moduleId}`}
            className="text-sm font-semibold text-foreground"
          >
            Type
          </label>

          <select
            id={`lesson-type-${moduleId}`}
            name="type"
            defaultValue={state.values?.type ?? "text"}
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
          htmlFor={`lesson-content-${moduleId}`}
          className="text-sm font-semibold text-foreground"
        >
          Content
        </label>

        <textarea
          id={`lesson-content-${moduleId}`}
          name="content"
          rows={4}
          defaultValue={state.values?.content ?? ""}
          placeholder="Write the first lesson notes or a video URL placeholder."
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

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating lesson..." : "Add lesson"}
      </button>
    </form>
  );
}
