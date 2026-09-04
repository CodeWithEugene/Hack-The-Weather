"use client";

import { Badge } from "@/components/ui/badge";
import type { TrustChip } from "@/lib/types";

const FLAG_COPY: Record<string, string> = {
  rg2_stuck: "gauge 2 stuck",
  cloned_gust_dir: "cloned gust dir",
  battery_unknown: "battery missing",
  health_garbage: "health garbage",
  thermometer_spread: "thermometer spread",
  implausible_physics: "implausible physics",
  no_data: "no data",
};

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
  const reason = trust.flags[0] ? FLAG_COPY[trust.flags[0]] ?? trust.flags[0] : "clean";
  return (
    <Badge variant={variant} className="font-mono uppercase tracking-wide">
      {trust.status}
      {compact ? null : <span className="normal-case tracking-normal opacity-80">{reason}</span>}
    </Badge>
  );
}

export function FlagList({ flags }: { flags: string[] }) {
  if (!flags.length) {
    return <span className="text-muted-foreground">none</span>;
  }
  return (
    <span className="flex flex-wrap gap-1">
      {flags.map((f) => (
        <Badge key={f} variant="outline" className="font-mono">
          {FLAG_COPY[f] ?? f}
        </Badge>
      ))}
    </span>
  );
}
