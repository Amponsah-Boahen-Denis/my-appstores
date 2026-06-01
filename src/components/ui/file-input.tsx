import * as React from "react";
import { cn } from "@/lib/utils";

export type FileInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, type = "file", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-900 file:rounded-md file:hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200",
        className
      )}
      {...props}
    />
  )
);
FileInput.displayName = "FileInput";

export { FileInput };
