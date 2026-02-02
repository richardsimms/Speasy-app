import type { ContentItem, StructuredContent } from './types';
import { useEffect, useState } from 'react';

// Type definitions for OpenAI Apps SDK
type OpenAiContext = {
  toolOutput?: {
    structuredContent?: StructuredContent;
  };
  theme?: 'light' | 'dark';
};

// Hook to access OpenAI context with event subscription
function useOpenAiGlobal(): OpenAiContext {
  const [context, setContext] = useState<OpenAiContext>(() => {
    // @ts-expect-error - window.openai is injected by ChatGPT
    const openai = window.openai;

    // eslint-disable-next-line no-console
    console.log('[Speasy] Widget initializing');
    // eslint-disable-next-line no-console
    console.log('[Speasy] window.openai exists:', !!openai);

    if (!openai) {
      console.warn('[Speasy] No window.openai found - using fallback');
      return {
        toolOutput: undefined,
        theme: 'dark',
      };
    }

    // eslint-disable-next-line no-console
    console.log('[Speasy] Initial toolOutput:', openai.toolOutput);
    // eslint-disable-next-line no-console
    console.log('[Speasy] Initial theme:', openai.theme);

    return {
      toolOutput: openai.toolOutput,
      theme: openai.theme || 'dark',
    };
  });

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[Speasy] Setting up openai:set_globals event listener');

    // Subscribe to openai:set_globals events for reactivity
    const handleGlobalsChange = (event: Event) => {
      // eslint-disable-next-line no-console
      console.log('[Speasy] openai:set_globals event fired!', event);

      // @ts-expect-error - window.openai is injected by ChatGPT
      const openai = window.openai;

      if (openai) {
        // eslint-disable-next-line no-console
        console.log('[Speasy] Updated toolOutput:', openai.toolOutput);
        // eslint-disable-next-line no-console
        console.log('[Speasy] Updated theme:', openai.theme);

        setContext({
          toolOutput: openai.toolOutput,
          theme: openai.theme || 'dark',
        });
      }
    };

    window.addEventListener('openai:set_globals', handleGlobalsChange as EventListener);

    return () => {
      // eslint-disable-next-line no-console
      console.log('[Speasy] Removing event listener');
      window.removeEventListener('openai:set_globals', handleGlobalsChange as EventListener);
    };
  }, []);

  return context;
}

export function ContentListWidget() {
  const { toolOutput, theme } = useOpenAiGlobal();

  // Debug logging
  // eslint-disable-next-line no-console
  console.log('[Speasy] Widget rendering with toolOutput:', toolOutput);

  // Extract data from toolOutput
  const data = toolOutput?.structuredContent || {
    items: [],
    count: 0,
    category: 'Latest',
    total_duration_minutes: 0,
  };

  // eslint-disable-next-line no-console
  console.log('[Speasy] Extracted data:', data);
  // eslint-disable-next-line no-console
  console.log('[Speasy] Items count:', data.items?.length);

  const items = data.items || [];
  const isDark = theme === 'dark';

  const handlePlayAll = () => {
    window.open('https://www.speasy.app/latest?autoplay=true', '_blank');
  };

  const handlePlayItem = (item: ContentItem) => {
    window.open(`https://www.speasy.app/content/${item.id}`, '_blank');
  };

  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: isDark ? '#fff' : '#000',
        background: isDark ? '#1a1a1a' : '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${isDark ? '#333' : '#e5e5e5'}`,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 600,
          }}
        >
          Latest Content
        </h3>
        {items.length > 0 && (
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: '14px',
              color: isDark ? '#999' : '#666',
            }}
          >
            {items.length}
            {' '}
            {items.length === 1 ? 'story' : 'stories'}
          </p>
        )}
      </div>

      {/* Content List */}
      <div
        style={{
          padding: '12px 20px',
          maxHeight: '500px',
          overflowY: 'auto',
        }}
      >
        {items.length === 0
          ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                No content available
              </div>
            )
          : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {items.map(item => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    isDark={isDark}
                    onClick={() => handlePlayItem(item)}
                  />
                ))}
              </div>
            )}
      </div>

      {/* Play All Button */}
      {items.length > 0 && (
        <div
          style={{
            padding: '16px 20px',
            borderTop: `1px solid ${isDark ? '#333' : '#e5e5e5'}`,
          }}
        >
          <button
            onClick={handlePlayAll}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              background: isDark ? '#fff' : '#000',
              color: isDark ? '#000' : '#fff',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            ▶ Play All (
            {items.length}
            )
          </button>
        </div>
      )}
    </div>
  );
}

type ContentCardProps = {
  item: ContentItem;
  isDark: boolean;
  onClick: () => void;
};

function ContentCard({ item, isDark, onClick }: ContentCardProps) {
  const durationMin = item.audio_files?.[0]?.duration
    ? Math.round(item.audio_files[0].duration / 60)
    : null;

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        gap: '12px',
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        background: isDark ? '#252525' : '#f9f9f9',
        cursor: 'pointer',
        transition: 'background 0.2s',
        textAlign: 'left',
        width: '100%',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = isDark ? '#2a2a2a' : '#f0f0f0')}
      onMouseLeave={e => (e.currentTarget.style.background = isDark ? '#252525' : '#f9f9f9')}
    >
      {/* Artwork */}
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.title}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '8px',
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      )}

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title */}
        <h4
          style={{
            margin: 0,
            fontSize: '15px',
            fontWeight: 600,
            color: isDark ? '#fff' : '#000',
            marginBottom: '6px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.4',
          }}
        >
          {item.title}
        </h4>

        {/* Summary/Source */}
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            color: isDark ? '#999' : '#666',
            marginBottom: '6px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.3',
          }}
        >
          {item.summary || item.source_name}
        </p>

        {/* Meta info */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {item.category?.name && (
            <span
              style={{
                fontSize: '12px',
                color: isDark ? '#888' : '#888',
              }}
            >
              {item.category.name}
            </span>
          )}
          {durationMin && (
            <span
              style={{
                fontSize: '12px',
                color: isDark ? '#888' : '#888',
              }}
            >
              •
              {' '}
              {durationMin}
              {' '}
              min
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
