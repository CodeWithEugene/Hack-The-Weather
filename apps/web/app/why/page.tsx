import { Suspense } from "react";

import { WhyView } from "@/components/why-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Why",
};

export default function WhyPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <WhyView />
    </Suspense>
  );
}
