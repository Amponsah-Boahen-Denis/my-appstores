"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const passwordRules = (pwd: string) => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push("at least 8 characters");
    if (!/[a-zA-Z]/.test(pwd)) errors.push("a letter");
    if (!/\d/.test(pwd)) errors.push("a number");
    return errors;
  };

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email";
        return null;
      case "password":
        if (!value) return "Password is required";
        const pwErrors = passwordRules(value);
        if (pwErrors.length > 0) {
          return `Password must contain ${pwErrors.join(", ")}`;
        }
        return null;
      default:
        return null;
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validateField("password", formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const rememberedEmail = window.localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // TODO: Implement actual login logic
      console.log("Login attempt:", formData);
      
      if (rememberMe) {
        window.localStorage.setItem("rememberedEmail", formData.email);
      } else {
        window.localStorage.removeItem("rememberedEmail");
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just show success (will be replaced with actual auth)
      alert("Login successful! (This is a placeholder)");
      
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // validate field as user types
    const fieldError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError || "" }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 overflow-hidden rounded-[28px] border border-[#dce6f3] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.1)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-gradient-to-b from-[#eaf4ff] to-white p-8 sm:p-12">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center rounded-full bg-[#dbe9ff] px-4 py-2 text-sm font-semibold text-[#0a66c2]">
              Secure access • Fast login
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-[#0a66c2] sm:text-5xl">
              Welcome back to My-Best
            </h1>
            <p className="text-base leading-7 text-slate-600">
              Sign in to access your search history, manage store listings, and discover the best local products faster with smart relevancy.
            </p>
            <div className="space-y-4 text-sm text-slate-600">
              <p className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#0a66c2]" />
                Intelligent search ranking and product matching.
              </p>
              <p className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#0a66c2]" />
                Secure sign-in experience with future auth support.
              </p>
              <p className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#0a66c2]" />
                Keep your local business details and working hours available to customers.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-10 sm:py-12">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0a66c2]">Sign in</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Enter your account</h2>
              <p className="text-sm text-slate-600">
                Use your email and password to continue.
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="flex w-full items-center justify-center gap-3 rounded-full px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={() => alert("Google sign-in placeholder")}
            >
              Continue with Google
            </Button>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              <span>or continue with email</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.general && (
                <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">
                  {errors.general}
                </div>
              )}

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
                  placeholder="Enter your password"
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <Checkbox
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  Remember me
                </label>
                <Link
                  href="/forgot-password"
                  className="font-medium text-slate-700 transition hover:text-[#0a66c2]"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-[#0a66c2] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0a66c210] transition hover:bg-[#004a86]"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/signup"
                className="font-semibold text-[#0a66c2] transition hover:text-[#004a86]"
              >
                Create one
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


