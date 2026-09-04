import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    title: "Trust gate",
    description: "Every timestep is checked before it may drive an alert.",
    body: "Stuck rain gauge 2, cloned gust direction, missing battery, thermometer disagreement. Faults are flagged. They are not treated as climate.",
  },
  {
    title: "Same-day action",
    description: "A recommendation, not another weather dashboard.",
    body: "Heat and UV exposure, overnight humidity, rain onset from gauge 1 only, a water-wait proxy from T, RH, wind, and radiation. No invented soil moisture.",
  },
  {
    title: "If Conduit is unplugged",
    description: "Hatua has nothing to say.",
    body: "Instrument 61 at Site JKUAT is load-bearing. The browser never calls CHORDS. We read a Hatua API that already applied trust_v1 and actions_v1.",
  },
];

const FACES = [
  {
    title: "Campus",
    description: "Outdoor work on and around JKUAT, decided the same day.",
    body: "Students, grounds crews, construction, sports, and clinics get a go / shade / hydrate / delay call from heat index, WBGT, UV, and rain onset. The station already records those minutes; Hatua turns them into a decision instead of looking at the sky.",
  },
  {
    title: "Farm",
    description: "Juja–Thika horticulture without a soil-moisture probe.",
    body: "Irrigate this evening or wait, using T, RH, wind, and radiation as a water-demand proxy. Ventilate overnight when humidity sits at 85–90%+ even on a 0 mm day. Leaf-wetness risk is real; invented soil moisture is not.",
  },
  {
    title: "Science",
    description: "Calibration-ready flags for AquaTwin and SPACE-SI.",
    body: "Use, degrade, or discard this timestep before it enters a twin. Prefer gauge 1, ignore cloned gust direction, treat nightly health spikes as sensor faults — so satellite calibration does not eat a dead gauge.",
  },
];

const cardHover =
  "cursor-default transition-colors duration-200 hover:bg-primary hover:text-primary-foreground hover:ring-primary";

const mutedHover =
  "transition-colors duration-200 group-hover/card:text-primary-foreground/80";

function InfoCard({
  title,
  description,
  body,
}: {
  title: string;
  description: string;
  body: string;
}) {
  return (
    <Card className={cardHover}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className={mutedHover}>{description}</CardDescription>
      </CardHeader>
      <CardContent className={cn("text-muted-foreground", mutedHover)}>
        {body}
      </CardContent>
    </Card>
  );
}

export function HomeView() {
  return (
    <div className="flex flex-col gap-16 pb-8">
      <section className="flex flex-col items-center gap-6 pt-6 text-center md:pt-10">
        <Badge variant="outline" className="h-7 rounded-full px-3 font-normal">
          Hack The Weather 2026 · JKUAT
        </Badge>
        <h1 className="font-heading max-w-6xl text-3xl font-bold tracking-tight md:text-5xl">
          Conduit Already Measures. People Still Guess.
          <br />
          Hatua Checks the Reading, Then Tells You How to Act.
        </h1>
        <p className="text-muted-foreground max-w-5xl text-base leading-relaxed md:text-lg">
          Hatua (Kiswahili for step / action) is the last mile from JKUAT’s
          Conduit@Empathy station to a decision someone takes the same day:
          whether a reading is trustworthy, and whether to go outside, hydrate,
          ventilate, or wait on water.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/now"
            className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}
          >
            Open Now
            <ArrowRight data-icon="inline-end" />
          </Link>
          <Link
            href="/trust"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-10 px-5"
            )}
          >
            How trust works
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {PILLARS.map((card) => (
          <InfoCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {FACES.map((card) => (
          <InfoCard key={card.title} {...card} />
        ))}
      </section>
    </div>
  );
}
