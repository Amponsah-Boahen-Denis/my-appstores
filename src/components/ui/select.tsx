import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options?: { label: string; value: string }[];
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, options = [], children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200",
        className
      )}
      {...props}
    >
      {options.length > 0 ? options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      )) : children}
    </select>
  );
});
Select.displayName = "Select";

export { Select };
