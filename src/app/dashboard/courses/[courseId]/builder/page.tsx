import { ArrowLeft, CheckCircle2, Layers3, PencilLine } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/shared/ui/app-shell";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionCard } from "@/shared/ui/section-card";
import { StatusPill } from "@/shared/ui/status-pill";

type CourseBuilderPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function CourseBuilderPage({
  params,
}: CourseBuilderPageProps) {
  const { courseId } = await params;

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
          eyebrow="Course Builder"
          title="Draft course workspace."
          description="This is the builder placeholder. The next product slice will add modules, lessons, editing states, preview mode, autosave, and publishing validation."
          action={<StatusPill tone="warning">Draft</StatusPill>}
        />

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionCard>
            <h2 className="text-lg font-bold text-slate-950">
              Course structure
            </h2>

            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <Layers3 className="mx-auto size-8 text-indigo-600" />
              <h3 className="mt-4 font-semibold text-slate-950">
                No modules yet
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Modules and lessons will be added in the next implementation
                milestone.
              </p>
            </div>
          </SectionCard>

          <SectionCard>
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 className="size-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Draft created successfully
                </h2>
                <p className="mt-2 leading-7 text-slate-600">
                  The temporary flow is working. Once database persistence is
                  connected, this page will load the real course draft.
                </p>
              </div>
            </div>

            <dl className="mt-8 grid gap-4 rounded-2xl bg-slate-50 p-5 text-sm">
              <div>
                <dt className="font-semibold text-slate-950">Course ID</dt>
                <dd className="mt-1 break-all text-slate-600">{courseId}</dd>
              </div>

              <div>
                <dt className="font-semibold text-slate-950">Status</dt>
                <dd className="mt-1 text-slate-600">Draft</dd>
              </div>
            </dl>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white opacity-50">
              <PencilLine className="size-4" />
              Builder editing coming next
            </div>
          </SectionCard>
        </section>
      </main>
    </AppShell>
  );
}
