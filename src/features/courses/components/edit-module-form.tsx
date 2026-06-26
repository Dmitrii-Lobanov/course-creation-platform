"use client";

import { useActionState } from "react";

import {
  updateModuleAction,
  type UpdateModuleActionState,
} from "../actions/update-module.action";

type EditModuleFormProps = {
  module: {
    id: string;
    courseId: string;
    title: string;
  };
};

const initialState: UpdateModuleActionState = {};

export function EditModuleForm({ module }: EditModuleFormProps) {
  const [state, action, isPending] = useActionState(
    updateModuleAction,
    initialState,
  );

  return (
    <form
      action={action}
      className="mt-4 rounded-2xl border border-border bg-background/80 p-4"
    >
      <input type="hidden" name="courseId" value={module.courseId} />
      <input type="hidden" name="moduleId" value={module.id} />

      <label
        htmlFor={`edit-module-title-${module.id}`}
        className="text-sm font-semibold text-foreground"
      >
        Module title
      </label>

      <input
        id={`edit-module-title-${module.id}`}
        name="title"
        type="text"
        defaultValue={state.values?.title ?? module.title}
        className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-primary/10"
      />

      {state.errors?.title ? (
        <p className="mt-2 text-sm text-destructive">{state.errors.title[0]}</p>
      ) : null}

      {state.errors?.form ? (
        <p className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.errors.form[0]}
        </p>
      ) : null}

      {state.success ? (
        <p className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          Module updated.
        </p>
      ) : null}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving module..." : "Save module"}
        </button>
      </div>
    </form>
  );
}
