'use client';

import type { FormEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Loader2, Send } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { MOTION } from '@/libs/motion-config';
import { cn } from '@/libs/utils';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  widget?: WidgetNode;
};

type WidgetAction = {
  type: string;
  payload: {
    action: string;
    url?: string;
    item_id?: string;
    category_slug?: string;
    category_name?: string;
  };
};

type WidgetNode = {
  type: string;
  key?: string;
  value?: string;
  label?: string;
  src?: string;
  alt?: string;
  size?: string;
  color?: string;
  weight?: string;
  width?: number | string;
  height?: number | string;
  gap?: number;
  flex?: number;
  limit?: number;
  maxLines?: number;
  justify?: string;
  align?: string;
  fit?: string;
  background?: string | { dark: string; light: string };
  status?: { text: string; icon: string };
  confirm?: { label: string; action: WidgetAction };
  onClickAction?: WidgetAction;
  children?: WidgetNode[];
};

const STARTER_PROMPTS = [
  { label: 'Latest Stories', prompt: 'Show me the latest stories' },
  { label: 'AI News', prompt: 'What AI content do you have?' },
  { label: 'Business', prompt: 'Show me business content' },
  { label: 'Categories', prompt: 'Show me all categories' },
] as const;

export function SpeasyChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [reducedMotion]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleWidgetAction = useCallback(async (action: WidgetAction) => {
    const { payload } = action;

    if (payload.action === 'play_item' || payload.action === 'play_all') {
      if (payload.url) {
        window.open(payload.url, '_blank');
      }
    } else if (payload.action === 'filter_category' && threadId) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/chatkit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'action',
            thread_id: threadId,
            payload,
          }),
        });

        if (response.ok && response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          let done = false;
          while (!done) {
            const result = await reader.read();
            done = result.done;
            if (result.value) {
              const text = decoder.decode(result.value);
              const lines = text.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                  const eventData = JSON.parse(line.slice(6));
                  if (eventData.type === 'widget') {
                    setMessages(prev => [
                      ...prev,
                      {
                        id: `widget-${Date.now()}`,
                        role: 'assistant',
                        content: '',
                        widget: eventData.widget,
                      },
                    ]);
                  }
                }
              }
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
  }, [threadId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatkit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'message',
          thread_id: threadId,
          content,
        }),
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let done = false;
        while (!done) {
          const result = await reader.read();
          done = result.done;
          if (result.value) {
            const text = decoder.decode(result.value);
            const lines = text.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                try {
                  const eventData = JSON.parse(line.slice(6));

                  if (eventData.type === 'widget') {
                    setMessages(prev => [
                      ...prev,
                      {
                        id: `widget-${Date.now()}`,
                        role: 'assistant',
                        content: '',
                        widget: eventData.widget,
                      },
                    ]);
                  } else if (eventData.type === 'message') {
                    setMessages(prev => [
                      ...prev,
                      {
                        id: `assistant-${Date.now()}`,
                        role: 'assistant',
                        content: eventData.content,
                      },
                    ]);

                    if (!threadId && eventData.thread_id) {
                      setThreadId(eventData.thread_id);
                    }
                  }
                } catch {
                  // Skip malformed JSON
                }
              }
            }
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, threadId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-white/10 px-4 py-4 md:px-6">
        <div className="flex size-10 items-center justify-center rounded-full bg-white/10">
          <Headphones className="size-5 text-white/70" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Speasy AI Assistant</h1>
          <p className="text-sm text-white/50">Discover and play audio content</p>
        </div>
      </header>

      {/* Messages area with live region for screen readers */}
      <div
        className="flex-1 overflow-y-auto p-4 md:p-6"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0
          ? (
              <EmptyState
                onStarterClick={sendMessage}
                reducedMotion={reducedMotion}
              />
            )
          : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    index={index}
                    onAction={handleWidgetAction}
                    reducedMotion={reducedMotion}
                  />
                ))}
                {isLoading && <LoadingSkeleton />}
                <div ref={messagesEndRef} />
              </div>
            )}
      </div>

      {/* Input area */}
      <div className="border-t border-white/10 p-4 md:px-6">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <label htmlFor="chat-input" className="sr-only">
            Message input
          </label>
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about audio content…"
            className={cn(
              'flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white',
              'placeholder:text-white/40',
              'focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="lg"
            className="rounded-xl bg-white text-black hover:bg-white/90"
            aria-label={isLoading ? 'Sending message' : 'Send message'}
          >
            {isLoading
              ? <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              : <Send className="size-5" aria-hidden="true" />}
          </Button>
        </form>
      </div>
    </div>
  );
}

