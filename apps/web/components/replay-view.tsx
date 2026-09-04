"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ActionCard } from "@/components/action-card";
import { ExplainDrawer } from "@/components/explain-drawer";
import { ReplayClock } from "@/components/replay-clock";
import { TrustBadge } from "@/components/trust-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchNow, postReplay } from "@/lib/api";
import { formatEat } from "@/lib/time";
import { EXTRACT, type Role } from "@/lib/types";

export function ReplayView() {
  const search = useSearchParams();
  const router = useRouter();
  const role = ((search.get("role") as Role) || "campus") as Role;
  const urlT = search.get("t") || EXTRACT.rainTips[1];
  const [t, setT] = useState(urlT);
  const [explainId, setExplainId] = useState<string | null>(null);
  const client = useQueryClient();
  const now = useQuery({
    queryKey: ["now", role],
    queryFn: () => fetchNow(role),
  });
  const replay = useMutation({
    mutationFn: (iso: string) => postReplay(iso),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["now"] });
    },
  });

  const onChange = useCallback(
    (iso: string) => {
      setT(iso);
      const params = new URLSearchParams(search.toString());
      params.set("t", iso);
      router.replace(`/replay?${params.toString()}`);
      replay.mutate(iso);
    },
    [replay, router, search]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">Closed world</p>
        <h1 className="font-heading text-4xl tracking-tight">Replay</h1>
        <p className="text-muted-foreground">
          28 Aug–1 Sep 2026 extract. Scrub to a rain tip and Now follows the cursor.
        </p>
      </div>
      <Card>
        <CardContent className="pt-1">
          <ReplayClock t={t} onChange={onChange} />
        </CardContent>
      </Card>
      {now.isError ? (
        <Alert variant="destructive">
          <AlertTitle>Replay API failed</AlertTitle>
          <AlertDescription>POST /v1/replay did not stick. Is the API up?</AlertDescription>
        </Alert>
      ) : !now.data ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <TrustBadge trust={now.data.trust} />
            <span className="text-muted-foreground text-sm">
              As of {formatEat(now.data.as_of_eat)} EAT
            </span>
          </div>
          {now.data.actions[0] ? (
            <ActionCard
              action={now.data.actions[0]}
              trust={now.data.trust}
              primary
              onExplain={setExplainId}
            />
          ) : (
            <p className="text-muted-foreground">{now.data.quiet_reason}</p>
          )}
          {now.data.actions.slice(1).map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              trust={now.data.trust}
              onExplain={setExplainId}
            />
          ))}
        </div>
      )}
      <ExplainDrawer actionId={explainId} onClose={() => setExplainId(null)} />
    </div>
  );
}
