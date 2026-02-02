import type { ContentItem, StructuredContent } from './types';
import { useCallback, useEffect, useRef, useState } from 'react';

// Type definitions for OpenAI Apps SDK
// ChatGPT unwraps structuredContent - toolOutput contains the data directly
type OpenAiContext = {
  toolOutput?: StructuredContent;
  theme?: 'light' | 'dark';
};

// Hook to access OpenAI context with event subscription
function useOpenAiGlobal(): OpenAiContext {
  const [context, setContext] = useState<OpenAiContext>(() => {
    // @ts-expect-error - window.openai is injected by ChatGPT
    const openai = window.openai;

    if (!openai) {
      return {
        toolOutput: undefined,
        theme: 'dark',
      };
    }

    return {
      toolOutput: openai.toolOutput,
      theme: openai.theme || 'dark',
    };
  });

  useEffect(() => {
    const handleGlobalsChange = () => {
      // @ts-expect-error - window.openai is injected by ChatGPT
      const openai = window.openai;

      if (openai) {
        setContext({
          toolOutput: openai.toolOutput,
          theme: openai.theme || 'dark',
        });
      }
    };

    window.addEventListener('openai:set_globals', handleGlobalsChange as EventListener);

    return () => {
      window.removeEventListener('openai:set_globals', handleGlobalsChange as EventListener);
    };
  }, []);

  return context;
}

// Hook for inline audio playback using a single HTMLAudioElement
function useAudioPlayer(items: ContentItem[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playAllMode, setPlayAllMode] = useState(false);
  const playAllModeRef = useRef(false);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  });

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleTimeUpdate = () => setCurrentTimeSec(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDurationSec(audio.duration);
      setIsLoading(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTimeSec(0);

      if (playAllModeRef.current) {
        const currentItems = itemsRef.current;
        const currentIdx = currentItems.findIndex(
          i => i.id === audio.dataset.itemId,
        );
        const nextItem = currentItems.slice(currentIdx + 1).find(
          i => i.audio_files?.[0]?.file_url,
        );
        if (nextItem) {
          const url = nextItem.audio_files![0]!.file_url;
          audio.dataset.itemId = nextItem.id;
          setActiveItemId(nextItem.id);
          setDurationSec(null);
          audio.src = url;
          audio.play().catch(() => {});
        } else {
          playAllModeRef.current = false;
          setPlayAllMode(false);
          setActiveItemId(null);
        }
      } else {
        setActiveItemId(null);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggleItem = useCallback((itemId: string) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (activeItemId === itemId) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
      return;
    }

    const item = itemsRef.current.find(i => i.id === itemId);
    const url = item?.audio_files?.[0]?.file_url;
    if (!url) {
      return;
    }

    audio.dataset.itemId = itemId;
    setActiveItemId(itemId);
    setCurrentTimeSec(0);
    setDurationSec(null);
    audio.src = url;
    audio.play().catch(() => {});
  }, [activeItemId, isPlaying]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const playAll = useCallback(() => {
    if (playAllMode && isPlaying) {
      audioRef.current?.pause();
      return;
    }

    if (playAllMode && !isPlaying && activeItemId) {
      audioRef.current?.play().catch(() => {});
      return;
    }

    playAllModeRef.current = true;
    setPlayAllMode(true);

    const first = itemsRef.current.find(i => i.audio_files?.[0]?.file_url);
    if (!first) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.dataset.itemId = first.id;
    setActiveItemId(first.id);
    setCurrentTimeSec(0);
    setDurationSec(null);
    audio.src = first.audio_files![0]!.file_url;
    audio.play().catch(() => {});
  }, [playAllMode, isPlaying, activeItemId]);

  const stopPlayAll = useCallback(() => {
    playAllModeRef.current = false;
    setPlayAllMode(false);
  }, []);

  return {
    activeItemId,
    isPlaying,
    currentTimeSec,
    durationSec,
    isLoading,
    playAllMode,
    toggleItem,
    pause,
    playAll,
    stopPlayAll,
  };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ContentListWidget() {
  const { toolOutput, theme } = useOpenAiGlobal();

  // toolOutput contains data directly (ChatGPT unwraps structuredContent)
  const data = toolOutput || {
    items: [],
    count: 0,
    category: 'Latest',
    total_duration_minutes: 0,
  };

  const items = data.items || [];
  const isDark = theme === 'dark';

  const player = useAudioPlayer(items);

  const handlePlayAll = () => {
    player.playAll();
  };

  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: isDark ? '#fff' : '#000',
        background: isDark ? '#1a1a1a' : '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
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
                    isActive={player.activeItemId === item.id}
                    isPlaying={player.activeItemId === item.id && player.isPlaying}
                    isLoading={player.activeItemId === item.id && player.isLoading}
                    currentTimeSec={player.activeItemId === item.id ? player.currentTimeSec : 0}
                    durationSec={player.activeItemId === item.id ? player.durationSec : null}
                    onTogglePlay={() => player.toggleItem(item.id)}
                    onOpenExternal={() => window.open(`https://www.speasy.app/content/${item.id}`, '_blank')}
                  />
                ))}
              </div>
            )}
      </div>

      {/* Footer */}
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
            {player.playAllMode && player.isPlaying ? '⏸ Pause' : `▶ Play All (${items.length})`}
          </button>
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <a
              href="https://www.speasy.app/latest?autoplay=true"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '12px',
                color: isDark ? '#666' : '#999',
                textDecoration: 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
            >
              Open in Speasy
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

