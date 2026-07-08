"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SearchResult = {
  id: string;
  name: string;
  address?: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  workingHours?: string | null;
  lat: number;
  lon: number;
};

export default function StoreSearchWidget() {
  const [searchData, setSearchData] = useState({
    storeName: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults(null);

    if (!searchData.storeName.trim()) {
      setError("Please enter a store name");
      return;
    }

    setIsLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams({
        name: searchData.storeName.trim(),
        ...(searchData.address.trim() && { address: searchData.address.trim() }),
      });

      const response = await fetch(`/api/stores/search?${params}`);

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data.results || []);

      if (data.results.length === 0) {
        setError("No stores found matching your search");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search stores. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSearchData({ storeName: "", address: "" });
    setResults(null);
    setError(null);
    setSearched(false);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Verified Stores</h3>
          <p className="text-sm text-gray-600">
            Check if your store is already verified or find specific stores
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="storeName">Store Name *</Label>
            <Input
              id="storeName"
              name="storeName"
              type="text"
              value={searchData.storeName}
              onChange={handleInputChange}
              placeholder="store name"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              id="address"
              name="address"
              type="text"
              value={searchData.address}
              onChange={handleInputChange}
              placeholder="address"
            />
          </div>

          {error && <ErrorAlert message={error} />}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:flex-1"
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
            {searched && (
              <Button
                type="button"
                onClick={handleClear}
                variant="secondary"
                className="w-full sm:flex-1"
              >
                Clear
              </Button>
            )}
          </div>
        </form>

        {isLoading && <LoadingSpinner />}

        {results && results.length > 0 && (
          <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-900">Found {results.length} store(s):</p>
            <div className="space-y-2">
              {results.map((store) => (
                <Card
                  key={store.id}
                  className="rounded-md bg-[#E7F0F7] p-3 border border-[#0A66C2]/20"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium text-[#0A66C2]">
                      ✓ {store.name}
                    </h4>
                    {store.address && (
                      <p className="text-xs text-gray-700">
                        📍 {store.address}
                      </p>
                    )}
                  <div className="text-xs text-gray-600 space-y-0.5">
                      {store.phone && <p>📞 {store.phone}</p>}
                      {store.email && <p>✉️ {store.email}</p>}
                      {store.website && (
                        <p>
                          🌐{" "}
                          <a
                            href={store.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:no-underline text-[#0A66C2] hover:text-[#0A66C2]/80"
                          >
                            Visit website
                          </a>
                        </p>
                      )}
                      {store.workingHours && <p>🕐 {store.workingHours}</p>}
                    </div>
                    <p className="text-xs text-gray-500">
                      ID: {store.id}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {searched && results && results.length === 0 && !error && (
          <div className="rounded-md bg-[#E7F0F7] p-3 border border-[#0A66C2]/20">
            <p className="text-sm text-[#0A66C2]">
              Your store isn&apos;t verified yet. Consider{" "}
              <a href="#store-form" className="font-medium underline hover:no-underline">
                submitting it
              </a>
              !
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
