import { ArrowLeft, BookOpen, CheckCircle2, PlayCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCoursePlayerData } from "@/features/courses/services/get-course-player-data";
import { AppShell } from "@/shared/ui/app-shell";
import { SectionCard } from "@/shared/ui/section-card";
import { StatusPill } from "@/shared/ui/status-pill";

const DEMO_STUDENT_ID = "demo-student";

type CoursePlayerPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function CoursePlayerPage({
  params,
}: CoursePlayerPageProps) {
  const { courseId } = await params;

  const playerData = await getCoursePlayerData({
    courseId,
    studentId: DEMO_STUDENT_ID,
  });

  if (!playerData) {
    notFound();
  }

  const { course, modules, currentLesson } = playerData;

  return (
    <AppShell>
      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[0.85fr_1.45fr]">
        <aside className="space-y-6">
          <Link
            href="/my-learning"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Back to my learning
          </Link>

          <SectionCard>
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <BookOpen className="size-5" />
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Now learning
                </p>
                <h1 className="mt-2 text-xl font-bold text-foreground">
                  {course.title}
                </h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {course.description}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <StatusPill tone="success">enrolled</StatusPill>
            </div>
          </SectionCard>

          <SectionCard>
            <h2 className="text-lg font-bold text-foreground">Curriculum</h2>

            <div className="mt-5 space-y-4">
              {modules.map((module) => (
                <div key={module.id}>
                  <h3 className="text-sm font-semibold text-foreground">
                    Module {module.position}: {module.title}
                  </h3>

                  <div className="mt-2 space-y-2">
                    {module.lessons.map((lesson) => {
                      const isCurrentLesson = lesson.id === currentLesson?.id;

                      return (
                        <div
                          key={lesson.id}
                          className={`rounded-xl border px-3 py-2 text-sm transition ${
                            isCurrentLesson
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-border bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isCurrentLesson ? (
                              <PlayCircle className="size-4" />
                            ) : (
                              <CheckCircle2 className="size-4 opacity-60" />
                            )}

                            <span>
                              {lesson.position}. {lesson.title}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </aside>

        <section>
          <SectionCard>
            {currentLesson ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Current lesson
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-foreground">
                      {currentLesson.title}
                    </h2>
                  </div>

                  <StatusPill tone="info">{currentLesson.type}</StatusPill>
                </div>

                <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-6">
                  {currentLesson.content ? (
                    <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                      {currentLesson.content}
                    </p>
                  ) : (
                    <p className="text-sm leading-7 text-muted-foreground">
                      This lesson does not have content yet.
                    </p>
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground opacity-60"
                  >
                    Progress tracking coming next
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                  <BookOpen className="size-6" />
                </div>

                <h2 className="mt-4 text-lg font-bold text-foreground">
                  No lessons available
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  This course does not have playable lessons yet.
                </p>
              </div>
            )}
          </SectionCard>
        </section>
      </main>
    </AppShell>
  );
}
