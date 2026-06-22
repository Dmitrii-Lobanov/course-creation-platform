import { BookOpen, GraduationCap, LineChart, Plus, Users } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/shared/ui/app-shell";
import { MetricCard } from "@/shared/ui/metric-card";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionCard } from "@/shared/ui/section-card";
import { StatusPill } from "@/shared/ui/status-pill";

const stats = [
  {
    label: "Draft courses",
    value: "0",
    description: "Courses currently being prepared for publishing.",
    icon: <BookOpen className="size-5" />,
  },
  {
    label: "Published courses",
    value: "0",
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

export default function DashboardPage() {
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
                  No courses yet
                </h2>
                <p className="mt-2 max-w-xl leading-7 text-slate-600">
                  Start with a course draft. The next milestones will add
                  modules, lessons, publishing validation, enrollment, progress
                  tracking, and analytics.
                </p>
              </div>

              <StatusPill tone="info">MVP stage</StatusPill>
            </div>

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
