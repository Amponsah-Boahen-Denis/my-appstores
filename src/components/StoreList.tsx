"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StoreSubmission } from "@/services/userStores";

type Props = {
  items: StoreSubmission[];
  onEdit: (item: StoreSubmission) => void;
  onDelete: (id: string) => void;
};

export default function StoreList({ items, onEdit, onDelete }: Props) {
  if (!items.length) {
    return <p className="text-sm text-black/60 dark:text-white/60">You have not added any stores yet.</p>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((s) => (
        <Card key={s.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4 flex-1">
              {s.logo && (
                <Image
                  src={s.logo}
                  alt={`${s.name} logo`}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-2xl object-contain flex-shrink-0"
                />
              )}
              <div className="space-y-2 flex-1">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-slate-900">{s.name}</h3>
                  <p className="text-sm text-slate-500">{s.address}</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <p className="text-sm text-slate-500">{s.country}</p>
                  {s.description && <p className="text-sm text-slate-600">{s.description}</p>}
                </div>
                <div className="grid gap-2 sm:grid-cols-2 text-sm text-slate-500">
                  {s.website && (
                    <a className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700" href={s.website} target="_blank" rel="noopener noreferrer">
                      🌐 Website
                    </a>
                  )}
                  {s.email && <span>✉️ {s.email}</span>}
                  {s.phone && <span>📞 {s.phone}</span>}
                  {s.lat && s.lon && <span>📍 {s.lat.toFixed(4)}, {s.lon.toFixed(4)}</span>}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-end">
              <Button variant="secondary" size="sm" onClick={() => onEdit(s)}>Edit</Button>
              <Button size="sm" onClick={() => onDelete(s.id)}>Delete</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}


