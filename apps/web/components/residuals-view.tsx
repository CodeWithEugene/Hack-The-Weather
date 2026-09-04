"use client";

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { fetchResiduals } from "@/lib/api";

const config = {
  conduit_mm: { label: "Gauge 1 mm", color: "var(--chart-1)" },
  model_mm: { label: "Model mm", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function ResidualsView() {
  const q = useQuery({ queryKey: ["residuals"], queryFn: () => fetchResiduals() });
  if (q.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Residuals unavailable</AlertTitle>
        <AlertDescription>Could not load the Conduit vs model series.</AlertDescription>
      </Alert>
    );
  }
  if (!q.data) return <Skeleton className="h-64 w-full" />;
  const rows = q.data.residuals;
  const modelMissing = rows.length === 0 || rows.every((r) => r.model_mm == null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">Farm / science</p>
        <h1 className="font-heading text-4xl tracking-tight">Residuals</h1>
        <p className="text-muted-foreground">
          Daily gauge-1 total versus Open-Meteo. Null model is unavailable, not zero rain.
        </p>
      </div>
      {modelMissing ? (
        <Alert>
          <AlertTitle>Model unavailable</AlertTitle>
          <AlertDescription>
            Campus and farm actions still run. This page waits on a public forecast, not Conduit.
          </AlertDescription>
        </Alert>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Daily millimetres</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length ? (
            <ChartContainer config={config} className="h-72 w-full">
              <BarChart data={rows} accessibilityLayer>
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
            <p className="text-muted-foreground">No residual rows yet. Run the worker backfill.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
