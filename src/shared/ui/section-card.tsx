import type { ReactNode } from "react";

type SectionCardProps = {
  children: ReactNode;
  className?: string;
};

export function SectionCard({ children, className = "" }: SectionCardProps) {
  return (
    <section
      className={`rounded-3xl border border-border bg-card/80 p-6 text-card-foreground shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:bg-card/70 dark:shadow-none ${className}`}
    >
      {children}
    </section>
  );
}
