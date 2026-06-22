// src/app/dashboard/courses/new/page.tsx
import Link from "next/link";

import { CreateCourseForm } from "@/features/courses/components/create-course-form";

export default function NewCoursePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 space-y-3">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to dashboard
        </Link>

        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Course Draft
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Create a new course
          </h1>

          <p className="text-muted-foreground">
            Start with the core course details. You will add modules, lessons,
            publishing validation, and preview mode in the builder.
          </p>
        </div>
      </div>

      <section className="rounded-lg border p-6">
        <CreateCourseForm />
      </section>
    </main>
  );
}