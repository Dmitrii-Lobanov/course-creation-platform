import { BookOpen, CheckCircle2, Layers } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CreateLessonForm } from "@/features/courses/components/create-lesson-form";
import { CreateModuleForm } from "@/features/courses/components/create-module-form";
import { EditLessonForm } from "@/features/courses/components/edit-lesson-form";
import { EditModuleForm } from "@/features/courses/components/edit-module-form";
import { PublishCourseForm } from "@/features/courses/components/publish-course-form";
import { getCourseBuilderData } from "@/features/courses/services/get-course-builder-data";
import { validateCourseForPublishing } from "@/features/courses/services/validate-course-for-publishing";
import { AppShell } from "@/shared/ui/app-shell";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionCard } from "@/shared/ui/section-card";
import { StatusPill } from "@/shared/ui/status-pill";
import { DeleteLessonForm } from "@/features/courses/components/delete-lesson-form";
import { DeleteModuleForm } from "@/features/courses/components/delete-module-form";
import { EditCourseForm } from "@/features/courses/components/edit-course-form";
import { ReorderModuleForm } from "@/features/courses/components/reorder-module-form";
import { ReorderLessonForm } from "@/features/courses/components/reorder-lesson-form";

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
  const isPublished = course.status === "published";
  const isDraft = course.status === "draft";

  const publishingValidation = validateCourseForPublishing(
    {
      title: course.title,
      description: course.description,
      level: course.level,
    },
    modules,
  );

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <PageHeader
          eyebrow="Course Builder"
          title={course.title}
          description={course.description}
          action={
            <div className="flex items-center gap-3">
              <Link
                href={`/dashboard/courses/${course.id}/preview`}
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Preview course
              </Link>

              <Link
                href="/dashboard/courses"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-card-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                Back to courses
              </Link>
            </div>
          }
        />

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <SectionCard>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <div className="mt-3">
              <StatusPill tone={isPublished ? "success" : "warning"}>
                {course.status}
              </StatusPill>
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

        {isDraft ? (
          <section className="mt-8">
            <SectionCard>
              <h2 className="text-xl font-bold text-foreground">
                Course details
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Update the course metadata before publishing.
              </p>

              <EditCourseForm
                course={{
                  id: course.id,
                  title: course.title,
                  description: course.description,
                  level: course.level,
                }}
              />
            </SectionCard>
          </section>
        ) : null}

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-6">
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
                    Add modules first, then lessons inside each module. This
                    keeps the builder predictable and prepares the publishing
                    validation workflow.
                  </p>
                </div>
              </div>

              {isDraft ? (
                <CreateModuleForm courseId={course.id} />
              ) : (
                <div className="mt-6 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  Published courses cannot be edited in this MVP flow.
                </div>
              )}
            </SectionCard>

            <SectionCard>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Publishing readiness
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Validate the course structure before making it visible in the
                  catalog.
                </p>
              </div>

              <div className="mt-5 space-y-3">
                {publishingValidation.errors.length === 0 ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">
                    <CheckCircle2 className="size-4" />
                    Course is ready to publish.
                  </div>
                ) : (
                  publishingValidation.errors.map((error) => (
                    <div
                      key={error}
                      className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
                    >
                      {error}
                    </div>
                  ))
                )}
              </div>

              <PublishCourseForm
                courseId={course.id}
                isPublished={isPublished}
              />
            </SectionCard>
          </div>

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
              <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/50 p-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                  <BookOpen className="size-6" />
                </div>

                <h3 className="mt-4 text-lg font-bold text-foreground">
                  No modules yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Add the first module to start building the course structure.
                  Lessons will be created inside modules.
                </p>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {modules.map((module, moduleIndex) => (
                  <div
                    key={module.id}
                    className="rounded-2xl border border-border bg-card/70 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-bold text-foreground">
                        {module.position}. {module.title}
                      </h3>

                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {module.lessons.length} lessons
                        </span>

                        {isDraft ? (
                          <>
                            <ReorderModuleForm
                              courseId={course.id}
                              moduleId={module.id}
                              direction="up"
                              disabled={moduleIndex === 0}
                            />

                            <ReorderModuleForm
                              courseId={course.id}
                              moduleId={module.id}
                              direction="down"
                              disabled={moduleIndex === modules.length - 1}
                            />

                            <DeleteModuleForm
                              courseId={course.id}
                              moduleId={module.id}
                            />
                          </>
                        ) : null}
                      </div>
                    </div>

                    {isDraft ? (
                      <EditModuleForm
                        module={{
                          id: module.id,
                          courseId: course.id,
                          title: module.title,
                        }}
                      />
                    ) : null}

                    {module.lessons.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <span>
                                {lesson.position}. {lesson.title}
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">
                                  {lesson.type}
                                </span>

                                {isDraft ? (
                                  <>
                                    <ReorderLessonForm
                                      lessonId={lesson.id}
                                      moduleId={lesson.moduleId}
                                      direction="up"
                                      disabled={lessonIndex === 0}
                                    />

                                    <ReorderLessonForm
                                      lessonId={lesson.id}
                                      moduleId={lesson.moduleId}
                                      direction="down"
                                      disabled={
                                        lessonIndex ===
                                        module.lessons.length - 1
                                      }
                                    />

                                    <DeleteLessonForm
                                      lessonId={lesson.id}
                                      moduleId={lesson.moduleId}
                                    />
                                  </>
                                ) : null}
                              </div>
                            </div>

                            {isDraft ? (
                              <EditLessonForm lesson={lesson} />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {isDraft ? <CreateLessonForm moduleId={module.id} /> : null}
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
