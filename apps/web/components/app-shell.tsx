"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { BrandIcon, BrandLockup } from "@/components/brand-lockup";
import { buttonVariants } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/now", label: "Now" },
  { href: "/trust", label: "Trust" },
  { href: "/residuals", label: "Residuals" },
  { href: "/replay", label: "Replay" },
  { href: "/station/61", label: "Station 61" },
];

const ROLES: Role[] = ["campus", "farm", "science"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  const role = (search.get("role") as Role) || "campus";
  const isHome = pathname === "/";

  function setRole(next: string) {
    const params = new URLSearchParams(search.toString());
    params.set("role", next);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function hrefWithRole(href: string) {
    const params = new URLSearchParams(search.toString());
    if (!params.get("role")) params.set("role", role);
    const q = params.toString();
    return q ? `${href}?${q}` : href;
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b">
        <div className="container grid grid-cols-1 items-center gap-3 py-3 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <Link href="/" className="flex items-center">
              <BrandLockup priority />
            </Link>
            <span className="text-muted-foreground hidden font-mono text-xs sm:inline">
              Conduit 61 · Juja
            </span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href === "/" ? "/" : hrefWithRole(item.href)}
                  className={`rounded-md px-2.5 py-1 text-sm ${
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex justify-center md:justify-end">
            {isHome ? (
              <Link href="/now" className={cn(buttonVariants({ size: "sm" }))}>
                Open Now
              </Link>
            ) : (
              <ToggleGroup
                variant="outline"
                size="sm"
                spacing={0}
                value={[role]}
                onValueChange={(next) => {
                  const v = Array.isArray(next) ? next[0] : next;
                  if (v) setRole(String(v));
                }}
                aria-label="Role"
              >
                {ROLES.map((r) => (
                  <ToggleGroupItem key={r} value={r} className="capitalize">
                    {r}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
          </div>
        </div>
      </header>
      <main
        className={
          isHome
            ? "container flex flex-1 flex-col py-8 md:py-12"
            : "container flex flex-1 flex-col gap-6 py-6"
        }
      >
        {children}
      </main>
      <Separator />
      <footer className="container py-4">
        <p className="text-muted-foreground mx-auto flex w-fit max-w-full items-center justify-center gap-3 text-center font-mono text-xs">
          <BrandIcon className="size-6 shrink-0" alt="" />
          <span>
            Conduit@Empathy · CHORDS DOI 10.5065/D6V1236Q · Instrument 61 · Site JKUAT 62.
            The browser never calls CHORDS.
          </span>
        </p>
      </footer>
    </div>
  );
}
