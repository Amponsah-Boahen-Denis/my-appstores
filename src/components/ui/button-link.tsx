import * as React from "react";
import Link, { type LinkProps } from "next/link";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";

export interface ButtonLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">,
    Omit<LinkProps, "className">,
    VariantProps<typeof buttonVariants> {
  href: LinkProps["href"];
  className?: string;
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, href, ...props }, ref) => (
    <Link
      href={href}
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
ButtonLink.displayName = "ButtonLink";

export { ButtonLink };
