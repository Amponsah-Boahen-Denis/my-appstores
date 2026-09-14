import { Suspense } from "react";
import ResetPasswordFeature from "@/features/Auth/ResetPassword";

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14 lg:py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-[#dce6f3] bg-white/90 p-4 shadow-sm md:p-6">
        <Suspense fallback={<p className="py-8 text-center text-sm text-slate-600">Loading...</p>}>
          <ResetPasswordFeature />
        </Suspense>
      </div>
    </main>
  );
}
