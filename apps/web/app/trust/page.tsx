import { Suspense } from "react";

import { TrustView } from "@/components/trust-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function TrustPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <TrustView />
    </Suspense>
  );
}
