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
  if (source === "degraded") {
    return (
      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>Conduit poll failed</AlertTitle>
        <AlertDescription>
          Showing the last trusted station state. Do not treat this as a live reading.
        </AlertDescription>
      </Alert>
    );
  }
  const live = source === "chords";
  if (!live || lagS == null || lagS <= 180) return null;
  return (
    <Alert>
      <AlertTriangle />
      <AlertTitle>Station is {Math.round(lagS / 60)} min behind</AlertTitle>
      <AlertDescription>
        The last Conduit observation is older than three cadences. Do not call this live.
      </AlertDescription>
    </Alert>
  );
}
