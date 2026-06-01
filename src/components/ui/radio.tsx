import * as React from "react";
import { cn } from "@/lib/utils";

export type RadioProps = React.InputHTMLAttributes<HTMLInputElement>;

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="radio"
      className={cn(
        "h-4 w-4 rounded-full border-slate-300 text-slate-900 focus:ring-slate-400",
        className
      )}
      {...props}
    />
  )
);
Radio.displayName = "Radio";

export { Radio };
