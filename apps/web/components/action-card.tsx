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
  const jev = (action.explanation?.jev as {
    swahili_advisory?: string;
    dominant_regime?: string;
    work_safety_score?: number;
    model?: string;
  }) || null;

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
          {action.protocol ? (
            <Badge variant="secondary" className="text-[10px] font-normal">
              {action.protocol}
            </Badge>
          ) : null}
        </div>
        <CardTitle className={primary ? "font-heading text-3xl leading-tight tracking-tight md:text-4xl" : "text-lg"}>
          {action.headline}
        </CardTitle>
        <CardDescription className="flex flex-wrap items-center justify-between gap-2">
          <span>Until {formatEat(action.until_eat)} EAT</span>
          {action.persona ? (
            <span className="text-muted-foreground text-xs">
              Target: <strong className="text-foreground font-medium">{action.persona}</strong>
            </span>
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground max-w-prose text-sm">
            {KIND_BLURB[action.kind] ?? "This card is the decision after the trust gate."}
          </p>
          <Button variant="outline" size="sm" onClick={() => onExplain(action.id)}>
            Why this call
          </Button>
        </div>

        {/* Jev System One Bilingual Contextual Advisory */}
        {jev?.swahili_advisory ? (
          <div className="bg-muted/50 border-border/80 flex flex-col gap-1 rounded-md border p-2.5 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                TypeSafe Jev (jev-latest) Contextual Advisory
              </span>
              <span className="font-mono text-[10px]">
                Safety Score: {jev.work_safety_score ?? "--"} / 3.0
              </span>
            </div>
            <p className="text-foreground/90 font-sans italic">
              “{jev.swahili_advisory}”
            </p>
          </div>
        ) : null}

        {/* Africa's Talking Last-Mile Mobile Dispatch Badge */}
        {action.dispatch_channel ? (
          <div className="text-muted-foreground flex items-center justify-between border-t pt-2 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500">📱</span>
              <span>{action.dispatch_channel}</span>
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/70">
              USSD: *384*61#
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
