"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getBusinessAnalytics } from "@/services/businessAnalytics";
import type { BusinessAnalytics } from "@/services/businessAnalytics";

export default function BusinessAnalytics() {
  const [analytics, setAnalytics] = useState<BusinessAnalytics | null>(null);

  useEffect(() => {
    const data = getBusinessAnalytics();
    setAnalytics(data);
  }, []);

  if (!analytics) return null;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Business Analytics</h2>
        <p className="text-sm text-gray-600 mt-1 max-w-2xl">Track how your submitted stores perform in searches</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-[#E7F0F7] border-[#0A66C2]/20 p-5 md:p-6 rounded-3xl text-center min-h-[170px]">
          <p className="text-xs uppercase tracking-[0.28em] text-[#0A66C2] font-medium">Total Stores</p>
          <p className="text-3xl font-bold text-[#0A66C2] mt-3">{analytics.totalStores}</p>
        </Card>

        <Card className="bg-[#E7F0F7] border-[#0A66C2]/20 p-5 rounded-3xl text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-[#0A66C2] font-medium">Search Appearances</p>
          <p className="text-3xl font-bold text-[#0A66C2] mt-3">{analytics.totalAppearances}</p>
        </Card>

        <Card className="bg-[#E7F0F7] border-[#0A66C2]/20 p-5 rounded-3xl text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-[#0A66C2] font-medium">Avg per Store</p>
          <p className="text-3xl font-bold text-[#0A66C2] mt-3">{analytics.averageAppearancesPerStore}</p>
        </Card>

        <Card className="bg-[#E7F0F7] border-[#0A66C2]/20 p-5 rounded-3xl text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-[#0A66C2] font-medium">Total Clicks</p>
          <p className="text-3xl font-bold text-[#0A66C2] mt-3">{analytics.totalClicks}</p>
        </Card>
      </div>

      {/* Store Details */}
      {analytics.stores.length > 0 ? (
        <Card className="bg-white rounded-3xl p-4 border border-gray-200">
          <h3 className="text-base font-semibold mb-3 text-gray-900">Store Performance</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {analytics.stores.map((store) => (
              <div
                key={store.storeId}
                className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-gray-50 p-4 md:p-5"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-gray-900 truncate">{store.storeName}</p>
                  <p className="text-xs text-gray-600">
                    {store.lastAppeared ? (
                      <>Last appeared {new Date(store.lastAppeared).toLocaleDateString()}</>
                    ) : (
                      <>Never appeared in results</>
                    )}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-xs text-gray-600">Appearances</p>
                    <p className="font-semibold text-base text-[#0A66C2]">{store.appearances}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Clicks</p>
                    <p className="font-semibold text-base text-[#0A66C2]">{store.clicks}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="bg-[#E7F0F7] border-[#0A66C2]/20 p-6 rounded-3xl text-center">
          <p className="text-sm text-[#0A66C2]">
            No analytics yet. Submit a store and search for products to see analytics here.
          </p>
        </Card>
      )}
    </section>
  );
}
