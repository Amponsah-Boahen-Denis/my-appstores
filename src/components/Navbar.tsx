"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavbarRoutes } from "@/routes/AppRoutes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";

export default function Navbar() {
  const pathname = usePathname();
  const routes = getNavbarRoutes();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => setMobileOpen(false);

  return (
    <nav className="w-full border-b border-[#d4e5f6] bg-white/95 backdrop-blur sticky top-0 z-50 shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-[#0a66c2]">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#0a66c2] text-sm font-semibold text-white">
            MB
          </span>
          my-best
        </Link>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#0a66c2] text-[#0a66c2] md:hidden"
          aria-label="Toggle menu"
        >
          <span className="text-xl">☰</span>
        </Button>

        <ul className="hidden items-center gap-2 text-sm font-medium md:flex">
          {routes.map((route) => {
            const isActive = pathname === route.path;
            return (
              <li key={route.path}>
                <ButtonLink
                  href={route.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={isActive ? "border border-[#0a66c2] shadow-sm" : "text-[#0a66c2] hover:bg-[#e7f3ff] hover:text-[#003c7b]"}
                >
                  {route.name}
                </ButtonLink>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink
            href="/auth/login"
            variant={pathname === "/auth/login" ? "secondary" : "ghost"}
            size="sm"
            className={pathname === "/auth/login" ? "border border-[#0a66c2] text-[#0a66c2]" : "border border-[#0a66c2] text-[#0a66c2] hover:bg-[#e7f3ff]"}
          >
            Login
          </ButtonLink>
          <ButtonLink
            href="/auth/signup"
            variant={pathname === "/auth/signup" ? "default" : "default"}
            size="sm"
            className={pathname === "/auth/signup" ? "bg-[#0a66c2] text-white hover:bg-[#004a86]" : "bg-[#0a66c2] text-white hover:bg-[#004a86]"}
          >
            Sign up
          </ButtonLink>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#d4e5f6] bg-white shadow-lg">
          <ul className="space-y-1 p-3">
            {routes.map((route) => {
              const isActive = pathname === route.path;
              return (
                <li key={route.path}>
                  <ButtonLink
                    href={route.path}
                    onClick={closeMenu}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={isActive ? "block rounded-lg border border-[#0a66c2] bg-[#e8f3ff] text-[#0a66c2] px-4 py-2 text-sm font-semibold" : "block rounded-lg px-4 py-2 text-sm font-semibold text-[#0a66c2] hover:bg-[#e7f3ff]"}
                  >
                    {route.name}
                  </ButtonLink>
                </li>
              );
            })}
            <li>
              <ButtonLink
                href="/auth/login"
                onClick={closeMenu}
                variant={pathname === "/auth/login" ? "secondary" : "ghost"}
                size="sm"
                className={pathname === "/auth/login" ? "block rounded-lg border border-[#0a66c2] bg-[#e8f3ff] text-[#0a66c2] px-4 py-2 text-sm font-semibold" : "block rounded-lg border border-[#0a66c2] px-4 py-2 text-sm font-semibold text-[#0a66c2] hover:bg-[#e7f3ff]"}
              >
                Login
              </ButtonLink>
            </li>
            <li>
              <ButtonLink
                href="/auth/signup"
                onClick={closeMenu}
                variant="default"
                size="sm"
                className="block rounded-lg bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004a86]"
              >
                Sign up
              </ButtonLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}


