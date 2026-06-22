import { BookOpen, Layers, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCourseBuilderData } from "@/features/courses/services/get-course-builder-data";
import { AppShell } from "@/shared/ui/app-shell";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionCard } from "@/shared/ui/section-card";
import { StatusPill } from "@/shared/ui/status-pill";

type CourseBuilderPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function CourseBuilderPage({
  params,
}: CourseBuilderPageProps) {
  const { courseId } = await params;

  const builderData = await getCourseBuilderData(courseId);

  if (!builderData) {
    notFound();
  }

  const { course, modules } = builderData;

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <PageHeader
          eyebrow="Course Builder"
          title={course.title}
          description={course.description}
          action={
            <Link
              href="/dashboard/courses"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to courses
            </Link>
          }
        />

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <SectionCard>
            <p className="text-sm font-medium text-slate-500">Status</p>
            <div className="mt-3">
              <StatusPill tone="warning">{course.status}</StatusPill>
            </div>
          </SectionCard>

          <SectionCard>
            <p className="text-sm font-medium text-slate-500">Level</p>
            <p className="mt-3 text-2xl font-bold capitalize text-slate-950">
              {course.level}
            </p>
          </SectionCard>

          <SectionCard>
            <p className="text-sm font-medium text-slate-500">Modules</p>
            <p className="mt-3 text-3xl font-bold text-slate-950">
              {modules.length}
            </p>
          </SectionCard>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionCard>
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                <Layers className="size-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Course structure
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Add modules first, then lessons inside each module. This keeps
                  the builder predictable and prepares the publishing validation
                  workflow.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white opacity-60"
            >
              <Plus className="size-4" />
              Add module coming next
            </button>
          </SectionCard>

          <SectionCard>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Builder outline
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This outline is loaded from Postgres.
                </p>
              </div>

              <StatusPill tone="info">Database-backed</StatusPill>
            </div>

            {modules.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <BookOpen className="size-6 text-indigo-600" />
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-950">
                  No modules yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  The next step is adding a server action that creates the first
                  module for this draft course.
                </p>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-bold text-slate-950">
                        {module.position}. {module.title}
                      </h3>

                      <span className="text-sm text-slate-500">
                        {module.lessons.length} lessons
                      </span>
                    </div>

                    {module.lessons.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                          >
                            {lesson.position}. {lesson.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </section>
      </main>
    </AppShell>
  );
}