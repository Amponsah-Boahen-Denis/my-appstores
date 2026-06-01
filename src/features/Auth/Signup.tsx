"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type SignupFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignupFormErrors = Partial<Record<keyof SignupFormData | 'general', string>>;

export default function Signup() {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const passwordRules = (pwd: string) => {
    const reqs: string[] = [];
    if (pwd.length < 8) reqs.push("at least 8 characters");
    if (!/[a-zA-Z]/.test(pwd)) reqs.push("a letter");
    if (!/\d/.test(pwd)) reqs.push("a number");
    return reqs;
  };

  const validateField = (name: keyof SignupFormData, value: string): string | null => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return null;
      case "email":
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email";
        return null;
      case "password":
        if (!value) return "Password is required";
        const pwErrs = passwordRules(value);
        if (pwErrs.length > 0) return `Password must contain ${pwErrs.join(", ")}`;
        return null;
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return null;
      default:
        return null;
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {};
    const fields: (keyof SignupFormData)[] = ["name", "email", "password", "confirmPassword"];

    fields.forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // TODO: Implement actual signup logic
      console.log("Signup attempt:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, just show success (will be replaced with actual auth)
      alert("Account created successfully! (This is a placeholder)");
      
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ general: "Signup failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof SignupFormData;
    const { value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // validate field as user types
    const fieldError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError || "" }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 overflow-hidden rounded-[28px] border border-[#dce6f3] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.1)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-gradient-to-b from-[#eef5ff] to-white p-8 sm:p-12">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center rounded-full bg-[#dbe9ff] px-4 py-2 text-sm font-semibold text-[#0a66c2]">
              Join the local inventory network
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-[#0a66c2] sm:text-5xl">
              Create your account
            </h1>
            <p className="text-base leading-7 text-slate-600">
              Add your store, update working hours, and make your business discoverable to nearby shoppers.
            </p>
            <div className="space-y-4 text-sm text-slate-600">
              <p className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#0a66c2]" />
                Publish your store listing with contact and hours.
              </p>
              <p className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#0a66c2]" />
                Give shoppers accurate local information instantly.
              </p>
              <p className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#0a66c2]" />
                Built for small business owners and searchers alike.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-10 sm:py-12">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0a66c2]">Sign up</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Create your account</h2>
              <p className="text-sm text-slate-600">
                Start listing stores and reaching local customers quickly.
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="flex w-full items-center justify-center gap-3 rounded-full px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={() => alert("Google sign-up placeholder")}
            >
              Continue with Google
            </Button>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              <span>or use your email</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.general && (
                <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">
                  {errors.general}
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Jane Doe"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={errors.name ? "border-red-300" : "border-slate-200"}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={errors.email ? "border-red-300" : "border-slate-200"}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  aria-required="true"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={errors.password ? "border-red-300" : "border-slate-200"}
                />
                {errors.password && (
                  <p id="password-error" className="text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
                {formData.password && passwordRules(formData.password).length > 0 && (
                  <p className="text-xs text-slate-500">
                    Must include {passwordRules(formData.password).join(", ")}.
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  aria-required="true"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                  className={errors.confirmPassword ? "border-red-300" : "border-slate-200"}
                />
                {errors.confirmPassword && (
                  <p id="confirm-password-error" className="text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-3 text-sm text-slate-600">
                <label className="flex items-start gap-2">
                  <Checkbox
                    required
                  />
                  <span>
                    I agree to the{' '}
                    <Link href="/terms" className="font-semibold text-[#0a66c2] transition hover:text-[#004a86]">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="font-semibold text-[#0a66c2] transition hover:text-[#004a86]">
                      Privacy Policy
                    </Link>.
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-[#0a66c2] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0a66c210] transition hover:bg-[#004a86]"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-[#0a66c2] transition hover:text-[#004a86]">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


