// src/app/dashboard/courses/[courseId]/builder/page.tsx
import Link from "next/link";

type CourseBuilderPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function CourseBuilderPage({
  params,
}: CourseBuilderPageProps) {
  const { courseId } = await params;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 space-y-3">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to dashboard
        </Link>

        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Course Builder
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Draft course builder
          </h1>

          <p className="text-muted-foreground">
            Course draft created successfully. Builder implementation will add
            modules, lessons, preview mode, autosave, and publishing validation.
          </p>
        </div>
      </div>

      <section className="rounded-lg border p-6">
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="font-medium">Course ID</dt>
            <dd className="text-muted-foreground">{courseId}</dd>
          </div>

          <div>
            <dt className="font-medium">Status</dt>
            <dd className="text-muted-foreground">Draft</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}