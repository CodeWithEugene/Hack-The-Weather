"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { BrandIcon, BrandLockup } from "@/components/brand-lockup";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import type { Role } from "@/lib/types";

const NAV = [
  { href: "/", label: "Now" },
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
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link href={hrefWithRole("/")} className="flex items-center">
              <BrandLockup priority />
            </Link>
            <span className="text-muted-foreground hidden font-mono text-xs sm:inline">
              Conduit 61 · Juja
            </span>
          </div>
          <nav className="flex flex-wrap gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={hrefWithRole(item.href)}
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
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6">
        {children}
      </main>
      <Separator />
      <footer className="text-muted-foreground mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-4 font-mono text-xs">
        <BrandIcon className="size-6 shrink-0" alt="" />
        <p>
          Conduit@Empathy · CHORDS DOI 10.5065/D6V1236Q · Instrument 61 · Site JKUAT 62.
          The browser never calls CHORDS.
        </p>
      </footer>
    </div>
  );
}
