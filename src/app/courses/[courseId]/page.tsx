import { ArrowLeft, BookOpen, CheckCircle2, Clock, Layers3 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublishedCourseDetail } from "@/features/courses/services/get-published-course-detail";
import { EnrollCourseForm } from "@/features/enrollments/components/enroll-course-form";
import { getEnrollmentStatus } from "@/features/enrollments/services/get-enrollment-status";
import { AppShell } from "@/shared/ui/app-shell";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionCard } from "@/shared/ui/section-card";
import { StatusPill } from "@/shared/ui/status-pill";

const DEMO_STUDENT_ID = "demo-student";

type CourseDetailPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { courseId } = await params;

  const courseDetail = await getPublishedCourseDetail(courseId);

  if (!courseDetail) {
    notFound();
  }

  const { course, modules } = courseDetail;

  const enrollmentStatus = await getEnrollmentStatus({
    courseId: course.id,
    studentId: DEMO_STUDENT_ID,
  });

  const lessonCount = modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <PageHeader
          eyebrow="Published Course"
          title={course.title}
          description={course.description}
          action={
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-card-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to catalog
            </Link>
          }
        />

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <SectionCard>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <div className="mt-3">
              <StatusPill tone="success">{course.status}</StatusPill>
            </div>
          </SectionCard>

          <SectionCard>
            <p className="text-sm font-medium text-muted-foreground">Level</p>
            <p className="mt-3 text-2xl font-bold capitalize text-foreground">
              {course.level}
            </p>
          </SectionCard>

          <SectionCard>
            <p className="text-sm font-medium text-muted-foreground">
              Lessons
            </p>
            <p className="mt-3 text-3xl font-bold text-foreground">
              {lessonCount}
            </p>
          </SectionCard>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <SectionCard>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Course curriculum
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Browse the modules and lessons included in this published
                  course.
                </p>
              </div>

              <StatusPill tone="info">{`${modules.length} modules`}</StatusPill>
            </div>

            {modules.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/50 p-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                  <BookOpen className="size-6" />
                </div>

                <h3 className="mt-4 text-lg font-bold text-foreground">
                  No curriculum yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  This course was published without visible modules. Publishing
                  validation should normally prevent this state.
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
                        Module {module.position}: {module.title}
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
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <div className="space-y-6">
            <SectionCard>
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Layers3 className="size-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Learning overview
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    This is the student-facing course view. Enrollment and
                    progress tracking will be added in the next milestone.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 text-primary" />
                  {enrollmentStatus.isEnrolled
                    ? "You are enrolled in this course"
                    : "Enrollment is available"}
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  <BookOpen className="size-4 text-primary" />
                  {`${modules.length} modules`}
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  <Clock className="size-4 text-primary" />
                  {`${lessonCount} lessons`}
                </div>
              </div>

              <EnrollCourseForm
                courseId={course.id}
                isEnrolled={enrollmentStatus.isEnrolled}
              />
            </SectionCard>
          </div>
        </section>
      </main>
    </AppShell>
  );
}