type ContentCardProps = {
  item: ContentItem;
  isDark: boolean;
  isActive: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  currentTimeSec: number;
  durationSec: number | null;
  onTogglePlay: () => void;
  onOpenExternal: () => void;
};

function ContentCard({
  item,
  isDark,
  isActive,
  isPlaying,
  isLoading,
  currentTimeSec,
  durationSec,
  onTogglePlay,
  onOpenExternal,
}: ContentCardProps) {
  const hasAudio = Boolean(item.audio_files?.[0]?.file_url);
  const totalDuration = item.audio_files?.[0]?.duration ?? null;
  const progress = isActive && durationSec ? (currentTimeSec / durationSec) * 100 : 0;

  const cardBg = isActive
    ? (isDark ? '#2d2d2d' : '#f0f0f0')
    : (isDark ? '#252525' : '#f9f9f9');

  const hoverBg = isActive
    ? (isDark ? '#303030' : '#eaeaea')
    : (isDark ? '#2a2a2a' : '#f0f0f0');

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        padding: '12px',
        borderRadius: '8px',
        background: cardBg,
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
      onMouseLeave={e => (e.currentTarget.style.background = cardBg)}
    >
      {/* Artwork with play overlay */}
      <button
        type="button"
        onClick={hasAudio ? onTogglePlay : undefined}
        aria-label={isPlaying ? `Pause ${item.title}` : `Play ${item.title}`}
        disabled={!hasAudio}
        style={{
          position: 'relative',
          width: '80px',
          height: '80px',
          flexShrink: 0,
          cursor: hasAudio ? 'pointer' : 'default',
          borderRadius: '8px',
          overflow: 'hidden',
          background: isDark ? '#333' : '#e5e5e5',
          border: 'none',
          padding: 0,
        }}
      >
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.title}
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        )}
        {hasAudio && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.4)',
              opacity: isActive ? 1 : 0,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.opacity = '0';
              }
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isLoading
                ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="#000" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="8" cy="8" r="6" fill="none" stroke="#000" strokeWidth="2" strokeDasharray="28" strokeDashoffset="8" />
                    </svg>
                  )
                : isPlaying
                  ? (
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="#000">
                        <rect x="3" y="2" width="4" height="12" rx="1" />
                        <rect x="9" y="2" width="4" height="12" rx="1" />
                      </svg>
                    )
                  : (
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="#000">
                        <path d="M4 2l10 6-10 6V2z" />
                      </svg>
                    )}
            </div>
          </div>
        )}
      </button>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <h4
          style={{
            margin: 0,
            fontSize: '15px',
            fontWeight: 600,
            color: isDark ? '#fff' : '#000',
            marginBottom: '4px',
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

        {/* Meta row */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginTop: 'auto' }}>
          {item.category?.name && (
            <span style={{ fontSize: '12px', color: '#888' }}>
              {item.category.name}
            </span>
          )}
          {isActive && durationSec
            ? (
                <span style={{ fontSize: '12px', color: isDark ? '#aaa' : '#555' }}>
                  {item.category?.name ? '• ' : ''}
                  {formatTime(currentTimeSec)}
                  {' / '}
                  {formatTime(durationSec)}
                </span>
              )
            : totalDuration
              ? (
                  <span style={{ fontSize: '12px', color: '#888' }}>
                    {item.category?.name ? '• ' : ''}
                    {Math.round(totalDuration / 60)}
                    {' min'}
                  </span>
                )
              : null}
          {/* External link */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenExternal();
            }}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              color: isDark ? '#666' : '#999',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = isDark ? '#aaa' : '#555')}
            onMouseLeave={e => (e.currentTarget.style.color = isDark ? '#666' : '#999')}
            title="Open in Speasy"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9 1h6v6l-2.5-2.5L8 9 7 8l4.5-4.5L9 1zM1 3h5v2H3v8h8v-3h2v5H1V3z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {isActive && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: isDark ? '#fff' : '#000',
              transition: 'width 0.3s linear',
            }}
          />
        </div>
      )}
    </div>
  );
}
