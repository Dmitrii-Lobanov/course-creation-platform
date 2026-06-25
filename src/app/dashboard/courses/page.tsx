import { desc, eq } from "drizzle-orm";
import { BookOpen, Clock, ExternalLink, Plus } from "lucide-react";
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

  const publishedCourses = await db
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
    .where(eq(courses.status, "published"))
    .orderBy(desc(courses.updatedAt));

  const archivedCourses = await db
    .select({
      id: courses.id,
    })
    .from(courses)
    .where(eq(courses.status, "archived"));

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <PageHeader
          eyebrow="Course Management"
          title="Manage your courses."
          description="Review drafts, continue building lessons, and monitor published courses from one place."
          action={
            <Link
              href="/dashboard/courses/new"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:opacity-90"
            >
              <Plus className="size-4" />
              Create course
            </Link>
          }
        />

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <SectionCard>
            <p className="text-sm font-medium text-muted-foreground">
              Draft courses
            </p>
            <p className="mt-3 text-3xl font-bold text-foreground">
              {draftCourses.length}
            </p>
          </SectionCard>

          <SectionCard>
            <p className="text-sm font-medium text-muted-foreground">
              Published
            </p>
            <p className="mt-3 text-3xl font-bold text-foreground">
              {publishedCourses.length}
            </p>
          </SectionCard>

          <SectionCard>
            <p className="text-sm font-medium text-muted-foreground">
              Archived
            </p>
            <p className="mt-3 text-3xl font-bold text-foreground">
              {archivedCourses.length}
            </p>
          </SectionCard>
        </section>

        <SectionCard className="mt-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Draft courses
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Continue editing unpublished courses in the builder before they
                become visible in the catalog.
              </p>
            </div>

            <StatusPill tone="info">Database-backed</StatusPill>
          </div>

          {draftCourses.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/50 p-8 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
                <BookOpen className="size-6" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-foreground">
                No course drafts yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Create the first course draft, then continue into the builder
                workflow for modules, lessons, preview mode, and publishing
                validation.
              </p>

              <Link
                href="/dashboard/courses/new"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Create course draft
              </Link>
            </div>
          ) : (
            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card/60">
              <div className="grid grid-cols-[1.5fr_0.7fr_0.7fr_0.8fr] bg-muted/70 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span>Course</span>
                <span>Level</span>
                <span>Status</span>
                <span>Updated</span>
              </div>

              <div className="divide-y divide-border">
                {draftCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/dashboard/courses/${course.id}/builder`}
                    className="grid grid-cols-[1.5fr_0.7fr_0.7fr_0.8fr] items-center gap-4 px-5 py-4 transition hover:bg-muted/50"
                  >
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {course.title}
                      </h3>
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {course.description}
                      </p>
                    </div>

                    <span className="text-sm capitalize text-muted-foreground">
                      {course.level}
                    </span>

                    <span>
                      <StatusPill tone="warning">{course.status}</StatusPill>
                    </span>

                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="size-4" />
                      {formatDate(course.updatedAt)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard className="mt-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Published courses
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                These courses are live in the catalog and visible to students.
              </p>
            </div>

            <StatusPill tone="success">{`${publishedCourses.length} live`}</StatusPill>
          </div>

          {publishedCourses.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/50 p-8 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
                <BookOpen className="size-6" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-foreground">
                No published courses yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Publish a valid draft from the builder. It will appear here and
                in the public catalog.
              </p>
            </div>
          ) : (
            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card/60">
              <div className="grid grid-cols-[1.5fr_0.7fr_0.7fr_0.8fr] bg-muted/70 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span>Course</span>
                <span>Level</span>
                <span>Status</span>
                <span>Updated</span>
              </div>

              <div className="divide-y divide-border">
                {publishedCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="grid grid-cols-[1.5fr_0.7fr_0.7fr_0.8fr] items-center gap-4 px-5 py-4 transition hover:bg-muted/50"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {course.title}
                        </h3>
                        <ExternalLink className="size-4 text-muted-foreground" />
                      </div>

                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {course.description}
                      </p>
                    </div>

                    <span className="text-sm capitalize text-muted-foreground">
                      {course.level}
                    </span>

                    <span>
                      <StatusPill tone="success">{course.status}</StatusPill>
                    </span>

                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
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
