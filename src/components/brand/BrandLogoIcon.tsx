import Image from "next/image";
import { BRAND_LOGO_ICON } from "@/lib/constants/branding";
import { cn } from "@/lib/utils/cn";

type BrandLogoIconProps = {
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function BrandLogoIcon({
  className,
  sizes = "40px",
  priority = false,
}: BrandLogoIconProps) {
  return (
    <Image
      src={BRAND_LOGO_ICON}
      alt=""
      width={BRAND_LOGO_ICON.width}
      height={BRAND_LOGO_ICON.height}
      className={cn("shrink-0 object-contain", className)}
      sizes={sizes}
      aria-hidden
      priority={priority}
    />
  );
}
