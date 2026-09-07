"use client";

import { Badge } from "@/components/ui/badge";
import { FLAG_LABEL, TRUST_LABEL, flagLabel } from "@/lib/copy";
import type { TrustChip } from "@/lib/types";

export function TrustBadge({
  trust,
  compact = false,
}: {
  trust: TrustChip;
  compact?: boolean;
}) {
  const variant =
    trust.status === "accept"
      ? "default"
      : trust.status === "degrade"
        ? "outline"
        : "destructive";
  const status = TRUST_LABEL[trust.status] ?? trust.status;
  const reason = trust.flags[0] ? flagLabel(trust.flags[0]) : null;
  return (
    <Badge variant={variant}>
      {status}
      {compact || !reason ? null : (
        <span className="font-normal opacity-80">{reason}</span>
      )}
    </Badge>
  );
}

export function FlagList({ flags }: { flags: string[] }) {
  if (!flags.length) {
    return (
      <p className="text-muted-foreground text-sm">
        No instrument flags on this timestep.
      </p>
    );
  }
  return (
    <span className="flex flex-wrap gap-1">
      {flags.map((f) => (
        <Badge key={f} variant="outline">
          {FLAG_LABEL[f] ?? f}
        </Badge>
      ))}
    </span>
  );
}
