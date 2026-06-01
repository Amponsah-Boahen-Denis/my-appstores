"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";import { HiddenInput } from "@/components/ui/hidden-input";import CountryInput from "@/components/CountryInput";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useDetectLocation } from "@/hooks/useDetectLocation";
import { storeCategories } from "@/utils/storeCategories";

type Props = {
  defaultProduct?: string;
  defaultCountry?: string;
  defaultLocation?: string;
  onSubmit: (data: { product: string; country: string; location: string; categories: string[] }) => void;
};

export default function SearchForm({ defaultProduct = "", defaultCountry = "", defaultLocation = "", onSubmit }: Props) {
  const [product, setProduct] = useState(defaultProduct);
  const [country, setCountry] = useState(defaultCountry);
  const [location, setLocation] = useState(defaultLocation);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { detect } = useDetectLocation();

  const detectUserLocation = async () => {
    setLocationError("");
    setIsDetectingLocation(true);
    try {
      const res = await detect();
      if (res) {
        setCountry(res.country);
        setLocation(res.fullAddress);
        const countryHidden = document.getElementById("country-hidden") as HTMLInputElement | null;
        const locationHidden = document.getElementById("location-hidden") as HTMLInputElement | null;
        if (countryHidden) countryHidden.value = res.country;
        if (locationHidden) locationHidden.value = res.fullAddress;
      } else {
        setLocationError("Failed to detect location. Please enter manually.");
      }
    } catch {
      setLocationError("Failed to detect location. Please enter manually");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  useEffect(() => {
    setProduct(defaultProduct);
  }, [defaultProduct]);

  useEffect(() => {
    setCountry(defaultCountry);
  }, [defaultCountry]);

  useEffect(() => {
    setLocation(defaultLocation);
  }, [defaultLocation]);

  return (
    <form
      className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const product = String(data.get("product") || "");
        onSubmit({ product, country, location, categories: selectedCategories });
      }}
      aria-label="Search stores"
    >
      <Card className="space-y-4 p-4 lg:sticky lg:top-6">
        <div>
          <p className="text-sm font-semibold text-slate-900">Categories</p>
          <p className="mt-1 text-sm text-slate-600">Scroll and select categories to refine your search.</p>
        </div>
        <div className="mt-4 max-h-[62vh] overflow-y-auto pr-1 space-y-2">
          {storeCategories.map((category) => (
            <label
              key={category.value}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition hover:border-slate-400 hover:bg-slate-100"
            >
              <Checkbox
                value={category.value}
                checked={selectedCategories.includes(category.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedCategories((current) =>
                    current.includes(value)
                      ? current.filter((item) => item !== value)
                      : [...current, value]
                  );
                }}
              />
              {category.label}
            </label>
          ))}
        </div>
      </Card>

      <Card className="space-y-6 p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Find Stores</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <Label htmlFor="product">
                What are you looking for?
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="product"
                name="product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g., store name, product, or service"
                aria-required="true"
                required
              />
            </div>
            <div className="space-y-3">
              <CountryInput id="country" value={country} onChange={setCountry} />
              <HiddenInput id="country-hidden" name="country" value={country} />
            </div>
            <div className="space-y-3">
              <LocationAutocomplete id="location" value={location} onChange={setLocation} />
              <HiddenInput id="location-hidden" name="location" value={location} />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" onClick={detectUserLocation} disabled={isDetectingLocation} variant="secondary" size="lg" className="min-w-[180px]">
              {isDetectingLocation ? "Detecting..." : "📍 Use My Address"}
            </Button>
            <Button type="submit" variant="default" size="lg" className="min-w-[160px]">
              🔍 Search Stores
            </Button>
          </div>
        </div>
      </Card>

      {locationError && (
        <Card className="border border-rose-200 bg-rose-50 p-3">
          <p className="text-sm text-rose-700">{locationError}</p>
        </Card>
      )}
    </form>
  );
}


