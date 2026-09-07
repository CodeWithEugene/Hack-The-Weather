import { redirect } from "next/navigation";

import { searchToQuery } from "@/lib/next-query";

export default async function NowRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  redirect(`/today${searchToQuery(await searchParams)}`);
}
