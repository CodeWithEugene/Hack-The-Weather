import Link from "next/link";
import { Suspense } from "react";

import { BrandIcon, BrandLockup } from "@/components/brand-lockup";
import { SiteNav } from "@/components/site-nav";
import { Separator } from "@/components/ui/separator";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b">
        <div className="container grid grid-cols-1 items-center gap-3 py-3 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <Link href="/" className="flex items-center">
              <BrandLockup />
            </Link>
            <span className="text-muted-foreground hidden font-mono text-xs sm:inline">
              Conduit 61 · Juja
            </span>
          </div>
          <Suspense
            fallback={
              <>
                <div className="h-8" />
                <div className="h-8" />
              </>
            }
          >
            <SiteNav />
          </Suspense>
        </div>
      </header>
      <main className="container flex flex-1 flex-col py-8 md:py-12">{children}</main>
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
