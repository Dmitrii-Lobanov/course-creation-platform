import { BookOpen, Search } from "lucide-react";

import { AppShell } from "@/shared/ui/app-shell";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionCard } from "@/shared/ui/section-card";
import { StatusPill } from "@/shared/ui/status-pill";

export default function CoursesPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <PageHeader
          eyebrow="Course Catalog"
          title="Discover published courses."
          description="The public course catalog will show published courses, enrollment state, levels, and student progress. For now, this page is a polished placeholder until persistence is connected."
        />

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionCard>
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                <Search className="size-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Search and filters coming next
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Published courses will be searchable by title, level, category,
                  and enrollment status.
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  No published courses yet
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  Once instructor drafts can be persisted and published, courses
                  will appear here for students to browse and enroll.
                </p>
              </div>

              <StatusPill tone="info">MVP stage</StatusPill>
            </div>

            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <BookOpen className="size-6 text-indigo-600" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-950">
                Catalog is ready for real data
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                The next backend milestones will add database-backed courses,
                publishing workflow, enrollment, and progress tracking.
              </p>
            </div>
          </SectionCard>
        </section>
      </main>
    </AppShell>
  );
}