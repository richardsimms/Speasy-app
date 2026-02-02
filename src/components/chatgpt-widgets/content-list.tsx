import type { ContentItem, StructuredContent, WidgetState } from './types';
import { useState } from 'react';

// Type definitions for OpenAI Apps SDK
// TODO: Replace with actual import when @openai/apps-sdk types are available
type OpenAiContext = {
  toolResult?: {
    structuredContent?: StructuredContent;
  };
  widgetState?: WidgetState;
  theme?: 'light' | 'dark';
  displayMode?: 'inline' | 'fullscreen';
  setWidgetState: (state: WidgetState) => void;
  callTool: (params: { name: string; arguments: Record<string, any> }) => Promise<void>;
  sendFollowUpMessage: (params: { content: string }) => void;
};

// Hook to access OpenAI context
// This will be replaced with actual SDK once types are available
function useOpenAi(): OpenAiContext {
  // @ts-expect-error - window.openai is injected by ChatGPT
  const openai = window.openai;

  if (!openai) {
    console.warn('OpenAI SDK not available - using fallback');
    return {
      toolResult: { structuredContent: { items: [], count: 0, category: 'Latest' } },
      widgetState: {},
      theme: 'dark',
      displayMode: 'inline',
      setWidgetState: () => {},
      callTool: async () => {},
      sendFollowUpMessage: () => {},
    };
  }

  return {
    toolResult: openai.toolResult,
    widgetState: openai.widgetState || {},
    theme: openai.theme || 'dark',
    displayMode: openai.displayMode || 'inline',
    setWidgetState: openai.setWidgetState.bind(openai),
    callTool: openai.callTool.bind(openai),
    sendFollowUpMessage: openai.sendFollowUpMessage.bind(openai),
  };
}

const CATEGORIES = [
  { slug: 'all', label: 'All' },
  { slug: 'ai', label: 'AI' },
  { slug: 'business', label: 'Business' },
  { slug: 'design', label: 'Design' },
  { slug: 'technology', label: 'Technology' },
  { slug: 'productivity', label: 'Productivity' },
];

export function ContentListWidget() {
  const {
    toolResult,
    widgetState,
    theme,
    setWidgetState,
    callTool,
    sendFollowUpMessage,
  } = useOpenAi();

  const [isLoading, setIsLoading] = useState(false);

  // Debug: Log what we're receiving (using console.warn for ESLint)
  // eslint-disable-next-line no-console
  console.log('Widget toolResult:', toolResult);
  // eslint-disable-next-line no-console
  console.log('Widget widgetState:', widgetState);
  // eslint-disable-next-line no-console
  console.log('Widget theme:', theme);

  // Get data from MCP tool result
  const items = toolResult?.structuredContent?.items || [];
  const category = toolResult?.structuredContent?.category || 'Latest';
  const totalDuration = toolResult?.structuredContent?.total_duration_minutes || 0;

  // Get persisted state
  const selectedCategory = widgetState?.selectedCategory || 'all';

  const handleCategoryFilter = async (categorySlug: string) => {
    if (categorySlug === selectedCategory) {
      return; // Already selected
    }

    setIsLoading(true);

    try {
      // Persist state (shown to model for context)
      setWidgetState({ ...widgetState, selectedCategory: categorySlug });

      // Trigger new tool call to fetch filtered content
      await callTool({
        name: 'list_content',
        arguments: {
          category_slug: categorySlug === 'all' ? undefined : categorySlug,
          limit: 10,
        },
      });

      // Optional: Send follow-up message
      const categoryName = CATEGORIES.find(c => c.slug === categorySlug)?.label || 'All';
      sendFollowUpMessage({
        content: `Showing ${categoryName} content`,
      });
    } catch (error) {
      console.error('Failed to filter content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAll = () => {
    const url = category === 'Latest'
      ? 'https://www.speasy.app/latest?autoplay=true'
      : `https://www.speasy.app/category/${category.toLowerCase()}?autoplay=true`;

    window.open(url, '_blank');
  };

  const handlePlayItem = (item: ContentItem) => {
    window.open(`https://www.speasy.app/content/${item.id}`, '_blank');
  };

  const isDark = theme === 'dark';

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
            marginBottom: '4px',
          }}
        >
          {category}
          {' '}
          Content
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            color: isDark ? '#999' : '#666',
          }}
        >
          {items.length}
          {' '}
          stories •
          {totalDuration}
          {' '}
          min total
        </p>
      </div>

      {/* Category Filters */}
      <div
        style={{
          padding: '12px 20px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          borderBottom: `1px solid ${isDark ? '#333' : '#e5e5e5'}`,
        }}
      >
        {CATEGORIES.map(cat => (
          <button
            key={cat.slug}
            onClick={() => handleCategoryFilter(cat.slug)}
            disabled={isLoading}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 500,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              background: selectedCategory === cat.slug
                ? (isDark ? '#fff' : '#000')
                : (isDark ? '#333' : '#f0f0f0'),
              color: selectedCategory === cat.slug
                ? (isDark ? '#000' : '#fff')
                : (isDark ? '#fff' : '#000'),
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Content List */}
      <div
        style={{
          padding: '12px 20px',
          maxHeight: '400px',
          overflowY: 'auto',
        }}
      >
        {isLoading
          ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                Loading...
              </div>
            )
          : items.length === 0
            ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  No content available
                </div>
              )
            : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
            {' '}
            stories)
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
      {/* Thumbnail */}
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.title}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '6px',
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      )}

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Badges */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
          {item.category?.name && (
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                background: isDark ? '#444' : '#e0e0e0',
                color: isDark ? '#fff' : '#000',
              }}
            >
              {item.category.name}
            </span>
          )}
          {durationMin && (
            <span
              style={{
                fontSize: '12px',
                color: isDark ? '#999' : '#666',
              }}
            >
              ⏱️
              {' '}
              {durationMin}
              {' '}
              min
            </span>
          )}
        </div>

        {/* Title */}
        <h4
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 600,
            color: isDark ? '#fff' : '#000',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {item.title}
        </h4>

        {/* Source */}
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            color: isDark ? '#999' : '#666',
          }}
        >
          {item.source_name}
        </p>
      </div>
    </button>
  );
}
