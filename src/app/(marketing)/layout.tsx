import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar variant="marketing" />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
