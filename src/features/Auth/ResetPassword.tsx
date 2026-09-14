"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(token ? "" : "This reset link is missing its token.");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to reset password");
      setMessage("Your password has been reset. You can now sign in.");
      setPassword("");
      setConfirmPassword("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to reset password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0a66c2]">Account recovery</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Set a new password</h1>
        <p className="text-sm text-slate-600">Choose a password with at least 8 characters, including a letter and a number.</p>
      </div>

      {message && <div className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {!message && token && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
          </div>
          <div className="space-y-3">
            <Label htmlFor="confirm-new-password">Confirm New Password</Label>
            <Input id="confirm-new-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full rounded-full bg-[#0a66c2] text-white hover:bg-[#004a86]">
            {isLoading ? "Updating..." : "Reset password"}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-slate-600">
        <Link href="/auth/login" className="font-semibold text-[#0a66c2]">Return to sign in</Link>
      </p>
    </div>
  );
}
