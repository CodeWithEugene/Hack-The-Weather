import { Suspense } from "react";

import { StationView } from "@/components/station-view";
import { Skeleton } from "@/components/ui/skeleton";

export default async function StationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <StationView stationId={id} />
    </Suspense>
  );
}
