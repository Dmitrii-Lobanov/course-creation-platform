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
      className="rounded-md bg-foreground px-4 py-2 text-background disabled:cursor-not-allowed disabled:opacity-60"
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
        <label htmlFor="title" className="text-sm font-medium">
          Course title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          placeholder="Advanced React Performance"
          className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/20"
        />

        {state.errors?.title ? (
          <p className="text-sm text-red-500">{state.errors.title[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>

        <textarea
          id="description"
          name="description"
          placeholder="Describe what students will learn and why this course matters."
          rows={5}
          className="w-full resize-none rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/20"
        />

        {state.errors?.description ? (
          <p className="text-sm text-red-500">{state.errors.description[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="level" className="text-sm font-medium">
          Level
        </label>

        <select
          id="level"
          name="level"
          defaultValue=""
          className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/20"
        >
          <option value="" disabled>
            Select course level
          </option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        {state.errors?.level ? (
          <p className="text-sm text-red-500">{state.errors.level[0]}</p>
        ) : null}
      </div>

      {state.errors?.form ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.errors.form[0]}
        </div>
      ) : null}

      <SubmitButton />
    </form>
  );
}