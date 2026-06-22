import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage course drafts, publishing workflows, and student analytics.
        </p>
      </div>

      <div className="mt-8">
        <Link
          href="/dashboard/courses/new"
          className="rounded-md bg-foreground px-4 py-2 text-background"
        >
          Create course
        </Link>
      </div>
    </main>
  );
}