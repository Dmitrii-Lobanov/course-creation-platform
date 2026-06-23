"use client";

import { CheckCircle2, CircleAlert } from "lucide-react";
import { useActionState } from "react";

import {
  publishCourseAction,
  type PublishCourseActionState,
} from "../actions/publish-course.action";

type PublishCourseFormProps = {
  courseId: string;
  isPublished: boolean;
};

const initialState: PublishCourseActionState = {};

export function PublishCourseForm({
  courseId,
  isPublished,
}: PublishCourseFormProps) {
  const [state, action, isPending] = useActionState(
    publishCourseAction,
    initialState,
  );

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="courseId" value={courseId} />

      {state.validationErrors?.length ? (
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 size-5 text-amber-500" />

            <div>
              <p className="font-semibold text-foreground">
                Course is not ready to publish
              </p>

              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {state.validationErrors.map((error) => (
                  <li key={error}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {state.errors?.form ? (
        <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.errors.form[0]}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending || isPublished}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CheckCircle2 className="size-4" />
        {isPublished
          ? "Already published"
          : isPending
            ? "Publishing..."
            : "Publish course"}
      </button>
    </form>
  );
}
