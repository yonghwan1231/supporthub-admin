"use client";

import { cn } from "@/common/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const variantClassName: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-strong focus:ring-brand/25",
  secondary:
    "border border-line bg-white text-ink hover:bg-slate-50 focus:ring-brand/20",
  danger: "bg-danger text-white hover:bg-red-800 focus:ring-danger/20",
  ghost:
    "bg-transparent text-muted hover:bg-slate-100 hover:text-ink focus:ring-brand/20",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50",
        "focus:outline-none focus:ring-4",
        variantClassName[variant],
        className,
      )}
    />
  );
}
