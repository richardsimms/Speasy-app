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
    <div className="container mx-auto h-[calc(100vh-8rem)] max-w-4xl py-4">
      <SpeasyChat />
    </div>
  );
}
