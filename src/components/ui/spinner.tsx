import * as React from "react";
import { cn } from "@/lib/utils";

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement>;

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("inline-flex items-center gap-2 text-sm", className)} {...props}>
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <span>Loading…</span>
    </div>
  )
);
Spinner.displayName = "Spinner";

export { Spinner };
