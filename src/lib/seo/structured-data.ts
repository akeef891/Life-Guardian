import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo/constants";
import { getAbsoluteUrl, getSiteUrl } from "@/lib/seo/site-url";

export function getStructuredDataJsonLd(): string {
  const siteUrl = getSiteUrl();
  const logoUrl = getAbsoluteUrl("/logo/logo-full.png");

  const graph = [
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
      logo: logoUrl,
      description: SITE_DESCRIPTION,
    },
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
      description: SITE_DESCRIPTION,
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      applicationCategory: "Emergency Response Platform",
      description: SITE_DESCRIPTION,
      url: siteUrl,
      operatingSystem: "Web",
    },
  ];

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  });
}
