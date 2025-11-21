import { currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import { SyncUserButton } from '@/components/SyncUserButton';

export const Hello = async () => {
  const t = await getTranslations('Dashboard');
  const user = await currentUser();

  // Use first name if available, otherwise fall back to email
  const displayName = user?.firstName ?? user?.primaryEmailAddress?.emailAddress ?? '';

  return (
    <>
      <p>
        {`👋 `}
        {t('hello_message', { name: displayName })}
      </p>
      <p>
        {t.rich('alternative_message', {
          url: () => (
            <a
              className="text-blue-700 hover:border-b-2 hover:border-blue-700"
              href="https://nextjs-boilerplate.com/pro-saas-starter-kit"
            >
              Next.js Boilerplate Pro
            </a>
          ),
        })}
      </p>
      <SyncUserButton />
    </>
  );
};