function EmptyState({
  onStarterClick,
  reducedMotion,
}: {
  onStarterClick: (prompt: string) => void;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reducedMotion ? { duration: 0 } : { duration: MOTION.duration.normal, ease: MOTION.easing.default }}
      className="flex h-full flex-col items-center justify-center gap-8"
    >
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-semibold text-balance text-white">
          What would you like to listen to?
        </h2>
        <p className="text-pretty text-white/50">
          Ask me about the latest stories, browse by category, or search for topics
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {STARTER_PROMPTS.map(starter => (
          <Button
            key={starter.prompt}
            variant="outline"
            size="default"
            onClick={() => onStarterClick(starter.prompt)}
            className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            {starter.label}
          </Button>
        ))}
      </div>
    </motion.div>
  );
}

function MessageBubble({
  message,
  index,
  onAction,
  reducedMotion,
}: {
  message: ChatMessage;
  index: number;
  onAction: (action: WidgetAction) => void;
  reducedMotion: boolean;
}) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              duration: MOTION.duration.normal,
              delay: index * MOTION.stagger.cards,
              ease: MOTION.easing.default,
            }
      }
      className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
    >
      {message.widget
        ? (
            <WidgetRenderer widget={message.widget} onAction={onAction} />
          )
        : (
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-3 text-sm md:max-w-[70%]',
                isUser
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white',
              )}
            >
              <p className="text-pretty">{message.content}</p>
            </div>
          )}
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex justify-start" role="status" aria-label="Loading response">
      <div className="flex max-w-[85%] flex-col gap-2 rounded-2xl bg-white/10 px-4 py-3 md:max-w-[70%]">
        <Skeleton variant="text" className="h-4 w-32 bg-white/10" />
        <Skeleton variant="text" className="h-4 w-48 bg-white/10" />
        <Skeleton variant="text" className="h-4 w-24 bg-white/10" />
        <span className="sr-only">Loading response…</span>
      </div>
    </div>
  );
}

function WidgetRenderer({
  widget,
  onAction,
}: {
  widget: WidgetNode;
  onAction: (action: WidgetAction) => void;
}) {
  const renderNode = (node: WidgetNode, index: number = 0): ReactNode => {
    if (!node) {
      return null;
    }

    const key = node.key || `node-${index}`;
    const handleClick = node.onClickAction
      ? () => onAction(node.onClickAction!)
      : undefined;

    // Map gap pixel values to Tailwind classes
    // Server sends px values (4, 8, 12), convert to Tailwind scale
    const gapClass = (gap?: number): string => {
      if (!gap) {
        return 'gap-1';
      }
      // Map pixel values to Tailwind gap classes
      if (gap <= 4) {
        return 'gap-1'; // 4px
      }
      if (gap <= 8) {
        return 'gap-2'; // 8px
      }
      if (gap <= 12) {
        return 'gap-3'; // 12px
      }
      return 'gap-4'; // 16px
    };

    switch (node.type) {
      case 'Card':
        return (
          <div
            key={key}
            className="w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-white/5"
          >
            {node.status && (
              <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-sm text-white/60">
                <Headphones className="size-4" aria-hidden="true" />
                <span>{node.status.text}</span>
              </div>
            )}
            <div className="p-3">
              {node.children?.map((child, i) => renderNode(child, i))}
            </div>
            {node.confirm && (
              <div className="border-t border-white/10 p-3">
                <Button
                  onClick={() => onAction(node.confirm!.action)}
                  className="w-full bg-white text-black hover:bg-white/90"
                >
                  {node.confirm.label}
                </Button>
              </div>
            )}
          </div>
        );

      case 'ListView':
        return (
          <div key={key} className="space-y-1.5">
            {node.children?.slice(0, node.limit || 10).map((child, i) => renderNode(child, i))}
          </div>
        );

      case 'ListViewItem':
        return (
          <button
            key={key}
            type="button"
            onClick={handleClick}
            disabled={!handleClick}
            className={cn(
              'w-full rounded-lg border border-white/10 bg-white/5 p-2 text-left',
              'transition-colors duration-150',
              handleClick && 'cursor-pointer hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20',
              !handleClick && 'cursor-default',
            )}
          >
            {node.children?.map((child, i) => renderNode(child, i))}
          </button>
        );

      case 'Row':
        return (
          <div
            key={key}
            className={cn(
              'flex items-center',
              node.justify === 'between' && 'justify-between',
              gapClass(node.gap),
            )}
          >
            {node.children?.map((child, i) => renderNode(child, i))}
          </div>
        );

      case 'Col':
        return (
          <div
            key={key}
            className={cn(
              'flex flex-col',
              gapClass(node.gap),
              node.flex && 'min-w-0 flex-1',
            )}
          >
            {node.children?.map((child, i) => renderNode(child, i))}
          </div>
        );

      case 'Box':
        return (
          <div
            key={key}
            className="flex items-center justify-center rounded"
          >
            {node.children?.map((child, i) => renderNode(child, i))}
          </div>
        );

      case 'Title':
        return (
          <h3
            key={key}
            className={cn(
              'font-semibold text-white text-balance',
              node.size === '2xl' && 'text-xl',
              node.size === 'xl' && 'text-lg',
              (!node.size || node.size === 'md') && 'text-base',
            )}
          >
            {node.value}
          </h3>
        );

      case 'Text':
        return (
          <p
            key={key}
            className={cn(
              'text-white/80 text-pretty',
              node.size === 'lg' && 'text-base',
              node.size === 'sm' && 'text-sm',
              (!node.size || node.size === 'md') && 'text-sm',
              node.weight === 'semibold' && 'font-semibold',
              node.weight === 'medium' && 'font-medium',
              node.maxLines && 'line-clamp-2',
            )}
          >
            {node.value}
          </p>
        );

      case 'Caption':
        return (
          <p
            key={key}
            className={cn(
              'text-xs text-white/50',
              node.maxLines && 'line-clamp-2',
            )}
          >
            {node.value}
          </p>
        );

      case 'Badge': {
        const variantMap: Record<string, 'default' | 'secondary' | 'outline'> = {
          info: 'default',
          success: 'default',
          warning: 'secondary',
          discovery: 'secondary',
          secondary: 'outline',
        };
        return (
          <Badge
            key={key}
            variant={variantMap[node.color || 'info'] || 'default'}
            className="text-xs"
          >
            {node.label}
          </Badge>
        );
      }

      case 'Image': {
        // If width/height specified, use fixed size thumbnail
        const hasFixedSize = typeof node.width === 'number' && typeof node.height === 'number';
        if (hasFixedSize) {
          return (
            <div
              key={key}
              className="relative shrink-0 overflow-hidden rounded-lg"
              style={{ width: node.width, height: node.height }}
            >
              <Image
                src={node.src || ''}
                alt={node.alt || ''}
                fill
                className="object-cover"
                sizes={`${node.width}px`}
              />
            </div>
          );
        }
        // Full width image for hero/detail views
        return (
          <div key={key} className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={node.src || ''}
              alt={node.alt || ''}
              fill
              className="object-cover"
              sizes="(max-width: 512px) 100vw, 512px"
            />
          </div>
        );
      }

      case 'Divider':
        return <hr key={key} className="my-3 border-white/10" />;

      case 'Button':
        return (
          <Button
            key={key}
            variant="default"
            size="sm"
            onClick={handleClick}
            className="bg-white text-black hover:bg-white/90"
          >
            {node.label}
          </Button>
        );

      default:
        return null;
    }
  };

  return <>{renderNode(widget)}</>;
}

