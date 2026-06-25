import { desc, eq } from "drizzle-orm";
import { ArrowRight, BookOpen, Search } from "lucide-react";
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

export default async function CoursesPage() {
  const publishedCourses = await db
    .select({
      id: courses.id,
      title: courses.title,
      description: courses.description,
      level: courses.level,
      status: courses.status,
      updatedAt: courses.updatedAt,
    })
    .from(courses)
    .where(eq(courses.status, "published"))
    .orderBy(desc(courses.updatedAt));

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <PageHeader
          eyebrow="Course Catalog"
          title="Discover published courses."
          description="Browse published courses, explore their structure, and prepare for the student learning flow."
        />

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionCard>
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <Search className="size-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Search and filters
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Published courses are now loaded from Postgres. Search,
                  categories, and enrollment filters can be added after the
                  catalog detail page.
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Published courses
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  These courses passed publishing validation and are visible in
                  the student-facing catalog.
                </p>
              </div>

              <StatusPill tone="info">{`${publishedCourses.length} live`}</StatusPill>
            </div>

            {publishedCourses.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/60 p-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                  <BookOpen className="size-6" />
                </div>

                <h3 className="mt-4 text-lg font-bold text-foreground">
                  No published courses yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Publish a valid draft course from the builder. It will appear
                  here automatically after the status changes to published.
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-4">
                {publishedCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="group rounded-2xl border border-border bg-card/70 p-5 transition hover:bg-muted/40"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-foreground">
                            {course.title}
                          </h3>

                          <StatusPill tone="success">
                            {course.status}
                          </StatusPill>
                        </div>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {course.description}
                        </p>
                      </div>

                      <ArrowRight className="mt-1 size-5 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="capitalize">{course.level}</span>
                      <span>•</span>
                      <span>Updated {formatDate(course.updatedAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>
        </section>
      </main>
    </AppShell>
  );
}
