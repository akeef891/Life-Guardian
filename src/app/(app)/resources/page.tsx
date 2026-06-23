import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ResourcesExplorerLazy } from "@/components/resources/resources-lazy";
import { getServerLocale } from "@/lib/i18n/server-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Emergency Resources",
  description:
    "Locate nearby hospitals, police stations, and ambulance services with Life Guardian emergency resource discovery.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);

  return (
    <div className="min-w-0">
      <PageHeader title={t.resources.title} description={t.resources.description} />
      <ResourcesExplorerLazy />
    </div>
  );
}
