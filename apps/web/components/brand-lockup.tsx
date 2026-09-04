import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandLockupProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLockup({ className, priority = false }: BrandLockupProps) {
  return (
    <Image
      src="/brand/hatua-lockup.png"
      alt="Hatua — Trust first. Then act."
      width={2400}
      height={1163}
      priority={priority}
      sizes="180px"
      className={cn("h-14 w-auto md:h-16", className)}
    />
  );
}

export function BrandIcon({ className, alt = "Hatua" }: { className?: string; alt?: string }) {
  return (
    <Image
      src="/brand/hatua-icon.png"
      alt={alt}
      width={1024}
      height={1024}
      sizes="40px"
      aria-hidden={alt === "" || undefined}
      className={cn("size-5", className)}
    />
  );
}
