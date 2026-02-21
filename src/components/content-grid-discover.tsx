'use client';

import type { Track, VisibleQueueContext } from '@/types/audio';
import { Cpu, DollarSign, Palette, Star, Trophy } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePlaybackOptional } from '@/components/audio/playback-provider';
import { cn } from '@/libs/utils';

import { ContentGridCard } from './content-grid-card';

type ContentItem = {
  id: string;
  title: string;
  summary: string | null;
  imageUrl: string | null;
  category: string;
  duration: number | null;
  keyInsight: string[] | null;
  created_at: string;
  audioUrl?: string | null;
};

type CategoryGroup = {
  categoryName: string;
  items: ContentItem[];
};

type ContentGridDiscoverProps = {
  categories: CategoryGroup[];
  locale: string;
  surface?: 'home' | 'dashboard';
  userId?: string;
  experimentVariant?: string;
  initialCategory?: string;
  autoplay?: boolean;
};

// Map category names to icons
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('tech') || name.includes('ai') || name === 'technology') {
    return Cpu;
  }
  if (name.includes('business') || name.includes('finance')) {
    return DollarSign;
  }
  if (
    name.includes('design')
    || name.includes('arts')
    || name.includes('culture')
  ) {
    return Palette;
  }
  if (name.includes('sport')) {
    return Trophy;
  }
  return Star;
};

const INITIAL_HOME_CARDS = 12;

function buildTabPath(tabId: string): string {
  return tabId === 'latest' ? '/' : `/category/${tabId}`;
}

