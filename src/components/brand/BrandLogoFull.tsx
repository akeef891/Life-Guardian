import Image from "next/image";
import { BRAND_LOGO_FULL } from "@/lib/constants/branding";
import { cn } from "@/lib/utils/cn";

type BrandLogoFullProps = {
  className?: string;
};

export function BrandLogoFull({ className }: BrandLogoFullProps) {
  return (
    <Image
      src={BRAND_LOGO_FULL}
      alt="Life Guardian Logo"
      width={BRAND_LOGO_FULL.width}
      height={BRAND_LOGO_FULL.height}
      className={cn("h-20 w-auto max-w-full object-contain object-left lg:h-24", className)}
      sizes="(min-width: 1024px) 96px, 80px"
      quality={100}
      priority={false}
    />
  );
}
