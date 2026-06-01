import HistoryFeature from "@/features/History/History";
import { Card } from "@/components/ui/card";

export default function HistoryPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14 lg:py-16">
      <Card className="p-4 md:p-6">
        <HistoryFeature />
      </Card>
    </main>
  );
}


