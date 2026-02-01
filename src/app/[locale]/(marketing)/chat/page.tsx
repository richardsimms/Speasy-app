import { getTranslations } from 'next-intl/server';

import { SpeasyChat } from '@/components/chatkit/speasy-chat';

export async function generateMetadata() {
  const t = await getTranslations('Chat');

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function ChatPage() {
  return (
    <div className="container mx-auto h-[calc(100vh-8rem)] max-w-4xl py-4">
      <SpeasyChat />
    </div>
  );
}
