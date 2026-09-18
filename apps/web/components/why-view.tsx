"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { FlagList, TrustBadge } from "@/components/trust-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { fetchHealth, fetchNow, fetchResiduals, fetchStations, fetchTrust } from "@/lib/api";
import { FLAG_DETAIL, flagLabel, parseRole, trustSentence } from "@/lib/copy";
import { formatEat } from "@/lib/time";
import type { TrustPoint } from "@/lib/types";

const scoreConfig = {
  score: { label: "Trust score", color: "var(--chart-1)" },
} satisfies ChartConfig;

const residualConfig = {
  conduit_mm: { label: "Gauge 1 mm", color: "var(--chart-1)" },
  model_mm: { label: "Forecast mm", color: "var(--chart-2)" },
} satisfies ChartConfig;

type Section = "health" | "forecast" | "station";

function parseSection(raw: string | null): Section {
  if (raw === "forecast" || raw === "station" || raw === "health") return raw;
  return "health";
}

function flagCounts(points: TrustPoint[]): { flag: string; n: number }[] {
  const counts = new Map<string, number>();
  for (const row of points) {
    for (const flag of row.flags) {
      counts.set(flag, (counts.get(flag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([flag, n]) => ({ flag, n }))
    .sort((a, b) => b.n - a.n);
}

export function WhyView() {
  const search = useSearchParams();
  const router = useRouter();
  const role = parseRole(search.get("role"));
  const section = parseSection(search.get("section"));
  const now = useQuery({ queryKey: ["now", role], queryFn: () => fetchNow(role) });
  const series = useQuery({ queryKey: ["trust"], queryFn: () => fetchTrust() });
  const residuals = useQuery({ queryKey: ["residuals"], queryFn: () => fetchResiduals() });
  const health = useQuery({ queryKey: ["health"], queryFn: fetchHealth });
  const stations = useQuery({ queryKey: ["stations"], queryFn: fetchStations });

  function setSection(next: string) {
    const params = new URLSearchParams(search.toString());
    params.set("section", next);
    if (!params.get("role")) params.set("role", role);
    router.replace(`/why?${params.toString()}`);
  }

  if (now.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Evidence unavailable</AlertTitle>
        <AlertDescription>The API did not return station 61.</AlertDescription>
      </Alert>
    );
  }
  if (!now.data) return <Skeleton className="h-64 w-full" />;

  const points = (series.data?.trust ?? []).map((row) => ({
    t: row.observed_at.slice(0, 16),
    score: row.score,
  }));
  const counted = flagCounts(series.data?.trust ?? []);
  const residualRows = residuals.data?.residuals ?? [];
  const modelMissing =
    residualRows.length === 0 || residualRows.every((r) => r.model_mm == null);
  const meta = stations.data?.stations.find((s) => s.id === now.data.station_id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">
            Station {now.data.station_id}
          </p>
          <h1 className="font-heading text-4xl tracking-tight">Why</h1>
          <p className="text-muted-foreground max-w-2xl">
            {trustSentence(now.data.trust)} As of {formatEat(now.data.as_of_eat)} EAT.
          </p>
        </div>
        <TrustBadge trust={now.data.trust} />
      </div>
      <FlagList flags={now.data.trust.flags} />

      <Tabs value={section} onValueChange={setSection}>
        <TabsList className="h-auto w-full max-w-full flex-wrap sm:w-fit">
          <TabsTrigger value="health">Sensor health</TabsTrigger>
          <TabsTrigger value="forecast">Station vs forecast</TabsTrigger>
          <TabsTrigger value="station">This station</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="flex flex-col gap-4 pt-4">
          {series.isError ? (
            <Alert variant="destructive">
              <AlertTitle>Trust series unavailable</AlertTitle>
              <AlertDescription>GET /v1/stations/61/trust failed.</AlertDescription>
            </Alert>
          ) : !series.data ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Trust score over the extract</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={scoreConfig} className="h-56 w-full">
                    <LineChart data={points} accessibilityLayer>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="t" hide />
                      <YAxis domain={[0, 1]} width={32} tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="var(--color-score)"
                        dot={false}
                        strokeWidth={1.5}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Flags in this week</CardTitle>
                </CardHeader>
                <CardContent>
                  {counted.length ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Finding</TableHead>
                          <TableHead className="text-right">Timesteps (sampled)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {counted.map((row) => (
                          <TableRow key={row.flag}>
                            <TableCell>
                              <p>{flagLabel(row.flag)}</p>
                              <p className="text-muted-foreground mt-1">
                                {FLAG_DETAIL[row.flag] ?? ""}
                              </p>
                            </TableCell>
                            <TableCell className="text-right font-mono">{row.n}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground">No flags in the trust series.</p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="forecast" className="flex flex-col gap-4 pt-4">
          {residuals.isError ? (
            <Alert variant="destructive">
              <AlertTitle>Forecast check unavailable</AlertTitle>
              <AlertDescription>GET /v1/stations/61/residuals failed.</AlertDescription>
            </Alert>
          ) : !residuals.data ? (
            <Skeleton className="h-72 w-full" />
          ) : (
            <>
              {modelMissing ? (
                <Alert>
                  <AlertTitle>Forecast unavailable</AlertTitle>
                  <AlertDescription>
                    Campus and farm actions still run from Conduit. This chart waits on a public
                    forecast, not the station. Empty model is missing data, not zero rain.
                  </AlertDescription>
                </Alert>
              ) : null}
              <Card>
                <CardHeader>
                  <CardTitle>Daily millimetres</CardTitle>
                </CardHeader>
                <CardContent>
                  {residualRows.length ? (
                    <ChartContainer config={residualConfig} className="h-72 w-full">
                      <BarChart data={residualRows} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="valid_at" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} width={36} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="conduit_mm" fill="var(--color-conduit_mm)" radius={4} />
                        <Bar dataKey="model_mm" fill="var(--color-model_mm)" radius={4} />
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <p className="text-muted-foreground">
                      No residual rows yet. Run the worker backfill.
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="station" className="flex flex-col gap-4 pt-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Conduit@Empathy Primary Node</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="font-medium text-foreground">{now.data.station_name}</p>
                <p className="text-muted-foreground">Instrument ID: {now.data.station_id} · Site {meta?.site_id ?? 62} JKUAT</p>
                <p className="text-muted-foreground">
                  {meta?.lon ?? now.data.lon} E, {meta?.lat ?? now.data.lat} S · Elev {meta?.elev_m ?? now.data.elev_m} m
                </p>
                <p className="text-muted-foreground">Timezone: Africa/Nairobi (UTC+3)</p>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardTitle>Hatua Trust Engine & Dispatch</CardTitle>
              </CardHeader>
              <CardContent className="text-sm flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span>Policies:</span>
                  <span className="font-mono text-xs text-foreground">trust_v1 · actions_v1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Semantic AI Model:</span>
                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">TypeSafe Jev (jev-latest)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Africa's Talking USSD:</span>
                  <span className="font-mono text-xs text-foreground">*384*61# (Live)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>SMS Callback Webhook:</span>
                  <span className="font-mono text-xs text-foreground">/v1/africastalking/sms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Observations Ingested:</span>
                  <span className="font-mono text-xs text-foreground">{health.data?.observations ?? "7,060"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Kenya 3D-PAWS Sensor Mesh Table */}
          <Card size="sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Kenya 3D-PAWS Regional Sensor Mesh</span>
                <Badge variant="outline" className="text-xs font-normal text-emerald-600 dark:text-emerald-400">
                  National Scaling Node
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Station ID</TableHead>
                    <TableHead>Station Name</TableHead>
                    <TableHead>Coordinates</TableHead>
                    <TableHead>Elevation</TableHead>
                    <TableHead>Mesh Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(stations.data?.stations ?? []).map((st) => (
                    <TableRow key={st.id} className={st.id === now.data.station_id ? "bg-muted/50 font-medium" : ""}>
                      <TableCell className="font-mono">{st.id}</TableCell>
                      <TableCell>{st.name}</TableCell>
                      <TableCell className="font-mono text-xs">{st.lat.toFixed(4)}°, {st.lon.toFixed(4)}°</TableCell>
                      <TableCell className="font-mono text-xs">{st.elev_m} m</TableCell>
                      <TableCell>
                        {st.id === 61 ? (
                          <Badge variant="default" className="text-[10px]">Primary Ground Truth</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">Regional Peer</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <p className="text-muted-foreground text-xs">
            Attribution: Conduit@Empathy, JHUB Africa / JKUAT, 3D-PAWS FEWSNET CHORDS (NCAR/RAL),
            DOI 10.5065/D6V1236Q. Hatua does not own the station. Unplug it and this page goes
            quiet.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
