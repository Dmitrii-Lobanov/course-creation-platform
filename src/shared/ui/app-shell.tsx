import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/shared/theme/theme-toggle";

type AppShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/courses", label: "My courses" },
  { href: "/dashboard/courses/new", label: "Create" },
  { href: "/courses", label: "Catalog" },
];

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.10),transparent_34rem),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.12),transparent_30rem)] bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
              CF
            </div>

            <div className="leading-tight">
              <p className="font-semibold tracking-tight text-foreground">
                CourseForge
              </p>
              <p className="text-xs text-muted-foreground">Creator workspace</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-border bg-card/80 p-1 shadow-sm md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/dashboard/courses/new"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              New course
            </Link>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
