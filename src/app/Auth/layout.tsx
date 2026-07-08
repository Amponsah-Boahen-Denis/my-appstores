import type { Metadata } from "next";
import { AuthProvider } from "@/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Authenticate • Ampden",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
