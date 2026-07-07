"use client";

import { useActionState } from "react";

import {
  deleteModuleAction,
  type DeleteModuleActionState,
} from "../actions/delete-module.action";

type DeleteModuleFormProps = {
  courseId: string;
  moduleId: string;
};

const initialState: DeleteModuleActionState = {};

export function DeleteModuleForm({
  courseId,
  moduleId,
}: DeleteModuleFormProps) {
  const [state, action, isPending] = useActionState(
    deleteModuleAction,
    initialState,
  );

  return (
    <form action={action}>
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="moduleId" value={moduleId} />

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-full border border-destructive/30 px-3 py-1 text-xs font-semibold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Deleting..." : "Delete module"}
      </button>

      {state.errors?.form ? (
        <p className="mt-2 text-xs text-destructive">{state.errors.form[0]}</p>
      ) : null}
    </form>
  );
}
