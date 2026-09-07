export function searchToQuery(
  sp: Record<string, string | string[] | undefined>,
  patch?: Record<string, string>
): string {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string" && value.length) q.set(key, value);
  }
  if (patch) {
    for (const [key, value] of Object.entries(patch)) q.set(key, value);
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}
