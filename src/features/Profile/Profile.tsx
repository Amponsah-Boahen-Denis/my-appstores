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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Profile() {
  const { prefs, setPrefs } = usePreferences();
  const user = {
    name: prefs.name || "No name provided",
    email: prefs.email || "No email provided",
  };

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [stores, setStores] = useState<StoreSubmission[]>([]);
  const [editing, setEditing] = useState<StoreSubmission | null>(null);
  const [storeLimitError, setStoreLimitError] = useState<string | null>(null);

  useEffect(() => {
    listStores()
      .then(setStores)
      .catch(() => setStores([]));
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
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <section className="mx-auto max-w-6xl">
        <Card className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr] xl:gap-6">
            <div className="space-y-4 rounded-3xl bg-slate-50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Profile overview</h2>
                  <p className="mt-1 text-sm text-slate-500 max-w-2xl">
                    Your account details are summarized here. Keeping these up to date helps customers trust your storefront.
                  </p>
                </div>
                {!isEditingProfile && (
                  <Button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    variant="secondary"
                    className="mt-2 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 whitespace-nowrap"
                  >
                    Edit profile
                  </Button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white p-4 border border-slate-200 shadow-sm text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Name</p>
                  <p className="mt-3 text-base font-semibold text-slate-900">{user.name}</p>
                </div>
                <div className="rounded-3xl bg-white p-4 border border-slate-200 shadow-sm text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</p>
                  <p className="mt-3 text-base font-semibold text-slate-900">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Activity summary</p>
              <div className="mt-5 rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Published stores</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{stores.length}</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {isEditingProfile && (
        <section className="mx-auto max-w-3xl px-0 sm:px-2 lg:px-0">
          <Card className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 text-center">Edit Profile</h2>
              <ProfileForm
                initial={prefs}
                onSubmit={handleProfileSave}
                onCancel={() => setIsEditingProfile(false)}
                isLoading={isSavingProfile}
              />
            </div>
          </Card>
        </section>
      )}

      <section className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-3 text-center">
          <h2 className="text-xl font-semibold text-slate-900">Your stores</h2>
          {stores.length === 0 && (
            <p className="text-sm text-slate-500">
              Your store list is empty. Add a store below to get started.
            </p>
          )}
        </div>
        <StoreList items={stores} onEdit={handleEdit} onDelete={handleDelete} />
      </section>

      <section className="mx-auto max-w-6xl space-y-3">
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold text-slate-900">{editing ? "Edit store" : "Submit a new store"}</h2>
          <p className="text-sm text-slate-500">
            Add or update a store listing with a clear explanation so customers know what makes it unique.
          </p>
        </div>
        {storeLimitError && (
          <PlanLimitAlert
            type="store"
            message={storeLimitError}
            currentPlan="Starter"
            suggestedPlan="Pro"
            onDismiss={() => setStoreLimitError(null)}
          />
        )}
        <StoreForm id="store-form" initial={editing || undefined} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
      </section>

      <section className="mx-auto max-w-6xl">
        <BusinessAnalytics />
      </section>

      <section className="mx-auto max-w-6xl">
        <StoreSearchWidget />
      </section>
    </main>
  );
}



