/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { cn } from "@/lib/utils";

export type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = { sm: "h-8 w-8 text-sm", md: "h-10 w-10 text-base", lg: "h-14 w-14 text-lg" };

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({ src, alt = "avatar", size = "md", className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("inline-flex items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-700", sizes[size], className)}
    {...props}
  >
    {src ? <img src={src} alt={alt} className="h-full w-full object-cover" /> : <span>{(alt && alt[0]) || "U"}</span>}
  </div>
));
Avatar.displayName = "Avatar";

export { Avatar };
