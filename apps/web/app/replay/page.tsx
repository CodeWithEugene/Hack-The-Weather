import { Suspense } from "react";

import { ReplayView } from "@/components/replay-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReplayPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <ReplayView />
    </Suspense>
  );
}
