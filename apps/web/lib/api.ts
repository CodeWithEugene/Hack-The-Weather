import type {
  ExplainBody,
  NowSnapshot,
  ObservationPoint,
  ResidualPoint,
  Role,
  TrustPoint,
} from "@/lib/types";
import { STATION_ID } from "@/lib/types";

const fromEnv = process.env.NEXT_PUBLIC_API_URL;
export const API_BASE =
  fromEnv !== undefined
    ? fromEnv
    : process.env.NODE_ENV === "production"
      ? ""
      : "http://localhost:8000";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`${res.status} ${path}`);
  }
  return res.json() as Promise<T>;
}

export function fetchNow(role: Role, stationId = STATION_ID) {
  return getJson<NowSnapshot>(
    `/v1/stations/${stationId}/now?role=${encodeURIComponent(role)}`
  );
}

export function fetchTrust(stationId = STATION_ID) {
  return getJson<{ trust: TrustPoint[] }>(`/v1/stations/${stationId}/trust`);
}

export function fetchResiduals(stationId = STATION_ID) {
  return getJson<{ residuals: ResidualPoint[] }>(
    `/v1/stations/${stationId}/residuals`
  );
}

export function fetchObservations(stationId = STATION_ID, everyN = 8) {
  return getJson<{ observations: ObservationPoint[] }>(
    `/v1/stations/${stationId}/observations?every_n=${everyN}`
  );
}

export function fetchExplain(actionId: string, stationId = STATION_ID) {
  return getJson<ExplainBody>(
    `/v1/stations/${stationId}/explain/${encodeURIComponent(actionId)}`
  );
}

export async function postReplay(t: string, stationId = STATION_ID) {
  const res = await fetch(`${API_BASE}/v1/replay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ t, station_id: stationId }),
  });
  if (!res.ok) throw new Error(`replay ${res.status}`);
  return res.json() as Promise<{ as_of: string; station_id: number }>;
}

export function fetchHealth() {
  return getJson<{
    api: string;
    db: string;
    last_obs: string | null;
    observations: number;
    worker_lag_s: number | null;
    source: string;
    station_id: number;
  }>("/health");
}

export function fetchStations() {
  return getJson<{
    stations: {
      id: number;
      name: string;
      lon: number;
      lat: number;
      elev_m: number;
      site_id: number;
    }[];
  }>("/v1/stations");
}
