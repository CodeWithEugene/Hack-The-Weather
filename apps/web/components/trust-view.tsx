"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { FlagList, TrustBadge } from "@/components/trust-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { fetchNow, fetchTrust } from "@/lib/api";
import { formatEat } from "@/lib/time";
import type { Role } from "@/lib/types";

const config = {
  score: { label: "Trust score", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function TrustView() {
  const role = ((useSearchParams().get("role") as Role) || "science") as Role;
  const now = useQuery({ queryKey: ["now", role], queryFn: () => fetchNow(role) });
  const series = useQuery({ queryKey: ["trust"], queryFn: () => fetchTrust() });

  if (now.isError || series.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Trust series unavailable</AlertTitle>
        <AlertDescription>The API did not return verdicts for station 61.</AlertDescription>
      </Alert>
    );
  }
  if (!series.data || !now.data) return <Skeleton className="h-64 w-full" />;

  const points = series.data.trust.map((row) => ({
    t: row.observed_at.slice(0, 16),
    score: row.score,
    flags: row.flags.length,
  }));
  const autopsy = [
    ["rg2", "All zeros in the extract. Do not average with gauge 1."],
    ["wgd", "Identical to wg on every row. Drop from climate."],
    ["bv", "Empty. Station power story is unknown."],
    ["hth", "Five spikes of 33501705. Not weather."],
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">Science</p>
          <h1 className="font-heading text-4xl tracking-tight">Trust</h1>
          <p className="text-muted-foreground">Gauge 2 autopsy and rolling verdicts on instrument 61.</p>
        </div>
        <TrustBadge trust={now.data.trust} />
      </div>
      <FlagList flags={now.data.trust.flags} />
      <Card>
        <CardHeader>
          <CardTitle>Score over the extract</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="h-56 w-full">
            <LineChart data={points} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, 1]} width={32} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="score" stroke="var(--color-score)" dot={false} strokeWidth={1.5} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Component autopsy</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shortname</TableHead>
                <TableHead>Finding</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {autopsy.map(([short, finding]) => (
                <TableRow key={short}>
                  <TableCell className="font-mono">{short}</TableCell>
                  <TableCell>{finding}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-muted-foreground mt-3 font-mono text-xs">
            Cursor {formatEat(now.data.as_of_eat)} EAT
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
