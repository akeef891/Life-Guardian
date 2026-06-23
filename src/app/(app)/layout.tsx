import { UserButton } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { AppProviders } from "@/components/providers/AppProviders";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getServerLocale } from "@/lib/i18n/server-locale";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);

  return (
    <AppProviders initialLocale={locale} initialDictionary={dictionary}>
      <Navbar variant="app" />
      <main className="flex-1 overflow-x-hidden" id="main-content">
        <div className="mx-auto min-w-0 max-w-6xl px-3 py-8 sm:px-6 sm:py-10">
          <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
            <LanguageSwitcher />
            <UserButton />
          </div>
          {children}
        </div>
      </main>
    </AppProviders>
  );
}
