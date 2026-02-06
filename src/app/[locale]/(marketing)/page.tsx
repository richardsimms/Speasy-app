import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ContentGridDiscover } from '@/components/content-grid-discover';
import { fetchCategorisedContent } from '@/libs/content-data';

export const revalidate = 300;

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
  };
}

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await props.params;
  const searchParams = await props.searchParams;
  const autoplay = searchParams.autoplay === 'true';
  const result = await fetchCategorisedContent();

  if (!result.ok) {
    const message
      = result.reason === 'no-config'
        ? 'Content is not available. Please check your configuration.'
        : `Error loading content: ${result.message}`;

    return (
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="py-20 text-center">
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <ContentGridDiscover
        categories={result.categories}
        locale={locale}
        surface="home"
        autoplay={autoplay}
      />
    </div>
  );
}
