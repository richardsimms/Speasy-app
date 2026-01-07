import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/next';
import { setRequestLocale } from 'next-intl/server';
import { AudioPlayerLayout } from '@/components/audio/audio-player-layout';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { routing } from '@/libs/I18nRouting';
import { ClerkLocalizations } from '@/utils/AppConfig';
// import { DashboardRightSidebar } from '@/components/dashboard-right-sidebar';

export default async function MarketingLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const clerkLocale = ClerkLocalizations.supportedLocales[locale] ?? ClerkLocalizations.defaultLocale;
  let signInUrl = '/sign-in';
  let signUpUrl = '/sign-up';
  let dashboardUrl = '/dashboard';
  let afterSignOutUrl = '/';

  if (locale !== routing.defaultLocale) {
    signInUrl = `/${locale}${signInUrl}`;
    signUpUrl = `/${locale}${signUpUrl}`;
    dashboardUrl = `/${locale}${dashboardUrl}`;
    afterSignOutUrl = `/${locale}${afterSignOutUrl}`;
  }

  return (
    <ClerkProvider
      appearance={{
        cssLayerName: 'clerk',
      }}
      localization={clerkLocale}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      signInFallbackRedirectUrl={dashboardUrl}
      signUpFallbackRedirectUrl={dashboardUrl}
      afterSignOutUrl={afterSignOutUrl}
    >
      <AudioPlayerLayout>
        <div style={{ backgroundColor: '#100e12', minHeight: '100vh' }}>
          <DashboardSidebar />
          <main className="ml-0 min-h-screen pb-20 md:ml-64 md:pb-24">
            {props.children}
          </main>
          {/* <DashboardRightSidebar /> */}
          <Analytics />
        </div>
      </AudioPlayerLayout>
    </ClerkProvider>
  );
}
