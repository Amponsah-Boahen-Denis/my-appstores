"use client";

import { useEffect, useState } from "react";
import StoreForm from "@/components/StoreForm";
import StoreList from "@/components/StoreList";
import ProfileForm from "@/components/ProfileForm";
import BusinessAnalytics from "@/components/BusinessAnalytics";
import StoreSearchWidget from "@/components/StoreSearchWidget";
import { deleteStore, listStores, saveStore, StoreSubmission } from "@/services/userStores";
import { canAddStore, recordStoreAdded } from "@/services/userPlans";
import PlanLimitAlert from "@/components/PlanLimitAlert";
import { usePreferences } from "@/hooks/usePreferences";
import { updateUserPreferences } from "@/services/preferences";
import Button from "@/components/Button";

export default function Profile() {
  const { prefs, setPrefs } = usePreferences();
  const user = {
    name: prefs.name || "User",
    email: prefs.email || "user@example.com",
    phone: prefs.phone || "Not added",
    bio: prefs.bio || "No business info yet.",
    website: prefs.website || "No website added",
  };

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [stores, setStores] = useState<StoreSubmission[]>([]);
  const [editing, setEditing] = useState<StoreSubmission | null>(null);
  const [storeLimitError, setStoreLimitError] = useState<string | null>(null);

  useEffect(() => {
    listStores().then(setStores);
  }, []);

  const handleSubmit = async (data: Omit<StoreSubmission, "id" | "createdAt" | "updatedAt">) => {
    setStoreLimitError(null);
    
    // If adding a new store (not editing), check limits
    if (!editing) {
      const storeCheck = canAddStore();
      if (!storeCheck.allowed) {
        setStoreLimitError(storeCheck.reason || "Store limit reached");
        return;
      }
    }
    
    await saveStore({ ...data, id: editing?.id });
    const next = await listStores();
    setStores(next);
    setEditing(null);
    
    // Record store addition if it's a new store
    if (!editing) {
      recordStoreAdded();
    }
  };

  const handleProfileSave = async (data: Record<string, string>) => {
    setIsSavingProfile(true);
    try {
      const updated = await updateUserPreferences(data);
      setPrefs(updated);
      setIsEditingProfile(false);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleEdit = (item: StoreSubmission) => {
    setEditing(item);
  };

  const handleDelete = async (id: string) => {
    await deleteStore(id);
    const updated = await listStores();
    setStores(updated);
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
            <p className="text-sm text-black/70 dark:text-white/70">{user.name} · {user.email}</p>
          </div>
          {!isEditingProfile && (
            <Button onClick={() => setIsEditingProfile(true)} variant="secondary">
              Edit Profile
            </Button>
          )}
        </div>
      </header>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Profile overview</h2>
          <p className="text-sm text-slate-600">
            Your personal and business details are shown here. Update them anytime and they will refresh on this page.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Name</p>
              <p className="mt-2 text-base font-medium text-slate-900">{user.name}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Email</p>
              <p className="mt-2 text-base font-medium text-slate-900">{user.email}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Phone</p>
              <p className="mt-2 text-base font-medium text-slate-900">{user.phone}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Website</p>
              <p className="mt-2 text-base font-medium text-slate-900">{user.website}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-[#E7F0F7] p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[#0A66C2]">Business info</p>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">About your business</h3>
          <p className="mt-4 text-sm leading-7 text-slate-700">{user.bio}</p>
        </div>
      </section>

      {/* Profile Edit Form */}
      {isEditingProfile && (
        <section className="space-y-4">
          <h2 className="text-lg font-medium">Edit Profile</h2>
          <ProfileForm
            initial={prefs}
            onSubmit={handleProfileSave}
            onCancel={() => setIsEditingProfile(false)}
            isLoading={isSavingProfile}
          />
        </section>
      )}

      {/* Business Analytics */}
      <section>
        <BusinessAnalytics />
      </section>

      {/* Store Search Widget */}
      <section>
        <StoreSearchWidget />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Your stores</h2>
        <StoreList items={stores} onEdit={handleEdit} onDelete={handleDelete} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">{editing ? "Edit store" : "Submit a new store"}</h2>
        {storeLimitError && (
          <PlanLimitAlert
            type="store"
            message={storeLimitError}
            currentPlan="Starter"
            suggestedPlan="Pro"
            onDismiss={() => setStoreLimitError(null)}
          />
        )}
        <StoreForm initial={editing || undefined} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
      </section>
    </main>
  );
}



