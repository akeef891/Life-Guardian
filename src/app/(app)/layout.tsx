import { UserButton } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import { AppProviders } from "@/components/providers/AppProviders";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <Navbar variant="app" />
      <main className="flex-1 overflow-x-hidden" id="main-content">
        <div className="mx-auto min-w-0 max-w-6xl px-3 py-8 sm:px-6 sm:py-10">
          <div className="mb-6 flex items-center justify-end">
            <UserButton />
          </div>
          {children}
        </div>
      </main>
    </AppProviders>
  );
  
}
