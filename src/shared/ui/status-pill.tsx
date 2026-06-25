type StatusPillProps = {
  children: string;
  tone?: "neutral" | "success" | "warning" | "info";
};

const toneClasses = {
  neutral: "border-border bg-muted/60 text-muted-foreground",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  info: "border-indigo-200 bg-primary/10 text-indigo-700",
};

export function StatusPill({ children, tone = "neutral" }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses[tone]} text-primary`}
    >
      {children}
    </span>
  );
}
