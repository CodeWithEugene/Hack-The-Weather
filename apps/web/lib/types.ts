export type Role = "campus" | "farm" | "science";

export type TrustChip = {
  status: "accept" | "degrade" | "reject";
  flags: string[];
  score?: number;
};

export type ActionPayload = {
  id: string;
  kind: string;
  headline: string;
  until_eat: string | null;
  valid_from: string;
  trust_status: string;
  who: string;
  protocol?: string;
  persona?: string;
  dispatch_channel?: string;
  explanation: Record<string, unknown>;
};

export type NowSnapshot = {
  station_id: number;
  station_name?: string;
  lon?: number;
  lat?: number;
  elev_m?: number;
  observed_at: string | null;
  as_of?: string | null;
  as_of_eat: string | null;
  trust: TrustChip;
  actions: ActionPayload[];
  quiet_reason: string | null;
  ingest: { lag_s: number | null; source: string };
  observation: {
    wbgt: number | null;
    hi: number | null;
    sh1: number | null;
    rg: number | null;
    rg2: number | null;
    su1: number | null;
    st1: number | null;
    ws: number | null;
  } | null;
};

export type TrustPoint = {
  observed_at: string;
  status: string;
  score: number;
  flags: string[];
};

export type ResidualPoint = {
  valid_at: string;
  conduit_mm: number;
  model_mm: number | null;
  model_id: string;
  delta_mm: number | null;
};

export type ObservationPoint = {
  observed_at: string;
  wbgt: number | null;
  hi: number | null;
  sh1: number | null;
  rg: number | null;
  su1: number | null;
  st1: number | null;
};

export type ExplainBody = {
  id: string;
  kind: string;
  status: string;
  headline: string;
  valid_from: string;
  valid_until: string;
  policy_id: string;
  trust_status: string;
  explanation: Record<string, unknown>;
};

export const STATION_ID = 61;

export const EXTRACT = {
  start: "2026-08-28T00:00:25Z",
  end: "2026-09-01T23:58:00Z",
  rainTips: ["2026-08-31T00:13:44Z", "2026-08-31T03:41:33Z"],
} as const;
