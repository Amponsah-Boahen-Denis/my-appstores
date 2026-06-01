"use client";

import { Button } from "@/components/ui/button";

type Props = {
  value: "grid" | "list";
  onChange: (value: "grid" | "list") => void;
};

export default function LayoutToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-full border border-slate-200 overflow-hidden" role="group" aria-label="Toggle layout">
      <Button
        type="button"
        variant={value === "grid" ? "default" : "ghost"}
        size="sm"
        className="rounded-none"
        onClick={() => onChange("grid")}
      >
        Grid
      </Button>
      <Button
        type="button"
        variant={value === "list" ? "default" : "ghost"}
        size="sm"
        className="rounded-none border-l border-slate-200"
        onClick={() => onChange("list")}
      >
        List
      </Button>
    </div>
  );
}