type WidgetWithId = WidgetNode & { _id: string };

let widgetIdCounter = 0;

/**
 * ChatGPT App UI - Renders widgets from MCP tool results
 * Used when page is loaded in ChatGPT App iframe with ?mode=chatgpt
 */
export function ChatGPTAppUI() {
  const [widgets, setWidgets] = useState<WidgetWithId[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Listen for messages from ChatGPT parent frame
    const handleMessage = (event: MessageEvent) => {
      // Accept messages from ChatGPT domains
      const allowedOrigins = [
        'https://chat.openai.com',
        'https://chatgpt.com',
      ];

      if (!allowedOrigins.some(origin => event.origin.startsWith(origin))) {
        return;
      }

      try {
        const data = event.data;

        // Handle tool result messages
        if (data?.type === 'tool_result' && data?.result?.ui) {
          const widgetWithId: WidgetWithId = {
            ...data.result.ui,
            _id: `widget-${++widgetIdCounter}`,
          };
          setWidgets(prev => [...prev, widgetWithId]);
        }

        // Handle connection acknowledgment
        if (data?.type === 'connected') {
          setIsConnected(true);
        }
      } catch {
        // Ignore parse errors from other messages
      }
    };

    window.addEventListener('message', handleMessage);

    // Signal to parent that we're ready
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'speasy_ready' }, '*');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleWidgetAction = useCallback((action: WidgetAction) => {
    if (action.type === 'link' && action.payload?.url) {
      window.open(action.payload.url, '_blank');
    } else if (action.type === 'custom') {
      // Send action back to ChatGPT
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'speasy_action',
          action: action.payload,
        }, '*');
      }
    }
  }, []);

  if (widgets.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-white/50">
        <Headphones className="mb-4 size-12 opacity-50" aria-hidden="true" />
        <p className="text-sm">Waiting for content…</p>
        <p className="mt-1 text-xs text-white/30">
          {isConnected ? 'Connected to ChatGPT' : 'Connecting…'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      {widgets.map(widget => (
        <motion.div
          key={widget._id}
          initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: MOTION.duration.normal, ease: MOTION.easing.default }
          }
        >
          <WidgetRenderer widget={widget} onAction={handleWidgetAction} />
        </motion.div>
      ))}
    </div>
  );
}
