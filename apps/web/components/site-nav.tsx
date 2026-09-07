"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { parseRole, ROLE_LABEL, ROLES } from "@/lib/copy";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/today", label: "Today" },
  { href: "/why", label: "Why" },
];

export function SiteNav() {
  const pathname = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  const role = parseRole(search.get("role"));
  const isHome = pathname === "/";

  function setRole(next: string) {
    const params = new URLSearchParams(search.toString());
    params.set("role", next);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function hrefWithRole(href: string) {
    const params = new URLSearchParams();
    params.set("role", role);
    const t = search.get("t");
    if (t && href === "/today") params.set("t", t);
    const section = search.get("section");
    if (section && href === "/why") params.set("section", section);
    return `${href}?${params.toString()}`;
  }

  return (
    <>
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
          <Link
            href="/today?role=campus"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            See today’s call
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground hidden text-xs sm:inline">
              Viewing as
            </span>
            <ToggleGroup
              variant="outline"
              size="sm"
              spacing={0}
              value={[role]}
              onValueChange={(next) => {
                const v = Array.isArray(next) ? next[0] : next;
                if (v) setRole(String(v));
              }}
              aria-label="Viewing as"
            >
              {ROLES.map((r) => (
                <ToggleGroupItem key={r} value={r}>
                  {ROLE_LABEL[r]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}
      </div>
    </>
  );
}
