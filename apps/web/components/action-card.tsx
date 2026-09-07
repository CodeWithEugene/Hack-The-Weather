"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrustBadge } from "@/components/trust-badge";
import { KIND_BLURB, kindLabel, whoLabel } from "@/lib/copy";
import { formatEat } from "@/lib/time";
import type { ActionPayload, Role, TrustChip } from "@/lib/types";

export function ActionCard({
  action,
  trust,
  role,
  primary = false,
  onExplain,
}: {
  action: ActionPayload;
  trust: TrustChip;
  role: Role;
  primary?: boolean;
  onExplain: (id: string) => void;
}) {
  const science = role === "science";
  return (
    <Card size={primary ? "default" : "sm"} className={primary ? "ring-foreground/20" : ""}>
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-center gap-2">
          {science ? (
            <Badge variant="outline">{kindLabel(action.kind)}</Badge>
          ) : null}
          <TrustBadge
            trust={{ status: action.trust_status as TrustChip["status"], flags: trust.flags }}
            compact
          />
          <span className="text-muted-foreground text-xs">{whoLabel(action.who)}</span>
        </div>
        <CardTitle className={primary ? "font-heading text-3xl leading-tight tracking-tight md:text-4xl" : "text-lg"}>
          {action.headline}
        </CardTitle>
        <CardDescription>
          Until {formatEat(action.until_eat)} EAT
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3 pt-1">
        <p className="text-muted-foreground max-w-prose text-sm">
          {KIND_BLURB[action.kind] ?? "This card is the decision after the trust gate."}
        </p>
        <Button variant="outline" size="sm" onClick={() => onExplain(action.id)}>
          Why this call
        </Button>
      </CardContent>
    </Card>
  );
}
