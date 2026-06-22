import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/shared/ui/app-shell";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionCard } from "@/shared/ui/section-card";
import { StatusPill } from "@/shared/ui/status-pill";

export default function DashboardCoursesPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <PageHeader
          eyebrow="Course Management"
          title="Manage your course drafts."
          description="This workspace will list draft, published, and archived courses. For now, it is ready for the first database-backed course draft flow."
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

        <SectionCard className="mt-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                No course drafts yet
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                Once database persistence is connected, newly created course
                drafts will appear here with status, level, last update time,
                and quick access to the builder.
              </p>
            </div>

            <StatusPill tone="info">MVP stage</StatusPill>
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <BookOpen className="size-6 text-indigo-600" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-950">
              Start with your first draft
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
        </SectionCard>
      </main>
    </AppShell>
  );
}