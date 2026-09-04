import { Suspense } from "react";

import { NowView } from "@/components/now-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Now",
};

export default function NowPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <NowView />
    </Suspense>
  );
}
