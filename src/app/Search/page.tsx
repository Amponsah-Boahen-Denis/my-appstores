import dynamic from "next/dynamic";

export const dynamic = "force-dynamic";

const SearchFeature = dynamic(() => import("@/features/Search/Search"), {
  ssr: false,
  loading: () => <div className="py-10 text-center text-slate-500">Loading search…</div>,
});

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14 lg:py-16">
      <div className="rounded-2xl border border-[#dce6f3] bg-white/90 p-4 shadow-sm md:p-6">
        <SearchFeature />
      </div>
    </main>
  );
}


