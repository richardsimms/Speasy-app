import { Analytics } from '@vercel/analytics/next';
import { setRequestLocale } from 'next-intl/server';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
// import { DashboardRightSidebar } from '@/components/dashboard-right-sidebar';

export default async function MarketingLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div style={{ backgroundColor: '#100e12', minHeight: '100vh' }}>
      <DashboardSidebar />
      <main className="ml-0 min-h-screen md:ml-64">{props.children}</main>
      {/* <DashboardRightSidebar /> */}
      <Analytics />
    </div>
  );
}
