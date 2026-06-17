import { Card } from "@/components/ui/card";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-[#f7f9fc] py-6">
      <Card className="mx-auto max-w-5xl border-t border-slate-200 bg-[#f7f9fc] p-4">
        <div className="flex flex-col items-center justify-between gap-2 text-sm text-slate-600 md:flex-row">
          <p>© {year} Ampden</p>
          <p className="text-center md:text-right">Built with Next.js • Verified stores only • Modern search UX</p>
        </div>
      </Card>
    </footer>
  );
}


