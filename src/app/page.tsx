import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#e8f3ff] text-slate-900">
      <section className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
        <Card className="p-8 lg:p-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <Badge className="bg-[#e8f3ff] text-[#0a66c2] border-none shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-[#0a66c2] mr-2" />
                Ampden • Verified stores only
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-[#0a66c2] sm:text-5xl">
                Find verified local stores and real stock availability
              </h1>
              <p className="text-lg text-slate-700 max-w-xl">
                Ampden gives you instant access to verified local store listings. Search by product and location, compare results, and connect with trusted businesses.
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/search" variant="secondary" className="px-6 py-3 text-sm font-semibold text-[#0a66c2] hover:text-[#004a86]">
                  Search Verified Stores
                </ButtonLink>
                <ButtonLink href="/profile" variant="secondary" className="px-6 py-3 text-sm font-semibold text-[#0a66c2] hover:text-[#004a86]">
                  Add Your Store
                </ButtonLink>
              </div>
            </div>

            <Card className="space-y-4 rounded-xl border border-[#dce6f3] bg-[#f7fbff] p-6">
              <h3 className="text-xl font-semibold text-[#0a66c2]">Key features</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li>
                  <Card className="rounded-lg p-3 shadow-sm">
                    <strong className="text-[#0a66c2]">Smart query interpretation:</strong> classifies store/product/location intent for faster results.
                  </Card>
                </li>
                <li>
                  <Card className="rounded-lg p-3 shadow-sm">
                    <strong className="text-[#0a66c2]">Fast relevance scoring:</strong> name/category/tag/distance combined for top matches.
                  </Card>
                </li>
                <li>
                  <Card className="rounded-lg p-3 shadow-sm">
                    <strong className="text-[#0a66c2]">Working hours support:</strong> show business hours to customers directly from your listing.
                  </Card>
                </li>
                <li>
                  <Card className="rounded-lg p-3 shadow-sm">
                    <strong className="text-[#0a66c2]">History & analytics:</strong> recent searches and key trends saved locally.
                  </Card>
                </li>
              </ul>
            </Card>
          </div>
        </Card>
      </section>
    </main>
  );
}
