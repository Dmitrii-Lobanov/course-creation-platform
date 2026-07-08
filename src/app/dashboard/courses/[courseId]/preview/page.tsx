import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCoursePreview } from "@/features/courses/services/get-course-preview";
import { AppShell } from "@/shared/ui/app-shell";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionCard } from "@/shared/ui/section-card";
import { StatusPill } from "@/shared/ui/status-pill";

type CoursePreviewPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function CoursePreviewPage({
  params,
}: CoursePreviewPageProps) {
  const { courseId } = await params;

  const previewData = await getCoursePreview(courseId);

  if (!previewData) {
    notFound();
  }

  const { course, modules } = previewData;
  const totalLessons = modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );

  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <PageHeader
          eyebrow="Course Preview"
          title={course.title}
          description={course.description}
          action={
            <Link
              href={`/dashboard/courses/${course.id}/builder`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-card-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to builder
            </Link>
          }
        />

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <SectionCard>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <div className="mt-3">
              <StatusPill
                tone={course.status === "published" ? "success" : "warning"}
              >
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
            <p className="text-sm font-medium text-muted-foreground">Lessons</p>
            <p className="mt-3 text-3xl font-bold text-foreground">
              {totalLessons}
            </p>
          </SectionCard>
        </section>

        <section className="mt-8">
          <SectionCard>
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <BookOpen className="size-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Course curriculum
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This is how students will see the course structure.
                </p>
              </div>
            </div>

            {modules.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/50 p-8 text-center text-sm text-muted-foreground">
                No modules yet.
              </div>
            ) : (
              <div className="mt-8 space-y-5">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="rounded-2xl border border-border bg-card/70 p-5"
                  >
                    <h3 className="font-bold text-foreground">
                      {module.position}. {module.title}
                    </h3>

                    {module.lessons.length > 0 ? (
                      <div className="mt-4 space-y-3">
                        {module.lessons.map((lesson) => (
                          <article
                            key={lesson.id}
                            className="rounded-xl border border-border bg-muted/40 px-4 py-3"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <h4 className="text-sm font-semibold text-foreground">
                                {lesson.position}. {lesson.title}
                              </h4>

                              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">
                                {lesson.type}
                              </span>
                            </div>

                            {lesson.content ? (
                              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                                {lesson.content}
                              </p>
                            ) : null}
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-muted-foreground">
                        No lessons yet.
                      </p>
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
