import type { ContentItem, StructuredContent } from './types';
import { useEffect, useState } from 'react';

// Type definitions for OpenAI Apps SDK
type OpenAiContext = {
  toolResult?: any; // Keep flexible to handle different data structures
  theme?: 'light' | 'dark';
};

// Hook to access OpenAI context
function useOpenAi(): OpenAiContext {
  // @ts-expect-error - window.openai is injected by ChatGPT
  const openai = window.openai;

  if (!openai) {
    console.warn('OpenAI SDK not available - using fallback');
    return {
      toolResult: undefined,
      theme: 'dark',
    };
  }

  // Debug: Log what we're receiving
  // eslint-disable-next-line no-console
  console.log('OpenAI SDK available');
  // eslint-disable-next-line no-console
  console.log('toolResult:', openai.toolResult);

  return {
    toolResult: openai.toolResult,
    theme: openai.theme || 'dark',
  };
}

export function ContentListWidget() {
  const { toolResult, theme } = useOpenAi();
  const [data, setData] = useState<StructuredContent>({
    items: [],
    count: 0,
    category: 'Latest',
    total_duration_minutes: 0,
  });

  // Watch for toolResult changes and extract data
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('useEffect triggered, toolResult:', toolResult);

    if (!toolResult) {
      // eslint-disable-next-line no-console
      console.log('No toolResult yet');
      return;
    }

    // Try different possible data structures
    let contentData: StructuredContent | null = null;

    // Option 1: Data is in structuredContent property
    if (toolResult.structuredContent) {
      // eslint-disable-next-line no-console
      console.log('Found data in toolResult.structuredContent');
      contentData = toolResult.structuredContent;
    } else if (toolResult.items && Array.isArray(toolResult.items)) {
      // Option 2: Data is directly in toolResult
      // eslint-disable-next-line no-console
      console.log('Found data directly in toolResult');
      contentData = {
        items: toolResult.items,
        count: toolResult.count || toolResult.items.length,
        category: toolResult.category || 'Latest',
        total_duration_minutes: toolResult.total_duration_minutes || 0,
      };
    } else if (toolResult.result) {
      // Option 3: Check if there's a result property
      // eslint-disable-next-line no-console
      console.log('Found data in toolResult.result');
      // eslint-disable-next-line no-console
      console.log('Found data in toolResult.result');
      if (toolResult.result.structuredContent) {
        contentData = toolResult.result.structuredContent;
      } else if (toolResult.result.items) {
        contentData = {
          items: toolResult.result.items,
          count: toolResult.result.count || toolResult.result.items.length,
          category: toolResult.result.category || 'Latest',
          total_duration_minutes: toolResult.result.total_duration_minutes || 0,
        };
      }
    }

    if (contentData) {
      // eslint-disable-next-line no-console
      console.log('Setting data:', contentData);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(contentData);
    } else {
      console.warn('Could not extract content data from toolResult');
    }
  }, [toolResult]);

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
