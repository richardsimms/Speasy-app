import { getTranslations } from 'next-intl/server';

import { ChatGPTAppUI, SpeasyChat } from '@/components/chatkit/speasy-chat';

export async function generateMetadata() {
  const t = await getTranslations('Chat');

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

type ChatPageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const params = await searchParams;
  const isChatGPTMode = params.mode === 'chatgpt';

  if (isChatGPTMode) {
    // Render minimal UI for ChatGPT App iframe
    return (
      <div className="h-screen w-full bg-[#100e12] p-4">
        <ChatGPTAppUI />
      </div>
    );
  }

  return (
    <div className="h-100vh mx-auto max-w-4xl px-4 md:h-[calc(100dvh-6rem)] md:px-6 lg:px-8">
      <SpeasyChat />
    </div>
  );
}
