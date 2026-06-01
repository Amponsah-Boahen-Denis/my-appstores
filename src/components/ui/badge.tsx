import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "danger";
}

const badgeVariants = {
  default: "bg-slate-100 text-slate-800",
  secondary: "bg-slate-200 text-slate-900",
  success: "bg-emerald-100 text-emerald-800",
  danger: "bg-rose-100 text-rose-800",
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge };
