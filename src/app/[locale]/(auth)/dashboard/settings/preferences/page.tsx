import type { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getSupabaseAdmin } from '@/libs/Supabase';
import { PreferencesSettingsClient } from './preferences-settings-client';

type PreferencesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: PreferencesPageProps,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Settings' as any,
  });

  return {
    title: (t as any)('preferences_meta_title', { default: 'Preferences' }),
    description: (t as any)('preferences_meta_description', {
      default: 'Manage your content preferences',
    }),
  };
}

/**
 * Preferences settings page
 * Part of Phase 5.1 of the Category Preferences Signup Conversion Plan
 */
export default async function PreferencesPage(props: PreferencesPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  // Check authentication
  const { userId } = await auth();
  if (!userId) {
    redirect(`/${locale}/sign-in`);
  }

  const user = await currentUser();
  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) {
    redirect(`/${locale}/sign-in`);
  }

  const supabase = getSupabaseAdmin();

  // Get Supabase user ID
  const { data: supabaseUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (!supabaseUser) {
    redirect(`/${locale}/dashboard`);
  }

  // Fetch all categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name, slug, description, image_url')
    .order('name', { ascending: true });

  if (categoriesError || !categories) {
    redirect(`/${locale}/dashboard`);
  }

  // Get user's current preferences
  const { data: subscriptions } = await supabase
    .from('user_category_subscriptions')
    .select('category_id')
    .eq('user_id', supabaseUser.id);

  const currentCategoryIds = subscriptions?.map(s => s.category_id) || [];

  return (
    <PreferencesSettingsClient
      categories={categories}
      currentCategoryIds={currentCategoryIds}
      locale={locale}
    />
  );
}
