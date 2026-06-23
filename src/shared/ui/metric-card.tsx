import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string;
  description: string;
  icon?: ReactNode;
};

export function MetricCard({
  label,
  value,
  description,
  icon,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/85 p-5 text-card-foreground shadow-sm backdrop-blur dark:bg-card/70 dark:shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>

        {icon ? (
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            {icon}
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
