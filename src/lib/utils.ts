import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<string | boolean | null | undefined>) {
  return twMerge(inputs.filter(Boolean).join(" "));
}
