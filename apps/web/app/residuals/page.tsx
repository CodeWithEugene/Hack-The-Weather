import { redirect } from "next/navigation";

import { searchToQuery } from "@/lib/next-query";

export default async function ResidualsRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  redirect(`/why${searchToQuery(await searchParams, { section: "forecast" })}`);
}
