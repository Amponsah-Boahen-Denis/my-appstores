"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useLogoUpload } from "@/hooks/useLogoUpload";
import { Button } from "@/components/ui/button";
import { HiddenInput } from "@/components/ui/hidden-input";
import { Label } from "@/components/ui/label";

type Props = {
  onUpload: (url: string) => void;
  currentLogo?: string | null;
  label?: string;
  userId?: string;
};

export default function LogoUpload({ onUpload, currentLogo, label = "Upload Logo", userId = "default-user" }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, error, setError } = useLogoUpload();
  const [preview, setPreview] = useState<string | null>(currentLogo || null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    const result = await upload(file, userId);
    if (result.success && result.url) {
      onUpload(result.url);
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="logo-upload-button">{label}</Label>
        <Button
          type="button"
          id="logo-upload-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-4 py-2 rounded-md text-sm"
        >
          {isUploading ? "Uploading..." : "Choose Image"}
        </Button>
        <HiddenInput
          ref={fileInputRef}
          id="logo-upload-input"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        <p className="text-xs text-gray-500 mt-1">JPG, PNG, or WebP. Max 5MB</p>
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          ❌ {error}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setError(null)}
            className="underline text-xs p-0 h-auto"
          >
            Dismiss
          </Button>
        </div>
      )}

      {preview && (
        <div className="flex gap-3 items-start">
          <Image
            src={preview}
            alt="Logo preview"
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded-md border border-black/10 dark:border-white/15"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setPreview(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="text-xs text-red-600 dark:text-red-400 underline mt-2 p-0 h-auto"
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
