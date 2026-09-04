"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { ActionCard } from "@/components/action-card";
import { ExplainDrawer } from "@/components/explain-drawer";
import { LagBanner } from "@/components/lag-banner";
import { FlagList, TrustBadge } from "@/components/trust-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { fetchNow, fetchObservations } from "@/lib/api";
import { formatEat, num } from "@/lib/time";
import type { Role } from "@/lib/types";

const sparkConfig = {
  wbgt: { label: "WBGT", color: "var(--chart-1)" },
  sh1: { label: "RH", color: "var(--chart-2)" },
} satisfies ChartConfig;

function Metric({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground font-mono text-[11px] tracking-wide uppercase">
        {label}
      </span>
      <span className="font-mono text-xl tabular-nums">
        {value}
        <span className="text-muted-foreground ml-1 text-xs">{unit}</span>
      </span>
    </div>
  );
}

export function NowView() {
  const search = useSearchParams();
  const role = ((search.get("role") as Role) || "campus") as Role;
  const [explainId, setExplainId] = useState<string | null>(null);
  const now = useQuery({
    queryKey: ["now", role],
    queryFn: () => fetchNow(role),
    refetchInterval: 15_000,
  });
  const obs = useQuery({
    queryKey: ["observations"],
    queryFn: () => fetchObservations(61, 12),
  });

  if (now.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>API unavailable</AlertTitle>
        <AlertDescription>
          Hatua has nothing to show without the read API. Start apps/api. The UI does not invent live numbers.
        </AlertDescription>
      </Alert>
    );
  }

  if (!now.data) {
    return <Skeleton className="h-64 w-full" />;
  }

  const snap = now.data;
  const [primary, ...rest] = snap.actions;
  const spark = (obs.data?.observations ?? []).map((row) => ({
    t: row.observed_at.slice(11, 16),
    wbgt: row.wbgt,
    sh1: row.sh1,
  }));

  return (
    <div className="flex flex-col gap-6">
      <LagBanner lagS={snap.ingest.lag_s} source={snap.ingest.source} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">
            Station {snap.station_id} · {role}
          </p>
          <h1 className="font-heading text-4xl tracking-tight md:text-5xl">Now</h1>
          <p className="text-muted-foreground">
            As of {formatEat(snap.as_of_eat ?? snap.observed_at)} EAT · source {snap.ingest.source}
          </p>
        </div>
        <TrustBadge trust={snap.trust} />
      </div>
      <FlagList flags={snap.trust.flags} />

      {primary ? (
        <ActionCard action={primary} trust={snap.trust} primary onExplain={setExplainId} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-3xl tracking-tight">Quiet</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {snap.quiet_reason ?? "No outdoor restriction at this cursor."}
          </CardContent>
        </Card>
      )}

      {rest.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {rest.map((action) => (
            <ActionCard key={action.id} action={action} trust={snap.trust} onExplain={setExplainId} />
          ))}
        </div>
      ) : null}

      {snap.observation ? (
        <Card size="sm">
          <CardHeader>
            <CardTitle>Latest trusted timestep</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Metric label="WBGT" value={num(snap.observation.wbgt)} unit="C" />
            <Metric label="Heat index" value={num(snap.observation.hi)} unit="C" />
            <Metric label="RH sh1" value={num(snap.observation.sh1, 0)} unit="%" />
            <Metric label="UV su1" value={num(snap.observation.su1)} unit="" />
            <Metric label="Rain rg" value={num(snap.observation.rg, 2)} unit="mm" />
            <Metric label="Gauge 2" value={num(snap.observation.rg2, 2)} unit="mm" />
            <Metric label="SHT st1" value={num(snap.observation.st1)} unit="C" />
            <Metric label="Wind" value={num(snap.observation.ws)} unit="m/s" />
          </CardContent>
        </Card>
      ) : null}

      <Card size="sm">
        <CardHeader>
          <CardTitle>Last hours (subordinate)</CardTitle>
        </CardHeader>
        <CardContent>
          {spark.length ? (
            <ChartContainer config={sparkConfig} className="h-40 w-full">
              <LineChart data={spark} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="t" tickLine={false} axisLine={false} hide />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="wbgt" stroke="var(--color-wbgt)" dot={false} strokeWidth={1.5} />
                <Line type="monotone" dataKey="sh1" stroke="var(--color-sh1)" dot={false} strokeWidth={1.5} />
              </LineChart>
            </ChartContainer>
          ) : (
            <Skeleton className="h-40 w-full" />
          )}
        </CardContent>
      </Card>

      <ExplainDrawer actionId={explainId} onClose={() => setExplainId(null)} />
    </div>
  );
}
