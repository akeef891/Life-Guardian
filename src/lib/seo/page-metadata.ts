import type { Metadata } from "next";
import { OG_IMAGE_PATH, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo/constants";
import { getAbsoluteUrl } from "@/lib/seo/site-url";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMetadataOptions): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const openGraphTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: openGraphTitle,
      description,
      url: getAbsoluteUrl(canonicalPath),
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: OG_IMAGE_PATH,
          alt: `${SITE_NAME} Logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}

export function getDefaultOpenGraph(): NonNullable<Metadata["openGraph"]> {
  return {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: getAbsoluteUrl("/"),
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: OG_IMAGE_PATH,
        alt: `${SITE_NAME} Logo`,
      },
    ],
  };
}

export function getDefaultTwitter(): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  };
}
