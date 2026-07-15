import AdminFeature from "@/features/Admin/Admin";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  // Admin page is currently open to all visitors.
  // The page will still render and may display admin data if available.
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14 lg:py-16">
      <Card className="border-[#0A66C2]/10 bg-white/90 p-4 shadow-sm md:p-6">
        <AdminFeature />
      </Card>
    </main>
  );
}


