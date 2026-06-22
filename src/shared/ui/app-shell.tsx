import Link from "next/link";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/courses/new", label: "Create" },
  { href: "/courses", label: "Catalog" },
];

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.12),transparent_32rem),linear-gradient(180deg,#f8fafc_0%,#ffffff_45%,#f8fafc_100%)]">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-sm">
              CF
            </div>
            <div className="leading-tight">
              <p className="font-semibold tracking-tight">CourseForge</p>
              <p className="text-xs text-muted-foreground">Creator workspace</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border bg-white/80 p-1 shadow-sm md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-slate-100 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/dashboard/courses/new"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            New course
          </Link>
        </div>
      </header>

      {children}
    </div>
  );
}
