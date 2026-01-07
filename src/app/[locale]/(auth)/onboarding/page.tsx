import type { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getSupabaseAdmin } from '@/libs/Supabase';
import { OnboardingClient } from './onboarding-client';

type OnboardingPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: OnboardingPageProps,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Onboarding' as any,
  });

  return {
    title: (t as any)('meta_title'),
    description: (t as any)('meta_description'),
  };
}

/**
 * Onboarding page - shown after user completes Clerk signup
 * Part of Phase 4.1 of the Category Preferences Signup Conversion Plan
 */
export default async function OnboardingPage(props: OnboardingPageProps) {
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

  // Get user email to find Supabase user
  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) {
    redirect(`/${locale}/sign-in`);
  }

  const supabase = getSupabaseAdmin();

  // Get user's Supabase ID
  const { data: supabaseUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (!supabaseUser) {
    // User not synced yet, redirect to dashboard (webhook will handle sync)
    redirect(`/${locale}/dashboard`);
  }

  // Check if user already has preferences (skip onboarding if they do)
  const { data: existingSubscriptions } = await supabase
    .from('user_category_subscriptions')
    .select('category_id')
    .eq('user_id', supabaseUser.id);

  if (existingSubscriptions && existingSubscriptions.length > 0) {
    // User already has preferences, redirect to dashboard
    redirect(`/${locale}/dashboard`);
  }

  // Fetch all categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name, slug, description, image_url')
    .order('name', { ascending: true });

  if (categoriesError || !categories) {
    // If we can't load categories, redirect to dashboard
    redirect(`/${locale}/dashboard`);
  }

  return (
    <OnboardingClient
      categories={categories}
      userId={supabaseUser.id}
      locale={locale}
    />
  );
}
