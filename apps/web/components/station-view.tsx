"use client";

import { useQuery } from "@tanstack/react-query";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchHealth, fetchNow, fetchStations } from "@/lib/api";
import type { Role } from "@/lib/types";
import { useSearchParams } from "next/navigation";

export function StationView({ stationId }: { stationId: string }) {
  const role = ((useSearchParams().get("role") as Role) || "science") as Role;
  const now = useQuery({ queryKey: ["now", role], queryFn: () => fetchNow(role) });
  const health = useQuery({ queryKey: ["health"], queryFn: fetchHealth });
  const stations = useQuery({ queryKey: ["stations"], queryFn: fetchStations });

  if (now.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Station dossier unavailable</AlertTitle>
        <AlertDescription>API did not return station {stationId}.</AlertDescription>
      </Alert>
    );
  }
  if (!now.data) return <Skeleton className="h-64 w-full" />;
  const meta = stations.data?.stations.find((s) => String(s.id) === stationId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">Dossier</p>
        <h1 className="font-heading text-4xl tracking-tight">Station {stationId}</h1>
        <p className="text-muted-foreground">{now.data.station_name}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Conduit</CardTitle>
          </CardHeader>
          <CardContent className="font-mono text-sm">
            <p>CHORDS instrument {stationId}</p>
            <p>Site {meta?.site_id ?? 62} JKUAT</p>
            <p>
              {meta?.lon ?? now.data.lon} E, {meta?.lat ?? now.data.lat} S
            </p>
            <p>{meta?.elev_m ?? now.data.elev_m} m</p>
            <p>Timezone Africa/Nairobi</p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Engine</CardTitle>
          </CardHeader>
          <CardContent className="font-mono text-sm">
            <p>Policy trust_v1 / actions_v1</p>
            <p>Observations {health.data?.observations ?? "—"}</p>
            <p>Source {health.data?.source ?? now.data.ingest.source}</p>
            <p>API {health.data?.api ?? "unknown"}</p>
            <p>Last obs {health.data?.last_obs ?? now.data.observed_at}</p>
          </CardContent>
        </Card>
      </div>
      <p className="text-muted-foreground text-sm">
        Attribution: Conduit@Empathy, JHUB Africa / JKUAT, 3D-PAWS FEWSNET CHORDS (NCAR/RAL), DOI
        10.5065/D6V1236Q. Hatua does not own the station. Unplug it and this page goes quiet.
      </p>
    </div>
  );
}
