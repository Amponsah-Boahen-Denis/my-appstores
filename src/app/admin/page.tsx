import AdminFeature from "@/features/Admin/Admin";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14 lg:py-16">
      <Card className="border-[#0A66C2]/10 bg-white/90 p-4 shadow-sm md:p-6">
        <AdminFeature />
      </Card>
    </main>
  );
}


