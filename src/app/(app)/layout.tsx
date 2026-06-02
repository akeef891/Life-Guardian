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
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="mb-6 flex items-center justify-end">
            <UserButton />
          </div>
          {children}
        </div>
      </main>
    </>
  );
}
