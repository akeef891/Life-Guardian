import { notFound } from "next/navigation";
import { ContactResponsePanel } from "@/components/respond/ContactResponsePanel";
import { getResponseByToken } from "@/lib/services/sos-response.service";
import type { ContactResponseStatus } from "@/types/emergency-response";

type RespondPageProps = {
  params: Promise<{ token: string }>;
};

export default async function RespondPage({ params }: RespondPageProps) {
  const { token } = await params;
  const record = await getResponseByToken(token);

  if (!record) {
    notFound();
  }

  const victimName =
    record.sosAlert.user.profile?.displayName ??
    record.sosAlert.user.firstName ??
    record.sosAlert.user.email;

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-lg flex-1 overflow-x-hidden px-3 py-8 sm:px-6 sm:py-12">
      <ContactResponsePanel
        token={token}
        contactName={record.contactName}
        victimName={victimName}
        currentStatus={record.status as ContactResponseStatus}
        alertTime={record.sosAlert.createdAt.toISOString()}
      />
    </main>
  );
}
