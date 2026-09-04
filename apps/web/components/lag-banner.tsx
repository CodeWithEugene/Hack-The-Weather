"use client";

import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function LagBanner({
  lagS,
  source,
}: {
  lagS: number | null;
  source: string;
}) {
  const live = source === "chords" || source === "degraded";
  if (source === "degraded") {
    return (
      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>Source degraded</AlertTitle>
        <AlertDescription>
          CHORDS poll failed. Showing last trusted Conduit state. Never treat this as live.
        </AlertDescription>
      </Alert>
    );
  }
  if (!live || lagS == null || lagS <= 180) return null;
  return (
    <Alert>
      <AlertTriangle />
      <AlertTitle>Ingest lag {Math.round(lagS / 60)} min</AlertTitle>
      <AlertDescription>
        Last observation is older than three station cadences. Do not call this live.
      </AlertDescription>
    </Alert>
  );
}
