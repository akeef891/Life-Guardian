import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { isValidIanaTimeZone } from "@/lib/datetime/format-datetime";
import { getIncidentReportForUser } from "@/lib/services/incident-report.service";
import { generateIncidentReportPdf } from "@/lib/services/incident-pdf.service";

type RouteContext = {
  params: Promise<{ alertId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { alertId } = await context.params;
  const user = await getOrCreateCurrentUserWithProfile();
  const report = await getIncidentReportForUser(user.id, alertId);

  if (!report) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }

  const tzParam = new URL(request.url).searchParams.get("tz");
  const timeZone = tzParam && isValidIanaTimeZone(tzParam) ? tzParam : "UTC";
  const pdfBytes = generateIncidentReportPdf(report, timeZone);

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="life-guardian-incident-${alertId}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
