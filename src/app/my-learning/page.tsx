import { BookOpen, Clock, PlayCircle } from "lucide-react";
import Link from "next/link";

import { getEnrolledCourses } from "@/features/enrollments/services/get-enrolled-courses";
import { AppShell } from "@/shared/ui/app-shell";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionCard } from "@/shared/ui/section-card";
import { StatusPill } from "@/shared/ui/status-pill";

const DEMO_STUDENT_ID = "demo-student";

export const dynamic = "force-dynamic";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export default async function MyLearningPage() {
  const enrolledCourses = await getEnrolledCourses({
    studentId: DEMO_STUDENT_ID,
  });

  const inProgressCourses = enrolledCourses.filter(
    (course) =>
      course.completionPercentage > 0 && course.completionPercentage < 100,
  );

  const completedCourses = enrolledCourses.filter(
    (course) => course.completionPercentage === 100,
  );

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <PageHeader
          eyebrow="Student Workspace"
          title="My learning."
          description="Continue enrolled courses and track your learning progress."
        />

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <SectionCard>
            <p className="text-sm font-medium text-muted-foreground">
              Enrolled courses
            </p>
            <p className="mt-3 text-3xl font-bold text-foreground">
              {enrolledCourses.length}
            </p>
          </SectionCard>

          <SectionCard>
            <p className="text-sm font-medium text-muted-foreground">
              In progress
            </p>
            <p className="mt-3 text-3xl font-bold text-foreground">
              {inProgressCourses.length}
            </p>
          </SectionCard>

          <SectionCard>
            <p className="text-sm font-medium text-muted-foreground">
              Completed
            </p>
            <p className="mt-3 text-3xl font-bold text-foreground">
              {completedCourses.length}
            </p>
          </SectionCard>
        </section>

        <SectionCard className="mt-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Enrolled courses
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                These are the courses joined by the demo student. Real user
                accounts will replace this demo identity later.
              </p>
            </div>

            <StatusPill tone="info">{`${enrolledCourses.length} enrolled`}</StatusPill>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/50 p-8 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
                <BookOpen className="size-6" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-foreground">
                No enrolled courses yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Open the catalog, choose a published course, and enroll to see
                it here.
              </p>

              <Link
                href="/courses"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Browse catalog
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {enrolledCourses.map((item) => (
                <Link
                  key={item.enrollmentId}
                  href={`/courses/${item.courseId}/learn`}
                  className="group rounded-2xl border border-border bg-card/70 p-5 transition hover:bg-muted/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-foreground">
                          {item.title}
                        </h3>

                        <StatusPill tone="success">enrolled</StatusPill>
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    <PlayCircle className="mt-1 size-5 shrink-0 text-muted-foreground transition group-hover:text-primary" />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="capitalize">{item.level}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-4" />
                      Enrolled {formatDate(item.enrolledAt)}
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="font-medium text-foreground">
                        {`${item.completionPercentage}% complete`}
                      </span>

                      <span className="text-muted-foreground">
                        {`${item.completedLessons} / ${item.totalLessons} lessons`}
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${item.completionPercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </SectionCard>
      </main>
    </AppShell>
  );
}
