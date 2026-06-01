import * as React from "react";
import * as Lucide from "lucide-react";

type IconName = keyof typeof Lucide;

export function Icon({ name, className, ...props }: { name: IconName; className?: string } & React.HTMLAttributes<SVGElement>) {
  const Comp = (Lucide as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!Comp) return null;
  return <Comp className={className} />;
}
