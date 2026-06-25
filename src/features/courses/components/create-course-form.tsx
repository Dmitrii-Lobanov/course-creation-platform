"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  createCourseAction,
  type CreateCourseActionState,
} from "../actions/create-course.action";

const initialState: CreateCourseActionState = {
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Creating course..." : "Create draft course"}
    </button>
  );
}

export function CreateCourseForm() {
  const [state, formAction] = useActionState(createCourseAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-semibold text-primary">
          Course title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          defaultValue={state.values?.title ?? ""}
          placeholder="Advanced React Performance"
          className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
        />

        {state.errors?.title ? (
          <p className="text-sm font-medium text-red-600">
            {state.errors.title[0]}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Use a specific title that clearly communicates the learning outcome.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-semibold text-primary"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          defaultValue={state.values?.description ?? ""}
          placeholder="Describe what students will learn, who the course is for, and what outcome they can expect."
          rows={6}
          className="w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm leading-6 text-foreground shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
        />

        {state.errors?.description ? (
          <p className="text-sm font-medium text-red-600">
            {state.errors.description[0]}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            This will later appear on the public course landing page.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="level" className="text-sm font-semibold text-primary">
          Course level
        </label>

        <select
          id="level"
          name="level"
          defaultValue={state.values?.level ?? ""}
          className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm text-foreground shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
        >
          <option value="" disabled>
            Select course level
          </option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        {state.errors?.level ? (
          <p className="text-sm font-medium text-red-600">
            {state.errors.level[0]}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Level helps students understand whether the course fits their
            current knowledge.
          </p>
        )}
      </div>

      {state.errors?.form ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.errors.form[0]}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          You can edit these details later in the builder.
        </p>

        <SubmitButton />
      </div>
    </form>
  );
}
