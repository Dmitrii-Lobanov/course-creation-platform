import { BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCourseBuilderData } from "@/features/courses/services/get-course-builder-data";
import { AppShell } from "@/shared/ui/app-shell";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionCard } from "@/shared/ui/section-card";
import { StatusPill } from "@/shared/ui/status-pill";
import { CreateModuleForm } from "@/features/courses/components/create-module-form";
import { CreateLessonForm } from "@/features/courses/components/create-lesson-form";

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
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-muted/60"
            >
              Back to courses
            </Link>
          }
        />

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <SectionCard>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <div className="mt-3">
              <StatusPill tone="warning">{course.status}</StatusPill>
            </div>
          </SectionCard>

          <SectionCard>
            <p className="text-sm font-medium text-muted-foreground">Level</p>
            <p className="mt-3 text-2xl font-bold capitalize text-foreground">
              {course.level}
            </p>
          </SectionCard>

          <SectionCard>
            <p className="text-sm font-medium text-muted-foreground">Modules</p>
            <p className="mt-3 text-3xl font-bold text-foreground">
              {modules.length}
            </p>
          </SectionCard>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionCard>
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <Layers className="size-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Course structure
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Add modules first, then lessons inside each module. This keeps
                  the builder predictable and prepares the publishing validation
                  workflow.
                </p>
              </div>
            </div>

            <CreateModuleForm courseId={course.id} />
          </SectionCard>

          <SectionCard>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Builder outline
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This outline is loaded from Postgres.
                </p>
              </div>

              <StatusPill tone="info">Database-backed</StatusPill>
            </div>

            {modules.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/60 p-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-card shadow-sm">
                  <BookOpen className="size-6 text-primary" />
                </div>

                <h3 className="mt-4 text-lg font-bold text-foreground">
                  No modules yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  The next step is adding a server action that creates the first
                  module for this draft course.
                </p>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="rounded-2xl border border-border bg-card/70 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-bold text-foreground">
                        {module.position}. {module.title}
                      </h3>

                      <span className="text-sm text-muted-foreground">
                        {module.lessons.length} lessons
                      </span>
                    </div>

                    {module.lessons.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <span>
                                {lesson.position}. {lesson.title}
                              </span>

                              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">
                                {lesson.type}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <CreateLessonForm moduleId={module.id} />
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
