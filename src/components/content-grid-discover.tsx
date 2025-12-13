'use client';

import { Cpu, DollarSign, Palette, Star, Trophy } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/libs/utils';
import { ContentGridCard } from './content-grid-card';

type ContentItem = {
  id: string;
  title: string;
  summary: string | null;
  imageUrl: string | null;
  category: string;
  duration: number | null;
  created_at: string;
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

export function ContentGridDiscover({
  categories,
  locale,
  surface = 'home',
  userId,
  experimentVariant,
}: ContentGridDiscoverProps) {
  // Get all items for "For You" (all content)
  const allItems = categories.flatMap(cat => cat.items);

  // Get "Latest" items (most recent, limit to 20)
  // Sort by date first (newest first), then by title alphabetically
  // For items on the same day, sort by title to interweave content
  const latestItems = [...allItems]
    .sort((a, b) => {
      const dateA = new Date(a.created_at ?? 0);
      const dateB = new Date(b.created_at ?? 0);

      // Compare dates by day (ignoring time) for primary sort
      const dateA_day = new Date(
        dateA.getFullYear(),
        dateA.getMonth(),
        dateA.getDate(),
      ).getTime();
      const dateB_day = new Date(
        dateB.getFullYear(),
        dateB.getMonth(),
        dateB.getDate(),
      ).getTime();

      // Primary sort: by date (newest first)
      const dateDiff = dateB_day - dateA_day;
      if (dateDiff !== 0) {
        return dateDiff;
      }

      // Secondary sort: by title alphabetically (case-insensitive) when same day
      return a.title.localeCompare(b.title, undefined, {
        sensitivity: 'base',
        numeric: true,
      });
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

  const [selectedTab, setSelectedTab] = useState<string>('latest');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selectedTabData = tabs.find(tab => tab.id === selectedTab);
  const displayedItems = selectedTabData?.items || [];

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
        setSelectedTab(nextTab.id);
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
        setSelectedTab(firstTab.id);
        const firstButton = e.currentTarget.parentElement
          ?.children[0] as HTMLElement;
        firstButton?.focus();
      }
    } else if (e.key === 'End') {
      e.preventDefault();
      const lastTab = tabs[tabs.length - 1];
      if (lastTab) {
        setSelectedTab(lastTab.id);
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
        <p className="text-muted-foreground">
          No content available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-2">
        <h1 className="mb-3 text-5xl font-bold text-white">Discover</h1>
        <p className="text-lg text-white/70">
          Explore the latest audio content curated for you
        </p>
      </div>

      {/* Tab Navigation */}
      <div
        role="tablist"
        aria-label="Content categories"
        className="-mx-4 flex w-full max-w-full items-center overflow-x-auto px-4 pt-2 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative inline-flex min-w-max items-center gap-8">
          {/* Animated hover/active background */}
          {indicatorStyle.width > 0 && (
            <div
              className="pointer-events-none absolute inset-y-0 rounded-lg border border-white/20 bg-white/10 transition-all duration-300 ease-out"
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
                  setSelectedTab(tab.id);
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
                  'relative z-10 inline-flex w-max shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 py-3 font-medium transition-colors',
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
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {displayedItems.map((item, index) => {
            // Perplexity-style pattern: 2 featured cards side-by-side (span 2 cols each), then 4 regular cards (1 col each)
            // Pattern repeats every 6 items: [0-1: featured] [2-5: regular] | [6-7: featured] [8-11: regular]
            const positionInPattern = index % 6;
            const isFeatured = positionInPattern < 2; // First 2 items in each group of 6 are featured

            return (
              <div
                key={item.id}
                className={cn(
                  'transition-all',
                  isFeatured
                    ? 'sm:col-span-2 lg:col-span-2'
                    : 'sm:col-span-1 lg:col-span-1',
                )}
              >
                <ContentGridCard
                  id={item.id}
                  title={item.title}
                  summary={item.summary}
                  imageUrl={item.imageUrl}
                  category={item.category}
                  duration={item.duration}
                  index={index}
                  locale={locale}
                  surface={surface}
                  userId={userId}
                  experimentVariant={experimentVariant}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
