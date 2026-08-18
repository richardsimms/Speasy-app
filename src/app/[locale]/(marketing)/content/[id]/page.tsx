import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ContentDetailView } from '@/components/content-detail-view';
import { Footer } from '@/components/footer';
import { fetchContentDetail } from '@/libs/content-data';
import { Env } from '@/libs/Env';

export const revalidate = 300;

type ContentDetailProps = {
  params: Promise<{ id: string; locale: string }>;
};

// No paths pre-rendered at build time (content is created continuously by
// the LLM pipeline) -- each id is rendered on first visit and then served
// from the ISR cache for `revalidate` seconds.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata(
  props: ContentDetailProps,
): Promise<Metadata> {
  const { id, locale } = await props.params;

  const hasSupabaseUrl = !!Env.SUPABASE_URL;
  const hasSupabaseKey = !!Env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasSupabaseUrl || !hasSupabaseKey) {
    return {
      title: 'Content Not Available',
    };
  }

  const item = await fetchContentDetail(id);

  const t = await getTranslations({
    locale,
    namespace: 'Dashboard',
  });

  return {
    title: item?.title || t('meta_title'),
    description: item?.title || 'Content detail',
  };
}

export default async function ContentDetail(props: ContentDetailProps) {
  const { id, locale } = await props.params;

  // Check if Supabase is configured
  const hasSupabaseUrl = !!Env.SUPABASE_URL;
  const hasSupabaseKey = !!Env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasSupabaseUrl || !hasSupabaseKey) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-muted-foreground">
          Content is not available. Please check your configuration.
        </p>
      </div>
    );
  }

  const item = await fetchContentDetail(id);

  if (!item) {
    notFound();
  }

  return (
    <>
      <ContentDetailView content={item} locale={locale} surface="home" />
      <Footer />
    </>
  );
}
