"use client";

import { useActionState } from "react";

import {
  updateCourseAction,
  type UpdateCourseActionState,
} from "../actions/update-course.action";

type EditCourseFormProps = {
  course: {
    id: string;
    title: string;
    description: string;
    level: "beginner" | "intermediate" | "advanced";
  };
};

const initialState: UpdateCourseActionState = {};

export function EditCourseForm({ course }: EditCourseFormProps) {
  const [state, action, isPending] = useActionState(
    updateCourseAction,
    initialState,
  );

  return (
    <form
      action={action}
      className="mt-6 rounded-2xl border border-border bg-background/80 p-5"
    >
      <input type="hidden" name="courseId" value={course.id} />

      <div>
        <label
          htmlFor={`edit-course-title-${course.id}`}
          className="text-sm font-semibold text-foreground"
        >
          Course title
        </label>

        <input
          id={`edit-course-title-${course.id}`}
          name="title"
          type="text"
          defaultValue={state.values?.title ?? course.title}
          className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-primary/10"
        />

        {state.errors?.title ? (
          <p className="mt-2 text-sm text-destructive">
            {state.errors.title[0]}
          </p>
        ) : null}
      </div>

      <div className="mt-4">
        <label
          htmlFor={`edit-course-description-${course.id}`}
          className="text-sm font-semibold text-foreground"
        >
          Description
        </label>

        <textarea
          id={`edit-course-description-${course.id}`}
          name="description"
          rows={4}
          defaultValue={state.values?.description ?? course.description}
          className="mt-2 w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-primary/10"
        />

        {state.errors?.description ? (
          <p className="mt-2 text-sm text-destructive">
            {state.errors.description[0]}
          </p>
        ) : null}
      </div>

      <div className="mt-4">
        <label
          htmlFor={`edit-course-level-${course.id}`}
          className="text-sm font-semibold text-foreground"
        >
          Level
        </label>

        <select
          id={`edit-course-level-${course.id}`}
          name="level"
          defaultValue={state.values?.level ?? course.level}
          className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-primary/10"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        {state.errors?.level ? (
          <p className="mt-2 text-sm text-destructive">
            {state.errors.level[0]}
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
          Course updated.
        </p>
      ) : null}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving course..." : "Save course"}
        </button>
      </div>
    </form>
  );
}
