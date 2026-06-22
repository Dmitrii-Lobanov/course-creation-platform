import { ArrowLeft, CheckCircle2, Layers3, Rocket } from "lucide-react";
import Link from "next/link";

import { CreateCourseForm } from "@/features/courses/components/create-course-form";
import { AppShell } from "@/shared/ui/app-shell";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionCard } from "@/shared/ui/section-card";
import { StatusPill } from "@/shared/ui/status-pill";

export default function NewCoursePage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>

        <PageHeader
          eyebrow="Course Draft"
          title="Create a new course workspace."
          description="Start with the essential course details. After creation, you will move into the builder where modules, lessons, preview mode, and publishing readiness live."
        />

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <SectionCard>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Course details
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  These fields define the first draft. You can refine them later
                  in the course builder.
                </p>
              </div>

              <StatusPill tone="warning">Draft</StatusPill>
            </div>

            <CreateCourseForm />
          </SectionCard>

          <div className="space-y-6">
            <SectionCard>
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                  <Rocket className="size-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    What happens next?
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    The course draft opens in the builder. The MVP will then add
                    modules, lessons, reordering, preview mode, publishing
                    checks, and student-facing course pages.
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <h2 className="text-lg font-bold text-slate-950">
                Publishing readiness
              </h2>

              <div className="mt-5 space-y-4">
                {[
                  "Course has a clear title",
                  "Description explains learning value",
                  "Level helps students choose correctly",
                  "Modules and lessons will be added next",
                ].map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    {index < 3 ? (
                      <CheckCircle2 className="size-5 text-emerald-500" />
                    ) : (
                      <Layers3 className="size-5 text-slate-400" />
                    )}
                    <span className="text-sm text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
