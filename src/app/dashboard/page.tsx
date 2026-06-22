import { desc, eq } from "drizzle-orm";
import { BookOpen, GraduationCap, LineChart, Plus, Users } from "lucide-react";
import Link from "next/link";

import { db } from "@/db/client";
import { courses } from "@/db/schema";
import { AppShell } from "@/shared/ui/app-shell";
import { MetricCard } from "@/shared/ui/metric-card";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionCard } from "@/shared/ui/section-card";
import { StatusPill } from "@/shared/ui/status-pill";

export const dynamic = "force-dynamic";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export default async function DashboardPage() {
  const allCourses = await db
    .select({
      id: courses.id,
      title: courses.title,
      description: courses.description,
      level: courses.level,
      status: courses.status,
      updatedAt: courses.updatedAt,
    })
    .from(courses)
    .orderBy(desc(courses.updatedAt));

  const draftCourses = allCourses.filter((course) => course.status === "draft");
  const publishedCourses = allCourses.filter(
    (course) => course.status === "published",
  );

  const recentCourses = allCourses.slice(0, 5);

  const stats = [
    {
      label: "Draft courses",
      value: String(draftCourses.length),
      description: "Courses currently being prepared for publishing.",
      icon: <BookOpen className="size-5" />,
    },
    {
      label: "Published courses",
      value: String(publishedCourses.length),
      description: "Courses visible to students in the catalog.",
      icon: <GraduationCap className="size-5" />,
    },
    {
      label: "Students enrolled",
      value: "0",
      description: "Total enrollments across all published courses.",
      icon: <Users className="size-5" />,
    },
    {
      label: "Average progress",
      value: "—",
      description: "Progress analytics will appear after enrollments.",
      icon: <LineChart className="size-5" />,
    },
  ];

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <PageHeader
          eyebrow="Instructor Workspace"
          title="Manage your course creation pipeline."
          description="Create course drafts, prepare structured learning content, publish validated courses, and track student progress from one workspace."
          action={
            <Link
              href="/dashboard/courses/new"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800"
            >
              <Plus className="size-4" />
              Create course
            </Link>
          }
        />

        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <MetricCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <SectionCard>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Recent courses
                </p>
                <h2 className="mt-3 text-2xl font-bold text-slate-950">
                  {recentCourses.length > 0
                    ? "Recently updated courses"
                    : "No courses yet"}
                </h2>
                <p className="mt-2 max-w-xl leading-7 text-slate-600">
                  {recentCourses.length > 0
                    ? "Continue editing your latest drafts and prepare them for publishing."
                    : "Start with a course draft. The next milestones will add modules, lessons, publishing validation, enrollment, progress tracking, and analytics."}
                </p>
              </div>

              <StatusPill tone="info">Database-backed</StatusPill>
            </div>

            {recentCourses.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <BookOpen className="size-6 text-indigo-600" />
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-950">
                  Create your first course draft
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Define the core course details now. Modules, lessons, preview
                  mode, and publishing checks will be added inside the builder
                  workflow.
                </p>

                <Link
                  href="/dashboard/courses/new"
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Start course draft
                </Link>
              </div>
            ) : (
              <div className="mt-8 space-y-3">
                {recentCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/dashboard/courses/${course.id}/builder`}
                    className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:bg-indigo-50/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-950">
                          {course.title}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-sm text-slate-600">
                          {course.description}
                        </p>
                      </div>

                      <StatusPill
                        tone={course.status === "draft" ? "warning" : "success"}
                      >
                        {course.status}
                      </StatusPill>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="capitalize">{course.level}</span>
                      <span>•</span>
                      <span>Updated {formatDate(course.updatedAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Product workflow
            </p>

            <div className="mt-6 space-y-4">
              {[
                ["1", "Create draft", "Capture title, description, and level."],
                ["2", "Build structure", "Add modules, lessons, and ordering."],
                ["3", "Validate publishing", "Check readiness before release."],
                ["4", "Track progress", "Measure enrollments and completion."],
              ].map(([step, title, description]) => (
                <div key={step} className="flex gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700">
                    {step}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </section>
      </main>
    </AppShell>
  );
}