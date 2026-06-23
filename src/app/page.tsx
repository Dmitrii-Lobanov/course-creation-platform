import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Layers3,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/shared/ui/app-shell";
import { SectionCard } from "@/shared/ui/section-card";
import { StatusPill } from "@/shared/ui/status-pill";

const features = [
  {
    title: "Structured course builder",
    description:
      "Design courses with modules, lessons, draft states, and publishing readiness checks.",
    icon: Layers3,
  },
  {
    title: "Student progress tracking",
    description:
      "Track lesson completion, course progress, and learning continuation flows.",
    icon: CheckCircle2,
  },
  {
    title: "Instructor analytics",
    description:
      "Give creators visibility into enrollments, progress, completion, and course health.",
    icon: BarChart3,
  },
];

export default function HomePage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium text-primary shadow-sm">
              <Sparkles className="size-4" />
              Production-style course creation platform
            </div>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-foreground md:text-7xl">
                Build courses like a product team.
              </h1>

              <p className="max-w-2xl text-xl leading-9 text-muted-foreground">
                CourseForge helps instructors create structured courses,
                validate publishing readiness, track student progress, and
                manage learning workflows from one polished workspace.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:opacity-90"
              >
                Open dashboard
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-card-foreground shadow-sm transition hover:bg-accent hover:text-accent-foreground"
              >
                Browse catalog
              </Link>
            </div>
          </div>

          <SectionCard className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />

            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Course Builder
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-foreground">
                    Advanced React Systems
                  </h2>
                </div>

                <StatusPill tone="warning">Draft</StatusPill>
              </div>

              <div className="grid gap-3">
                {[
                  "Product context",
                  "Rendering performance",
                  "State architecture",
                ].map((module, index) => (
                  <div
                    key={module}
                    className="rounded-2xl border border-border bg-muted/70 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">
                        Module {index + 1}: {module}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {index + 2} lessons
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-border bg-background/80 p-5 text-foreground">
                <p className="text-sm text-muted-foreground">
                  Publishing readiness
                </p>
                <div className="mt-4 grid gap-3">
                  {[
                    "Course details",
                    "At least one module",
                    "Lesson content",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="size-4 text-emerald-400" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </section>

        <section className="mt-20 grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm"
              >
                <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>

                <h3 className="text-lg font-bold text-foreground">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </section>
      </main>
    </AppShell>
  );
}
