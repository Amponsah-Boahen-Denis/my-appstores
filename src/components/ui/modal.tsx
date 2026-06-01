import * as React from "react";
import { cn } from "@/lib/utils";

type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
  open?: boolean;
  onClose?: () => void;
};

export function Modal({ open = false, onClose, className, children, ...props }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={cn("relative z-10 max-w-3xl rounded-2xl bg-white p-6 shadow-lg", className)} {...props}>
        {children}
      </div>
    </div>
  );
}
