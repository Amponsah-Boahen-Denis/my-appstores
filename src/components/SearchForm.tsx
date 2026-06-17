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
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] items-stretch"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const product = String(data.get("product") || "");
        onSubmit({ product, country, location, categories: selectedCategories });
      }}
      aria-label="Search stores"
    >
      <Card className="space-y-6 p-6 bg-[#f7fbff]">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Find stores</p>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Search verified businesses</h2>
            <p className="max-w-2xl text-sm text-slate-600">Use product, country, and location inputs to get stores from our verified listings only.</p>
          </div>
        </div>

        <div className="grid gap-4">
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

          <div className="grid gap-4 lg:grid-cols-[1fr_auto] items-end">
            <div className="space-y-3">
              <CountryInput id="country" value={country} onChange={setCountry} label="" />
              <HiddenInput id="country-hidden" name="country" value={country} />
            </div>
            <div className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <LocationAutocomplete id="location" value={location} onChange={setLocation} showLabel={false} />
                  <HiddenInput id="location-hidden" name="location" value={location} />
                </div>
                <Button type="button" onClick={detectUserLocation} disabled={isDetectingLocation} variant="secondary" size="lg" className="w-full sm:w-auto">
                  {isDetectingLocation ? "Detecting..." : "Use My Address"}
                </Button>
              </div>
            </div>
          </div>

          <Button type="submit" variant="secondary" size="lg" className="w-full">
            Search Stores
          </Button>
        </div>
      </Card>

      <Card className="sticky top-6 p-6 flex flex-col bg-[#f7fbff]">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Categories</p>
          <h3 className="text-xl font-semibold text-slate-900">Refine your search</h3>
          <p className="text-sm text-slate-600">Select categories to narrow results by business type.</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-2 overflow-y-auto pr-1 max-h-[370px]">
          {storeCategories.map((category) => (
            <label
              key={category.value}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white"
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
              <span className="ml-3">{category.label}</span>
            </label>
          ))}
        </div>
      </Card>

      {locationError && (
        <Card className="border border-rose-200 bg-rose-50 p-3 lg:col-span-2">
          <p className="text-sm text-rose-700">{locationError}</p>
        </Card>
      )}
    </form>
  );
}


