"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrustBadge } from "@/components/trust-badge";
import { formatEat } from "@/lib/time";
import type { ActionPayload, TrustChip } from "@/lib/types";

export function ActionCard({
  action,
  trust,
  primary = false,
  onExplain,
}: {
  action: ActionPayload;
  trust: TrustChip;
  primary?: boolean;
  onExplain: (id: string) => void;
}) {
  return (
    <Card size={primary ? "default" : "sm"} className={primary ? "ring-foreground/20" : ""}>
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-mono">
            {action.kind}
          </Badge>
          <TrustBadge trust={{ status: action.trust_status as TrustChip["status"], flags: trust.flags }} compact />
          <span className="text-muted-foreground text-xs">{action.who}</span>
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
          Shortnames and policy live in Explain. This card is the decision.
        </p>
        <Button variant="outline" size="sm" onClick={() => onExplain(action.id)}>
          Explain
        </Button>
      </CardContent>
    </Card>
  );
}
