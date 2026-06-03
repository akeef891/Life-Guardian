import { UserButton } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar variant="app" />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto min-w-0 max-w-6xl px-3 py-8 sm:px-6 sm:py-10">
          <div className="mb-6 flex items-center justify-end">
            <UserButton />
          </div>
          {children}
        </div>
      </main>
    </>
  );
}
