import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl space-y-3">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            {eyebrow}
          </p>
        ) : null}

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            {title}
          </h1>

          {description ? (
            <p className="text-lg leading-8 text-slate-600">{description}</p>
          ) : null}
        </div>
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
