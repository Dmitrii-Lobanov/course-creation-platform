import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCoursePlayerData } from "@/features/courses/services/get-course-player-data";
import { MarkLessonCompletedForm } from "@/features/progress/components/mark-lesson-completed-form";
import { getCourseProgress } from "@/features/progress/services/get-course-progress";
import { AppShell } from "@/shared/ui/app-shell";
import { SectionCard } from "@/shared/ui/section-card";
import { StatusPill } from "@/shared/ui/status-pill";

const DEMO_STUDENT_ID = "demo-student";

type CoursePlayerPageProps = {
  params: Promise<{
    courseId: string;
  }>;
  searchParams: Promise<{
    lessonId?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function CoursePlayerPage({
  params,
  searchParams,
}: CoursePlayerPageProps) {
  const { courseId } = await params;
  const { lessonId } = await searchParams;

  const playerData = await getCoursePlayerData({
    courseId,
    studentId: DEMO_STUDENT_ID,
    lessonId,
  });

  if (!playerData) {
    notFound();
  }

  const { course, modules, currentLesson } = playerData;

  const lessonIds = modules.flatMap((module) =>
    module.lessons.map((lesson) => lesson.id),
  );

  const progress = await getCourseProgress({
    courseId,
    studentId: DEMO_STUDENT_ID,
    lessonIds,
  });

  const currentLessonCompleted = currentLesson
    ? progress.completedLessonIds.has(currentLesson.id)
    : false;

  const allLessons = modules.flatMap((module) => module.lessons);

  const currentLessonIndex = currentLesson
    ? allLessons.findIndex((lesson) => lesson.id === currentLesson.id)
    : -1;

  const previousLesson =
    currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;

  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]
      : null;

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Link
          href="/my-learning"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to my learning
        </Link>

        <section className="mt-8 grid items-start gap-6 lg:grid-cols-[0.85fr_1.45fr]">
          <aside className="space-y-6">
            <SectionCard className="min-h-[17rem]">
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

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <StatusPill tone="success">enrolled</StatusPill>
                <StatusPill tone="info">
                  {`${progress.completionPercentage}% complete`}
                </StatusPill>
              </div>

              <div className="mt-5">
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${progress.completionPercentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {`${progress.completedCount} of ${progress.totalCount} lessons completed`}
                </p>
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
                        const isCompleted = progress.completedLessonIds.has(
                          lesson.id,
                        );

                        return (
                          <Link
                            key={lesson.id}
                            href={`/courses/${course.id}/learn?lessonId=${lesson.id}`}
                            className={`block rounded-xl border px-3 py-2 text-sm transition ${
                              isCurrentLesson
                                ? "border-primary/30 bg-primary/10 text-primary"
                                : "border-border bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCompleted ? (
                                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                              ) : isCurrentLesson ? (
                                <PlayCircle className="size-4" />
                              ) : (
                                <Clock className="size-4 opacity-60" />
                              )}

                              <span>
                                {lesson.position}. {lesson.title}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </aside>

          <div>
            <SectionCard className="min-h-[17rem]">
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

                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {currentLessonCompleted ? (
                        <StatusPill tone="success">completed</StatusPill>
                      ) : null}

                      <StatusPill tone="info">{currentLesson.type}</StatusPill>
                    </div>
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

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {previousLesson ? (
                      <Link
                        href={`/courses/${course.id}/learn?lessonId=${previousLesson.id}`}
                        className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-card-foreground transition hover:bg-accent hover:text-accent-foreground"
                      >
                        ← Previous lesson
                      </Link>
                    ) : (
                      <span />
                    )}

                    {nextLesson ? (
                      <Link
                        href={`/courses/${course.id}/learn?lessonId=${nextLesson.id}`}
                        className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-card-foreground transition hover:bg-accent hover:text-accent-foreground"
                      >
                        Next lesson →
                      </Link>
                    ) : null}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <MarkLessonCompletedForm
                      courseId={course.id}
                      lessonId={currentLesson.id}
                      isCompleted={currentLessonCompleted}
                      nextLessonId={nextLesson?.id}
                    />
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
          </div>
        </section>
      </main>
    </AppShell>
  );
}
