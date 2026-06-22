import { desc, eq } from "drizzle-orm";
import { BookOpen, Clock, Plus } from "lucide-react";
import Link from "next/link";

import { db } from "@/db/client";
import { courses } from "@/db/schema";
import { AppShell } from "@/shared/ui/app-shell";
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

export default async function DashboardCoursesPage() {
  const draftCourses = await db
    .select({
      id: courses.id,
      title: courses.title,
      description: courses.description,
      level: courses.level,
      status: courses.status,
      updatedAt: courses.updatedAt,
      createdAt: courses.createdAt,
    })
    .from(courses)
    .where(eq(courses.status, "draft"))
    .orderBy(desc(courses.updatedAt));

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <PageHeader
          eyebrow="Course Management"
          title="Manage your course drafts."
          description="Review draft courses, continue building lessons, and prepare content for publishing."
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

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <SectionCard>
            <p className="text-sm font-medium text-slate-500">Draft courses</p>
            <p className="mt-3 text-3xl font-bold text-slate-950">
              {draftCourses.length}
            </p>
          </SectionCard>

          <SectionCard>
            <p className="text-sm font-medium text-slate-500">Published</p>
            <p className="mt-3 text-3xl font-bold text-slate-950">0</p>
          </SectionCard>

          <SectionCard>
            <p className="text-sm font-medium text-slate-500">Archived</p>
            <p className="mt-3 text-3xl font-bold text-slate-950">0</p>
          </SectionCard>
        </section>

        <SectionCard className="mt-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Draft courses
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                These courses are stored in Postgres and loaded with Drizzle on
                the server.
              </p>
            </div>

            <StatusPill tone="info">Database-backed</StatusPill>
          </div>

          {draftCourses.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <BookOpen className="size-6 text-indigo-600" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-950">
                No course drafts yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                Create the first course draft, then continue into the builder
                workflow for modules, lessons, preview mode, and publishing
                validation.
              </p>

              <Link
                href="/dashboard/courses/new"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create course draft
              </Link>
            </div>
          ) : (
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-[1.5fr_0.7fr_0.7fr_0.8fr] bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>Course</span>
                <span>Level</span>
                <span>Status</span>
                <span>Updated</span>
              </div>

              <div className="divide-y divide-slate-200">
                {draftCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/dashboard/courses/${course.id}/builder`}
                    className="grid grid-cols-[1.5fr_0.7fr_0.7fr_0.8fr] items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-950">
                        {course.title}
                      </h3>
                      <p className="mt-1 line-clamp-1 text-sm text-slate-600">
                        {course.description}
                      </p>
                    </div>

                    <span className="text-sm capitalize text-slate-700">
                      {course.level}
                    </span>

                    <span>
                      <StatusPill tone="warning">{course.status}</StatusPill>
                    </span>

                    <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="size-4" />
                      {formatDate(course.updatedAt)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      </main>
    </AppShell>
  );
}