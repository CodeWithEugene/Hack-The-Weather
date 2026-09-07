import { Suspense } from "react";

import { TodayView } from "@/components/today-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Today",
};

export default function TodayPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <TodayView />
    </Suspense>
  );
}
