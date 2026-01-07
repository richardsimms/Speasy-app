'use client';

import type { Category } from '@/components/category-picker';
import dynamic from 'next/dynamic';
import { PreferenceIntegration } from './preference-integration';

// Dynamically import PreferenceIntegration with SSR disabled to avoid ClerkProvider issues
// This wrapper is needed because ssr: false is not allowed in Server Components
const DynamicPreferenceIntegration = dynamic(
  () => Promise.resolve({ default: PreferenceIntegration }),
  { ssr: false },
);

type PreferenceIntegrationWrapperProps = {
  categories: Category[];
  locale: string;
};

export function PreferenceIntegrationWrapper({
  categories,
  locale,
}: PreferenceIntegrationWrapperProps) {
  return (
    <DynamicPreferenceIntegration
      categories={categories}
      locale={locale}
    />
  );
}
