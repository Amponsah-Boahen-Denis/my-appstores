"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import CountryInput from "@/components/CountryInput";
import LogoUpload from "@/components/LogoUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import sanitizeInput from "@/utils/sanitizeInput";
import { storeCategories } from "@/utils/storeCategories";
import { StoreSubmission } from "@/services/userStores";

type Props = {
  initial?: Partial<StoreSubmission>;
  onSubmit: (data: Omit<StoreSubmission, "id" | "createdAt" | "updatedAt">) => void;
  onCancel?: () => void;
};

export default function StoreForm({ initial, onSubmit, onCancel }: Props) {
  const idBase = useId();
  const [name, setName] = useState(initial?.name || "");
  const [country, setCountry] = useState(initial?.country || "");
  const [address, setAddress] = useState(initial?.address || "");
  const [logo, setLogo] = useState(initial?.logo || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(Array.isArray(initial?.category) ? initial.category : initial?.category ? [initial.category] : []);
  const [phone, setPhone] = useState(initial?.phone || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [website, setWebsite] = useState(initial?.website || "");
  const [lat, setLat] = useState(initial?.lat?.toString() || "");
  const [lon, setLon] = useState(initial?.lon?.toString() || "");
  const [workingHours, setWorkingHours] = useState(initial?.workingHours || "");
  const [error, setError] = useState<string | null>(null);

  const categoryOptions = storeCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = {
      name: sanitizeInput(name),
      category: selectedCategories.length ? selectedCategories.map((item) => sanitizeInput(item)) : null,
      country: sanitizeInput(country),
      address: sanitizeInput(address),
      logo: logo || null,
      website: website ? sanitizeInput(String(website)) : null,
      email: email ? sanitizeInput(String(email)) : null,
      phone: phone ? sanitizeInput(String(phone)) : null,
      workingHours: workingHours ? sanitizeInput(String(workingHours)) : null,
      lat: lat ? parseFloat(lat) : null,
      lon: lon ? parseFloat(lon) : null,
    } as Omit<StoreSubmission, "id" | "createdAt" | "updatedAt">;
    if (!cleaned.name) return setError("Store name is required.");
    if (!cleaned.category || cleaned.category.length === 0) return setError("At least one category is required.");
    if (!cleaned.country) return setError("Country is required.");
    if (!cleaned.address) return setError("Address is required.");
    if (!cleaned.logo) return setError("Store logo is required.");
    if (lat && isNaN(parseFloat(lat))) return setError("Latitude must be a valid number.");
    if (lon && isNaN(parseFloat(lon))) return setError("Longitude must be a valid number.");
    onSubmit(cleaned);
  };

  return (
    <form className="space-y-6 bg-white rounded-lg border border-gray-200 p-6" onSubmit={handleSubmit} aria-label="Store submission form">
      {error && <div role="alert" className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">{error}</div>}
      
      {/* Logo Upload */}
      <div>
        <LogoUpload 
          onUpload={setLogo} 
          currentLogo={logo} 
          label="Store Logo (required)" 
          userId={`store_${initial?.id || 'new'}`}
        />
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idBase}-name`}>Store name *</Label>
          <Input
            id={`${idBase}-name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Starbucks, Apple Store, Walmart"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <CountryInput id={`${idBase}-country`} value={country} onChange={setCountry} label="Country *" />
        </div>
        <div className="md:col-span-2 flex flex-col gap-2">
          <Label>Categories *</Label>
          <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="space-y-2">
              {categoryOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition hover:border-[#0A66C2] hover:bg-[#E7F0F7]">
                  <Checkbox
                    value={option.value}
                    checked={selectedCategories.includes(option.value)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedCategories((current) =>
                        current.includes(value)
                          ? current.filter((item) => item !== value)
                          : [...current, value]
                      );
                    }}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-col gap-2">
          <Label htmlFor={`${idBase}-address`}>Address *</Label>
          <Input
            id={`${idBase}-address`}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g., 123 Main St, New York, NY 10001"
            required
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900">Contact Information (optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${idBase}-phone`}>Phone</Label>
            <Input
              id={`${idBase}-phone`}
              value={phone || ""}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., +1 (555) 123-4567"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${idBase}-email`}>Email</Label>
            <Input
              id={`${idBase}-email`}
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="e.g., contact@store.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${idBase}-website`}>Website</Label>
            <Input
              id={`${idBase}-website`}
              value={website || ""}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900">Working Hours (optional)</h3>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${idBase}-workingHours`}>Hours</Label>
          <Input
            id={`${idBase}-workingHours`}
            value={workingHours || ""}
            onChange={(e) => setWorkingHours(e.target.value)}
            placeholder="e.g., 09:00-17:00 or Mo-Fr 09:00-17:00, Sa 10:00-16:00"
          />
          <p className="text-xs text-gray-600 mt-1">
            Format: HH:MM-HH:MM or add days (e.g., Mo-Fr 09:00-17:00)
          </p>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900">Location (optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${idBase}-lat`}>Latitude</Label>
            <Input
              id={`${idBase}-lat`}
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="e.g., 40.7128"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${idBase}-lon`}>Longitude</Label>
            <Input
              id={`${idBase}-lon`}
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="e.g., -74.0060"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 border-t border-gray-200 pt-6 mt-2">
        {onCancel && (
          <Button type="button" variant="secondary" className="h-11 px-8 rounded-lg font-semibold" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="h-11 px-8 rounded-lg bg-[#0A66C2] text-white font-semibold hover:bg-[#0052A3] transition-all duration-200"
        >
          📝 Save store
        </Button>
      </div>
    </form>
  );
}