export function ContentGridDiscover({
  categories,
  locale,
  surface = 'home',
  userId,
  experimentVariant,
  initialCategory,
  autoplay = false,
}: ContentGridDiscoverProps) {
  const playback = usePlaybackOptional();

  // Get all items for "For You" (all content)
  const allItems = categories.flatMap(cat => cat.items);

  // Get "Latest" items (most recent, limit to 20)
  // Sort by full timestamp (newest first)
  const latestItems = [...allItems]
    .sort((a, b) => {
      const dateA = new Date(a.created_at ?? 0).getTime();
      const dateB = new Date(b.created_at ?? 0).getTime();
      // Sort by full timestamp (newest first)
      return dateB - dateA;
    })
    .slice(0, 20);

  // Create tabs: For You, Latest, then categories
  const tabs = [
    //  { id: 'for-you', label: 'For You', icon: Home, items: allItems },
    { id: 'latest', label: 'Latest', icon: Star, items: latestItems },
    ...categories.map(cat => ({
      id: cat.categoryName.toLowerCase().replace(/\s+/g, '-'),
      label: cat.categoryName,
      icon: getCategoryIcon(cat.categoryName),
      items: cat.items,
    })),
  ];

  const resolvedInitial = useMemo(() => {
    if (initialCategory && tabs.some(t => t.id === initialCategory)) {
      return initialCategory;
    }
    return 'latest';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedTab, setSelectedTab] = useState<string>(resolvedInitial);
  const [visibleCardCount, setVisibleCardCount] = useState(INITIAL_HOME_CARDS);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hasAutoPlayed = useRef(false);

  const selectedTabData = tabs.find(tab => tab.id === selectedTab);
  const displayedItems = selectedTabData?.items || [];
  const isHomeWithMore = surface === 'home' && displayedItems.length > INITIAL_HOME_CARDS;
  const visibleItems = isHomeWithMore
    ? displayedItems.slice(0, visibleCardCount)
    : displayedItems;
  const hasMoreToShow = isHomeWithMore && visibleCardCount < displayedItems.length;

  // Build tracks array from displayed items (for queue)
  const tracks = useMemo<Track[]>(() => {
    return displayedItems
      .filter(item => item.audioUrl)
      .map(item => ({
        id: item.id,
        title: item.title,
        audioUrl: item.audioUrl!,
        imageUrl: item.imageUrl ?? undefined,
        category: item.category,
        duration: item.duration ?? undefined,
        publishedAt: item.created_at,
        contentUrl: `/${locale}/content/${item.id}`,
      }));
  }, [displayedItems, locale]);

  // Build queue context based on selected tab
  const queueContext = useMemo<VisibleQueueContext>(() => {
    const isLatest = selectedTab === 'latest';
    return {
      source: isLatest ? 'latest' : 'category',
      locale,
      categoryId: isLatest ? undefined : selectedTab,
      visibleTrackIds: tracks.map(t => t.id),
    };
  }, [selectedTab, locale, tracks]);

  // Extract stable callback references to avoid re-running effect when playback object changes
  const setSelectedCategoryId = playback?.setSelectedCategoryId;
  const setQueueContextFn = playback?.setQueueContext;

  // Track what we've synced to avoid redundant updates that cause re-renders
  const lastSyncedCategoryRef = useRef<string | undefined>(undefined);
  const lastSyncedQueueKeyRef = useRef<string | undefined>(undefined);

  // Update playback provider with selected category for persistence
  // and preload the first track from the current tab
  useEffect(() => {
    if (!setSelectedCategoryId || !setQueueContextFn) {
      return;
    }

    // Set selected category for persistence (only if changed)
    const newCategoryId = selectedTab !== 'latest' ? selectedTab : undefined;
    if (lastSyncedCategoryRef.current !== newCategoryId) {
      lastSyncedCategoryRef.current = newCategoryId;
      setSelectedCategoryId(newCategoryId);
    }

    // Preload the queue with current tab's tracks (only if context changed)
    if (tracks.length > 0) {
      const queueKey = `${queueContext.source}-${queueContext.categoryId ?? 'none'}`;
      if (lastSyncedQueueKeyRef.current !== queueKey) {
        lastSyncedQueueKeyRef.current = queueKey;
        setQueueContextFn(queueContext, tracks);
      }
    }
  }, [setSelectedCategoryId, setQueueContextFn, selectedTab, tracks, queueContext]);

  // Handle autoplay from URL (once, when tracks become available)
  useEffect(() => {
    if (!autoplay || hasAutoPlayed.current || !playback || tracks.length === 0) {
      return;
    }
    hasAutoPlayed.current = true;
    const firstTrack = tracks[0];
    if (firstTrack) {
      playback.playTrack(firstTrack.id, queueContext, tracks);
      playback.openPlayer();
    }
  }, [autoplay, playback, tracks, queueContext]);

  // Sync URL when tab changes (home surface only, shallow replaceState)
  const handleTabChange = useCallback(
    (tabId: string) => {
      setSelectedTab(tabId);
      if (surface === 'home') {
        setVisibleCardCount(INITIAL_HOME_CARDS);
        if (typeof window !== 'undefined') {
          window.history.replaceState(
            window.history.state,
            '',
            buildTabPath(tabId),
          );
        }
      }
    },
    [surface],
  );

  const updateIndicator = useCallback((tabId: string) => {
    const button = tabRefs.current[tabId];
    if (button) {
      setIndicatorStyle({
        left: button.offsetLeft,
        width: button.offsetWidth,
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateIndicator(selectedTab);
    }, 0);

    return () => clearTimeout(timer);
  }, [selectedTab, updateIndicator]);

  const handleTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    tabId: string,
  ) => {
    const currentIndex = tabs.findIndex(tab => tab.id === tabId);

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const direction = e.key === 'ArrowLeft' ? -1 : 1;
      const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
      const nextTab = tabs[nextIndex];
      if (nextTab) {
        handleTabChange(nextTab.id);
        // Focus the next tab button
        const nextButton = e.currentTarget.parentElement?.children[
          nextIndex
        ] as HTMLElement;
        nextButton?.focus();
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      const firstTab = tabs[0];
      if (firstTab) {
        handleTabChange(firstTab.id);
        const firstButton = e.currentTarget.parentElement
          ?.children[0] as HTMLElement;
        firstButton?.focus();
      }
    } else if (e.key === 'End') {
      e.preventDefault();
      const lastTab = tabs[tabs.length - 1];
      if (lastTab) {
        handleTabChange(lastTab.id);
        const lastButton = e.currentTarget.parentElement?.children[
          tabs.length - 1
        ] as HTMLElement;
        lastButton?.focus();
      }
    }
  };

  if (categories.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-white/70">
          No content available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-2">
        <h1 className="mb-3 font-serif text-5xl leading-tight text-white">
          Discover
        </h1>
      </div>

      {/* Tab Navigation */}
      <div
        role="tablist"
        aria-label="Content categories"
        className="-mx-4 flex w-full max-w-full items-center overflow-x-auto px-4 pt-2 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative inline-flex min-w-max  items-center gap-8">
          {/* Animated hover/active background */}
          {indicatorStyle.width > 0 && (
            <div
              className="pointer-events-none absolute inset-y-0 cursor-pointer rounded-lg border border-white/20 bg-white/10 transition-[transform,width,border-color,background-color] duration-300 ease-out"
              style={{
                transform: `translateX(${indicatorStyle.left}px)`,
                width: `${indicatorStyle.width}px`,
              }}
            />
          )}

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedTab === tab.id;
            const isHovered = hoveredTab === tab.id;
            const tabPanelId = `tabpanel-${tab.id}`;

            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={tabPanelId}
                tabIndex={isActive ? 0 : -1}
                onClick={() => {
                  handleTabChange(tab.id);
                  updateIndicator(tab.id);
                }}
                onMouseEnter={() => {
                  setHoveredTab(tab.id);
                  updateIndicator(tab.id);
                }}
                onMouseLeave={() => {
                  setHoveredTab(null);
                  updateIndicator(selectedTab);
                }}
                onKeyDown={e => handleTabKeyDown(e, tab.id)}
                style={{ touchAction: 'manipulation' }}
                className={cn(
                  'relative z-10 inline-flex w-max shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg px-4 py-3 font-medium transition-colors',
                  'min-h-[44px]',
                  'focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]',
                  'active:scale-95',
                  isActive || isHovered ? 'text-white' : 'text-white/70',
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive || isHovered ? 'text-white' : 'text-white/70',
                  )}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Grid - Masonry Layout */}
      {displayedItems.length === 0 && (
        <div
          id={`tabpanel-${selectedTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${selectedTab}`}
          className="py-20 text-center"
        >
          <p className="text-muted-foreground">
            No content available in this category. Check back soon!
          </p>
        </div>
      )}
      {displayedItems.length > 0 && (
        <div
          id={`tabpanel-${selectedTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${selectedTab}`}
          className="space-y-6"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleItems.map((item, index) => {
              const positionInPattern = index % 6;
              const isFeatured = positionInPattern < 2;

              return (
                <div
                  key={item.id}
                  className={cn(
                    isFeatured
                      ? 'sm:col-span-2 lg:col-span-2'
                      : 'sm:col-span-1 lg:col-span-1',
                  )}
                >
                  <ContentGridCard
                    id={item.id}
                    title={item.title}
                    summary={item.summary}
                    keyInsight={item.keyInsight}
                    imageUrl={item.imageUrl}
                    category={item.category}
                    duration={item.duration}
                    createdAt={item.created_at}
                    index={index}
                    locale={locale}
                    surface={surface}
                    userId={userId}
                    experimentVariant={experimentVariant}
                    audioUrl={item.audioUrl}
                    queueContext={queueContext}
                    allTracks={tracks}
                  />
                </div>
              );
            })}
          </div>
          {hasMoreToShow && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={() => setVisibleCardCount(prev => prev + 8)}
                className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white/90 transition-colors hover:border-white/40 hover:bg-white/10 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] focus:outline-none"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
