import { cn } from "@/common/lib/cn";
import type { ReactNode } from "react";

type BadgeTone = "slate" | "cyan" | "amber" | "emerald" | "rose" | "violet";

const toneClassName: Record<BadgeTone, string> = {
  slate: "bg-slate-100 text-muted ring-line",
  cyan: "bg-blue-50 text-brand ring-blue-200",
  amber: "bg-amber-50 text-warning ring-amber-200",
  emerald: "bg-emerald-50 text-success ring-emerald-200",
  rose: "bg-red-50 text-danger ring-red-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
};

export function Badge({
  children,
  className,
  tone = "slate",
}: {
  children: ReactNode;
  className?: string;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset",
        toneClassName[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
