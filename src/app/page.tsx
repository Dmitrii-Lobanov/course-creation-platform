import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <section className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            CourseForge
          </p>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Build, publish, and manage educational courses with a production-style platform.
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground">
            CourseForge is a fullstack course creation platform focused on instructor workflows,
            structured course building, publishing validation, student progress, and analytics.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="rounded-md bg-foreground px-4 py-2 text-background"
          >
            Open dashboard
          </Link>

          <Link
            href="/courses"
            className="rounded-md border px-4 py-2"
          >
            Browse courses
          </Link>
        </div>
      </section>
    </main>
  );
}