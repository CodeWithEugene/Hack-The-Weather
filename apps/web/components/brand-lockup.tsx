import { cn } from "@/lib/utils";

type BrandLockupProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLockup({ className }: BrandLockupProps) {
  return (
    <img
      src="/brand/hatua-lockup.png"
      alt="Hatua — Trust first. Then act."
      width={240}
      height={116}
      className={cn("h-14 w-auto object-contain md:h-16", className)}
    />
  );
}

export function BrandIcon({ className, alt = "Hatua" }: { className?: string; alt?: string }) {
  return (
    <img
      src="/brand/hatua-icon.png"
      alt={alt}
      width={24}
      height={24}
      aria-hidden={alt === "" || undefined}
      className={cn("size-6 shrink-0 object-contain", className)}
    />
  );
}
