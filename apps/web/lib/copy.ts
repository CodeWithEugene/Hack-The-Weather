import type { Role, TrustChip } from "@/lib/types";

export const ROLES: Role[] = ["campus", "farm", "science"];

export const ROLE_LABEL: Record<Role, string> = {
  campus: "Campus",
  farm: "Farm",
  science: "Science",
};

export const ROLE_BLURB: Record<Role, string> = {
  campus: "Go, shade, hydrate, or wait — for outdoor work around JKUAT.",
  farm: "Irrigate or wait, and whether to ventilate overnight.",
  science: "Use, treat with caution, or discard this Conduit timestep.",
};

export function parseRole(raw: string | null | undefined): Role {
  if (raw === "farm" || raw === "science" || raw === "campus") return raw;
  return "campus";
}

export const TRUST_LABEL: Record<TrustChip["status"], string> = {
  accept: "OK",
  degrade: "Caution",
  reject: "Don’t use",
};

export const FLAG_LABEL: Record<string, string> = {
  rg2_stuck: "Rain gauge 2 is stuck at 0 mm",
  cloned_gust_dir: "Gust direction copies gust speed",
  battery_unknown: "Battery voltage is missing",
  health_garbage: "The health flag is not weather",
  thermometer_spread: "Thermometers disagree",
  implausible_physics: "A reading is physically implausible",
  no_data: "No Conduit observation yet",
};

export const FLAG_DETAIL: Record<string, string> = {
  rg2_stuck:
    "Gauge 2 is zeros in this extract. Prefer gauge 1. Do not average rainfall.",
  cloned_gust_dir:
    "Gust direction is a copy of gust speed on every row. Drop it from climate.",
  battery_unknown: "Battery voltage is empty, so station power is unknown.",
  health_garbage:
    "The health channel spikes to values that are not weather. Discard for calibration.",
  thermometer_spread: "On-board thermometers disagree beyond the trust policy.",
  implausible_physics: "A value fell outside the physical range in trust_v1.",
  no_data: "Hatua has no observation at this cursor.",
};

export const KIND_LABEL: Record<string, string> = {
  HEAT_PROTECT: "Heat",
  UV_PROTECT: "UV",
  HUMIDITY_VENTILATE: "Humidity",
  WATER_WAIT: "Water",
  RAIN_ONSET: "Rain",
  STATION_FAULT: "Station",
};

export const KIND_BLURB: Record<string, string> = {
  HEAT_PROTECT: "Heat index or wet-bulb crossed the campus threshold.",
  UV_PROTECT: "Ultraviolet is high enough to limit skin exposure.",
  HUMIDITY_VENTILATE: "Overnight humidity has sat high enough to ventilate.",
  WATER_WAIT: "Demand is high and gauge 1 is still dry — wait on irrigation.",
  RAIN_ONSET: "Gauge 1 recorded rain after a dry gap.",
  STATION_FAULT: "An instrument fault — do not treat this as climate.",
};

export const WHO_LABEL: Record<string, string> = {
  "campus crew": "For campus crews",
  grower: "For growers",
  "campus crew / grower": "For campus and growers",
  "science / AquaTwin": "For AquaTwin and science",
};

export const EXPLAIN_LABEL: Record<string, string> = {
  policy: "Policy",
  trust_flags: "Trust flags",
  wbgt: "Wet-bulb globe",
  wbgt_p90: "Afternoon WBGT threshold",
  hi: "Heat index",
  su1: "Ultraviolet",
  uv_p90: "UV threshold",
  sh1: "Humidity",
  rg: "Rain gauge 1 (mm)",
  gap_hours: "Dry gap (hours)",
  streak_min: "Humidity streak (min)",
  eat_date: "EAT date",
  gauge1_mm: "Gauge 1 so far (mm)",
  et0_proxy: "Water-demand proxy",
  note: "Note",
  reason: "Why this was held back",
  components: "Faults",
  flag: "Flag",
  hth: "Health channel",
};

export function flagLabel(flag: string): string {
  return FLAG_LABEL[flag] ?? flag.replaceAll("_", " ");
}

export function whoLabel(who: string): string {
  return WHO_LABEL[who] ?? who;
}

export function kindLabel(kind: string): string {
  return KIND_LABEL[kind] ?? kind;
}

export function explainLabel(key: string): string {
  return EXPLAIN_LABEL[key] ?? key.replaceAll("_", " ");
}

export function trustSentence(trust: TrustChip): string {
  const status = TRUST_LABEL[trust.status] ?? trust.status;
  if (!trust.flags.length) {
    if (trust.status === "accept") return "This reading is OK to use.";
    return `${status}.`;
  }
  const flags = trust.flags.map(flagLabel).join("; ");
  return `${status} — ${flags}.`;
}

export function quietCopy(reason: string | null, flags: string[]): string {
  if (reason && !reason.startsWith("No outdoor restriction")) return reason;
  let text = "All clear. No outdoor restriction for this audience at this time.";
  if (flags.includes("rg2_stuck")) {
    text += " Rain gauge 2 is still untrusted.";
  }
  return text;
}
