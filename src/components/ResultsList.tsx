import { SearchResult } from "@/services/openstreet";
import Image from "next/image";
import { trackStoreClick } from "@/services/businessAnalytics";
import { Card } from "@/components/ui/card";

type Props = {
  items: SearchResult[];
  layout: "grid" | "list";
};

function formatStreet(address?: string) {
  if (!address) return "";
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts[0] : address;
}

export default function ResultsList({ items, layout }: Props) {
  const handleStoreInteraction = (storeId: string) => {
    trackStoreClick(storeId);
  };

  if (!items || items.length === 0) {
    return <p className="text-sm text-slate-600">No stores found.</p>;
  }

  const renderCard = (p: SearchResult) => {
    const street = formatStreet(p.address);

    return (
      <Card key={p.id} className="p-5 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10">
        <div className="flex items-start gap-4">
          {p.logo ? (
            <Image
              src={p.logo}
              alt={`${p.name} logo`}
              width={56}
              height={56}
              className="w-14 h-14 rounded-2xl object-contain border border-slate-200 bg-slate-50"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl border border-slate-200 bg-slate-100 flex items-center justify-center text-sm text-slate-500">
              No logo
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900">{p.name}</h3>
            {street ? (
              <p className="mt-1 text-sm text-slate-600">{street}</p>
            ) : null}
            <p className="mt-2 text-sm text-slate-700">{p.address || "Address not available"}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-slate-700">
          {p.phone && (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-sky-100 text-sky-700 px-2 py-1 text-xs">📞</span>
              <span>{p.phone}</span>
            </div>
          )}
          {p.email && (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-1 text-xs">✉️</span>
              <span>{p.email}</span>
            </div>
          )}
          {p.website && (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-violet-100 text-violet-700 px-2 py-1 text-xs">🌐</span>
              <a
                className="underline text-blue-600 hover:text-blue-800"
                href={p.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleStoreInteraction(p.id)}
              >
                Visit website
              </a>
            </div>
          )}
        </div>
      </Card>
    );
  };

  if (layout === "grid") {
    return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(renderCard)}</div>;
  }

  return <div className="space-y-4">{items.map(renderCard)}</div>;
}


