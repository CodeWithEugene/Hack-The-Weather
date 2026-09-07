"use client";

import { useQuery } from "@tanstack/react-query";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchExplain } from "@/lib/api";
import { explainLabel, flagLabel, kindLabel, TRUST_LABEL } from "@/lib/copy";
import { formatEat } from "@/lib/time";
import type { Role, TrustChip } from "@/lib/types";

function formatValue(key: string, value: unknown): string {
  if (key === "trust_flags" && Array.isArray(value)) {
    return value.map((f) => flagLabel(String(f))).join("; ") || "none";
  }
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "object" && item !== null
          ? Object.entries(item as Record<string, unknown>)
              .map(([k, v]) => `${explainLabel(k)}: ${String(v)}`)
              .join(", ")
          : String(item)
      )
      .join("; ");
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
}

export function ExplainDrawer({
  actionId,
  role,
  onClose,
}: {
  actionId: string | null;
  role: Role;
  onClose: () => void;
}) {
  const q = useQuery({
    queryKey: ["explain", actionId],
    queryFn: () => fetchExplain(actionId!),
    enabled: Boolean(actionId),
  });
  const body = q.data;
  const entries = body
    ? Object.entries(body.explanation).filter(([k]) => k !== "trust_flags")
    : [];
  const flags = body && Array.isArray(body.explanation.trust_flags)
    ? (body.explanation.trust_flags as string[])
    : [];
  const science = role === "science";

  return (
    <Sheet open={Boolean(actionId)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Why this call</SheetTitle>
          <SheetDescription>
            Inputs and the versioned policy that issued this action. Hatua does not invent numbers.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 pb-6">
          {q.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : body ? (
            <>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{kindLabel(body.kind)}</Badge>
                <Badge variant="outline">
                  {TRUST_LABEL[body.trust_status as TrustChip["status"]] ?? body.trust_status}
                </Badge>
                {science ? (
                  <Badge variant="outline" className="font-mono">
                    {body.policy_id}
                  </Badge>
                ) : null}
              </div>
              <p className="text-foreground text-base font-medium">{body.headline}</p>
              <p className="text-muted-foreground text-xs">
                {formatEat(body.valid_from)} → {formatEat(body.valid_until)} EAT
              </p>
              {flags.length ? (
                <p className="text-muted-foreground text-sm">
                  Trust flags: {flags.map(flagLabel).join("; ")}.
                </p>
              ) : null}
              <Separator />
              <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 text-sm">
                {entries.map(([key, value]) => (
                  <div key={key} className="contents">
                    <dt className="text-muted-foreground">{explainLabel(key)}</dt>
                    <dd className="text-right font-mono text-xs">
                      {formatValue(key, value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">Action not found.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
