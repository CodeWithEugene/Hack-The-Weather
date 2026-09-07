"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { ActionCard } from "@/components/action-card";
import { ExplainDrawer } from "@/components/explain-drawer";
import { LagBanner } from "@/components/lag-banner";
import { ReplayClock } from "@/components/replay-clock";
import { FlagList, TrustBadge } from "@/components/trust-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { fetchNow, fetchObservations, postReplay } from "@/lib/api";
import { parseRole, quietCopy, ROLE_BLURB, trustSentence } from "@/lib/copy";
import { formatEat, num } from "@/lib/time";
import { EXTRACT } from "@/lib/types";
import { cn } from "@/lib/utils";

const sparkConfig = {
  wbgt: { label: "Heat (WBGT)", color: "var(--chart-1)" },
  sh1: { label: "Humidity", color: "var(--chart-2)" },
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
      <span className="text-muted-foreground text-[11px] tracking-wide uppercase">
        {label}
      </span>
      <span className="font-mono text-xl tabular-nums">
        {value}
        <span className="text-muted-foreground ml-1 text-xs">{unit}</span>
      </span>
    </div>
  );
}

function isLatest(asOf: string | null | undefined): boolean {
  if (!asOf) return true;
  return Date.parse(EXTRACT.end) - Date.parse(asOf) < 120_000;
}

export function TodayView() {
  const search = useSearchParams();
  const router = useRouter();
  const role = parseRole(search.get("role"));
  const urlT = search.get("t");
  const [t, setT] = useState(urlT ?? "");
  const [explainId, setExplainId] = useState<string | null>(null);
  const applied = useRef<string | null>(null);
  const client = useQueryClient();
  const now = useQuery({
    queryKey: ["now", role],
    queryFn: () => fetchNow(role),
    refetchInterval: 15_000,
  });
  const obs = useQuery({
    queryKey: ["observations"],
    queryFn: () => fetchObservations(61, 12),
  });
  const replay = useMutation({
    mutationFn: (iso: string) => postReplay(iso),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["now"] });
      await client.invalidateQueries({ queryKey: ["observations"] });
    },
  });

  useEffect(() => {
    if (!urlT || applied.current === urlT) return;
    applied.current = urlT;
    setT(urlT);
    replay.mutate(urlT);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- apply URL cursor once per t
  }, [urlT]);

  useEffect(() => {
    if (!t && now.data?.as_of) setT(now.data.as_of);
  }, [t, now.data?.as_of]);

  const onClock = useCallback(
    (iso: string) => {
      setT(iso);
      applied.current = iso;
      const params = new URLSearchParams(search.toString());
      params.set("t", iso);
      if (!params.get("role")) params.set("role", role);
      router.replace(`/today?${params.toString()}`);
      replay.mutate(iso);
    },
    [replay, router, search, role]
  );

  if (now.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Hatua API unavailable</AlertTitle>
        <AlertDescription>
          Today has nothing to show without the read API. The UI does not invent live numbers.
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
  const whyHref = `/why?role=${encodeURIComponent(role)}`;
  const clock = t || snap.as_of || EXTRACT.end;

  return (
    <div className="flex flex-col gap-6">
      <LagBanner lagS={snap.ingest.lag_s} source={snap.ingest.source} />
      {!isLatest(snap.as_of) ? (
        <Alert>
          <AlertTitle>Not the latest row</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
            <span>
              Showing {formatEat(snap.as_of_eat ?? snap.as_of)} EAT from the Conduit week, not the
              last observation.
            </span>
            <button
              type="button"
              className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
              onClick={() => onClock(EXTRACT.end)}
            >
              Back to latest
            </button>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">
            Station {snap.station_id} · viewing as {role}
          </p>
          <h1 className="font-heading text-4xl tracking-tight md:text-5xl">Today</h1>
          <p className="text-muted-foreground max-w-2xl">
            {ROLE_BLURB[role]} As of {formatEat(snap.as_of_eat ?? snap.observed_at)} EAT.
          </p>
        </div>
        <TrustBadge trust={snap.trust} />
      </div>
      <p className="text-foreground max-w-3xl text-sm">{trustSentence(snap.trust)}</p>
      <FlagList flags={snap.trust.flags} />

      {primary ? (
        <ActionCard
          action={primary}
          trust={snap.trust}
          role={role}
          primary
          onExplain={setExplainId}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-3xl tracking-tight">All clear</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {quietCopy(snap.quiet_reason, snap.trust.flags)}
          </CardContent>
        </Card>
      )}

      {rest.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {rest.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              trust={snap.trust}
              role={role}
              onExplain={setExplainId}
            />
          ))}
        </div>
      ) : null}

      {snap.observation ? (
        <Card size="sm">
          <CardHeader>
            <CardTitle>Latest reading</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Metric label="Heat (WBGT)" value={num(snap.observation.wbgt)} unit="°C" />
            <Metric label="Heat index" value={num(snap.observation.hi)} unit="°C" />
            <Metric label="Humidity" value={num(snap.observation.sh1, 0)} unit="%" />
            <Metric label="Ultraviolet" value={num(snap.observation.su1)} unit="" />
            <Metric label="Rain (gauge 1)" value={num(snap.observation.rg, 2)} unit="mm" />
            <Metric label="Air temp" value={num(snap.observation.st1)} unit="°C" />
            <Metric label="Wind" value={num(snap.observation.ws)} unit="m/s" />
          </CardContent>
          {snap.trust.flags.includes("rg2_stuck") ? (
            <p className="text-muted-foreground px-4 pb-4 text-sm">
              Gauge 2 is excluded from this grid. It is stuck.{" "}
              <Link href={whyHref} className="underline underline-offset-4">
                See sensor health
              </Link>
              .
            </p>
          ) : null}
        </Card>
      ) : null}

      <Card size="sm">
        <CardHeader>
          <CardTitle>Last hours</CardTitle>
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

      <Card>
        <CardContent className="pt-1">
          {replay.isError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Clock did not stick</AlertTitle>
              <AlertDescription>
                POST /v1/replay failed. Today cannot move without the API.
              </AlertDescription>
            </Alert>
          ) : null}
          <ReplayClock t={clock} onChange={onClock} />
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-sm">
        <Link href={whyHref} className="underline underline-offset-4">
          Why this advice
        </Link>
        {" — "}
        sensor health, station vs forecast, and this Conduit site.
      </p>

      <ExplainDrawer actionId={explainId} role={role} onClose={() => setExplainId(null)} />
    </div>
  );
}
