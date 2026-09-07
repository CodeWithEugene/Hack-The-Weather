"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { EXTRACT } from "@/lib/types";
import { formatEat, toIsoZ } from "@/lib/time";

const START = Date.parse(EXTRACT.start);
const END = Date.parse(EXTRACT.end);

type Props = {
  t: string;
  onChange: (iso: string) => void;
};

export function ReplayClock({ t, onChange }: Props) {
  const ms = useMemo(() => {
    const n = Date.parse(t);
    return Number.isNaN(n) ? END : Math.min(END, Math.max(START, n));
  }, [t]);
  const [local, setLocal] = useState(ms);
  useEffect(() => setLocal(ms), [ms]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const step = e.shiftKey ? 60 * 60 * 1000 : 5 * 60 * 1000;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onChange(toIsoZ(Math.max(START, local - step)));
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onChange(toIsoZ(Math.min(END, local + step)));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [local, onChange]);

  function commit(next: number) {
    onChange(toIsoZ(Math.min(END, Math.max(START, next))));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            Conduit week
          </p>
          <p className="font-heading text-2xl tracking-tight">{formatEat(toIsoZ(local))} EAT</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onChange(EXTRACT.end)}>
            Latest
          </Button>
          {EXTRACT.rainTips.map((tip) => (
            <Button key={tip} variant="outline" size="sm" onClick={() => onChange(tip)}>
              Rain {formatEat(tip)}
            </Button>
          ))}
        </div>
      </div>
      <Slider
        min={START}
        max={END}
        step={60_000}
        value={[local]}
        onValueChange={(value) => {
          const next = Array.isArray(value) ? value[0] : value;
          if (typeof next === "number") setLocal(next);
        }}
        onValueCommitted={(value) => {
          const next = Array.isArray(value) ? value[0] : value;
          if (typeof next === "number") commit(next);
        }}
        aria-label="Time in the Conduit week"
      />
      <p className="text-muted-foreground text-xs">
        28 Aug–1 Sep 2026 from instrument 61. Moving the clock re-reads the live Hatua API for that
        timestep. Arrow keys step 5 minutes; shift-arrow steps one hour.
      </p>
    </div>
  );
}
