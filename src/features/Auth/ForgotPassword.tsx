"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to request a reset link");
      setMessage(payload.message);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to request a reset link");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0a66c2]">Account recovery</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Forgot your password?</h1>
        <p className="text-sm text-slate-600">Enter your email and we will send you a password reset link.</p>
      </div>

      {message && <div className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-3">
          <Label htmlFor="forgot-email">Email Address</Label>
          <Input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full rounded-full bg-[#0a66c2] text-white hover:bg-[#004a86]">
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Remembered your password? <Link href="/auth/login" className="font-semibold text-[#0a66c2]">Sign in</Link>
      </p>
    </div>
  );
}
