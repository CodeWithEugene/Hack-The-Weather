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
import { formatEat } from "@/lib/time";

export function ExplainDrawer({
  actionId,
  onClose,
}: {
  actionId: string | null;
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

  return (
    <Sheet open={Boolean(actionId)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Explain</SheetTitle>
          <SheetDescription>
            Inputs, thresholds, and the versioned policy that issued this action.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 pb-6">
          {q.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : body ? (
            <>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="font-mono">
                  {body.kind}
                </Badge>
                <Badge variant="outline" className="font-mono">
                  {body.policy_id}
                </Badge>
                <Badge variant="outline" className="font-mono">
                  trust {body.trust_status}
                </Badge>
              </div>
              <p className="text-foreground text-base font-medium">{body.headline}</p>
              <p className="text-muted-foreground font-mono text-xs">
                {formatEat(body.valid_from)} → {formatEat(body.valid_until)} EAT
              </p>
              <Separator />
              <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 font-mono text-xs">
                {entries.map(([key, value]) => (
                  <div key={key} className="contents">
                    <dt className="text-muted-foreground">{key}</dt>
                    <dd className="text-right">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
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
