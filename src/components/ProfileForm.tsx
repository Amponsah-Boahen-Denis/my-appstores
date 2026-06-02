"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserPreferences } from "@/services/preferences";

type Props = {
  initial: Partial<UserPreferences>;
  onSubmit: (data: Partial<UserPreferences>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export default function ProfileForm({ initial, onSubmit, onCancel, isLoading = false }: Props) {
  const [data, setData] = useState({
    name: initial.name || "",
    email: initial.email || "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!data.email.trim()) {
      setError("Email is required");
      return;
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError("Invalid email format");
      return;
    }

    try {
      await onSubmit(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="profile-name">Name *</Label>
        <Input
          id="profile-name"
          type="text"
          value={data.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Your name"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="profile-email">Email *</Label>
        <Input
          id="profile-email"
          type="email"
          value={data.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="your@email.com"
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button
          type="button"
          variant="secondary"
          disabled={isLoading}
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-md"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
