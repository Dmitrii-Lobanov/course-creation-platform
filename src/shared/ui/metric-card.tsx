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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        {icon ? (
          <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
            {icon}
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
