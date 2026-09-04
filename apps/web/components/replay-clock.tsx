"use client";

import { useEffect, useMemo } from "react";

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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const step = e.shiftKey ? 60 * 60 * 1000 : 5 * 60 * 1000;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onChange(toIsoZ(Math.max(START, ms - step)));
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onChange(toIsoZ(Math.min(END, ms + step)));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ms, onChange]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Replay clock</p>
          <p className="font-heading text-2xl tracking-tight">{formatEat(toIsoZ(ms))} EAT</p>
          <p className="text-muted-foreground font-mono text-xs">{toIsoZ(ms)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onChange(EXTRACT.start)}>
            Start of extract
          </Button>
          {EXTRACT.rainTips.map((tip, i) => (
            <Button key={tip} variant="outline" size="sm" onClick={() => onChange(tip)}>
              Rain tip {i + 1}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => onChange(EXTRACT.end)}>
            End of extract
          </Button>
        </div>
      </div>
      <Slider
        min={START}
        max={END}
        step={60_000}
        value={[ms]}
        onValueChange={(value) => {
          const next = Array.isArray(value) ? value[0] : value;
          if (typeof next === "number") onChange(toIsoZ(next));
        }}
        aria-label="Replay time"
      />
      <p className="text-muted-foreground text-xs">
        Arrow keys step 5 minutes. Shift-arrow steps one hour. Marks are the two trusted gauge-1 tips.
      </p>
    </div>
  );
}
