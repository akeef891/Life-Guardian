import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Life Guardian and our mission to help during emergencies.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <PageHeader
        title="About Life Guardian"
        description="Our mission is to help people during emergencies."
      />

      <div className="prose prose-slate max-w-none space-y-6 text-muted">
        <p>
          Life Guardian is a web application designed to give you and the people
          around you fast access to critical information when every second counts.
        </p>
        <p>
          With an emergency profile, scannable QR card, and SOS alerts, you can
          prepare ahead of time and act quickly when an emergency happens.
        </p>
        <h2 className="text-xl font-semibold text-foreground">What we offer</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Store medical details and emergency contacts in one place</li>
          <li>Share information via a QR emergency card</li>
          <li>Send SOS alerts to trusted contacts</li>
          <li>Manage everything from a personal dashboard</li>
        </ul>
        <p className="text-sm">
          This is a frontend boilerplate. Authentication, database, and alert
          delivery will be added in future development phases.
        </p>
      </div>
    </div>
  );
}
