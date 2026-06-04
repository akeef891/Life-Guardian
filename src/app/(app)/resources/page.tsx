import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ResourcesExplorer } from "@/components/resources/ResourcesExplorer";
import { getServerLocale } from "@/lib/i18n/server-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Emergency Resources",
  description: "Find nearby hospitals, police, and ambulance services.",
};

export default async function ResourcesPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);

  return (
    <div className="min-w-0">
      <PageHeader title={t.resources.title} description={t.resources.description} />
      <ResourcesExplorer />
    </div>
  );
}
