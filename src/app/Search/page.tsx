import { Suspense } from "react";
import SearchFeature from "@/features/Search/Search";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14 lg:py-16">
      <Card className="p-4 md:p-6">
        <Suspense fallback={<div className="py-10 text-center text-slate-500">Loading search…</div>}>
          <SearchFeature />
        </Suspense>
      </Card>
    </main>
  );
}


