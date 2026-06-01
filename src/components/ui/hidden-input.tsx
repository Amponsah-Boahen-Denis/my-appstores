import * as React from "react";
import { cn } from "@/lib/utils";

export type HiddenInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const HiddenInput = React.forwardRef<HTMLInputElement, HiddenInputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="hidden"
      className={cn(className)}
      {...props}
    />
  )
);

HiddenInput.displayName = "HiddenInput";

export { HiddenInput };
