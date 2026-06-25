"use client";

import { useActionState } from "react";

import {
  createModuleAction,
  type CreateModuleActionState,
} from "../actions/create-module.action";

type CreateModuleFormProps = {
  courseId: string;
};

const initialState: CreateModuleActionState = {};

export function CreateModuleForm({ courseId }: CreateModuleFormProps) {
  const [state, action, isPending] = useActionState(
    createModuleAction,
    initialState,
  );

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="courseId" value={courseId} />

      <div>
        <label
          htmlFor="module-title"
          className="text-sm font-semibold text-foreground"
        >
          Module title
        </label>

        <input
          id="module-title"
          name="title"
          type="text"
          defaultValue={state.values?.title ?? ""}
          placeholder="Example: Getting started"
          className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-primary/10"
        />

        {state.errors?.title ? (
          <p className="mt-2 text-sm text-destructive">
            {state.errors.title[0]}
          </p>
        ) : null}
      </div>

      {state.errors?.form ? (
        <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.errors.form[0]}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating module..." : "Add module"}
      </button>
    </form>
  );
}
