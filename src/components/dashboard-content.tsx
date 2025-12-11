'use client';

import {
  ChevronRight,
  Cpu,
  DollarSign,
  Home,
  Palette,
  Star,
  Trophy,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/libs/utils';
import { ContentAudioCard } from './content-audio-card';

type ContentItem = {
  id: string;
  title: string;
  summary: string | null;
  audioUrl: string;
  imageUrl: string | null;
  category: string;
  duration: number | null;
  created_at: string;
};

type CategoryGroup = {
  categoryName: string;
  items: ContentItem[];
};

type DashboardContentProps = {
  categories: CategoryGroup[];
};

const accentColors = [
  'bg-blue-500',
  'bg-orange-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-pink-500',
  'bg-cyan-500',
];

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

export function DashboardContent({ categories }: DashboardContentProps) {
  // Get all items for "For You" (all content)
  const allItems = categories.flatMap(cat => cat.items);

  // Get "Top" items (most recent, limit to 20)
  const topItems = [...allItems]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 20);

  // Create tabs: For You, Top, then categories
  const tabs = [
    { id: 'for-you', label: 'For You', icon: Home, items: allItems },
    { id: 'top', label: 'Top', icon: Star, items: topItems },
    ...categories.map(cat => ({
      id: cat.categoryName.toLowerCase().replace(/\s+/g, '-'),
      label: cat.categoryName,
      icon: getCategoryIcon(cat.categoryName),
      items: cat.items,
    })),
  ];

  const [selectedTab, setSelectedTab] = useState<string>('for-you');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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
    if (currentPlaying !== null) {
      const audio = audioRefs.current[currentPlaying];
      if (audio) {
        const updateProgress = () => {
          if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            setProgress(prev => ({ ...prev, [currentPlaying]: percent }));
          }
        };

        const handleEnded = () => {
          setCurrentPlaying(null);
          setProgress(prev => ({ ...prev, [currentPlaying]: 0 }));
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);

        return () => {
          audio.removeEventListener('timeupdate', updateProgress);
          audio.removeEventListener('ended', handleEnded);
        };
      }
    }
    return undefined;
  }, [currentPlaying]);

  const handlePlay = (id: string) => {
    // Pause all other audio
    Object.entries(audioRefs.current).forEach(([audioId, audio]) => {
      if (audioId !== id) {
        audio.pause();
      }
    });

    const audio = audioRefs.current[id];
    if (!audio) {
      return;
    }

    audio.play();
    setCurrentPlaying(id);
  };

  const handlePause = (id: string) => {
    const audio = audioRefs.current[id];
    if (!audio) {
      return;
    }

    audio.pause();
    setCurrentPlaying(null);
  };

  const registerAudioRef = (id: string, element: HTMLAudioElement | null) => {
    if (element) {
      audioRefs.current[id] = element;
    }
  };

  const selectedTabData = tabs.find(tab => tab.id === selectedTab);
  const displayedItems = selectedTabData?.items || [];

  // Initialize indicator on mount and when selectedTab changes
  useEffect(() => {
    const timer = setTimeout(() => {
      updateIndicator(selectedTab);
    }, 0);
    return () => clearTimeout(timer);
  }, [selectedTab, updateIndicator]);

  if (categories.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">
          No content available yet. Check back soon!
        </p>
      </div>
    );
  }

  const selectedTabIndex = tabs.findIndex(tab => tab.id === selectedTab);
  const categoryAccentColor
    = accentColors[selectedTabIndex % accentColors.length];

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

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div
        role="tablist"
        aria-label="Content categories"
        className="-mx-4 flex items-center overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative flex items-center gap-8">
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
                  'relative z-10 inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 py-3 font-medium transition-colors',
                  'min-h-[44px]',
                  'focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#100e12]',
                  'active:scale-95',
                  isActive || isHovered
                    ? 'text-white'
                    : 'text-muted-foreground',
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive || isHovered
                      ? 'text-white'
                      : 'text-muted-foreground',
                  )}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scroll indicator */}
        <button
          type="button"
          aria-label="Scroll to see more categories"
          className="text-muted-foreground ml-8 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 transition-colors hover:border-white/20 hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Content Grid */}
      {displayedItems.length === 0
        ? (
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
          )
        : (
            <div
              id={`tabpanel-${selectedTab}`}
              role="tabpanel"
              aria-labelledby={`tab-${selectedTab}`}
              className="grid gap-6 lg:grid-cols-3"
            >
              {displayedItems.map((item, index) => (
                <ContentAudioCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  summary={item.summary}
                  audioUrl={item.audioUrl}
                  imageUrl={item.imageUrl}
                  category={selectedTabData?.label || item.category}
                  duration={item.duration}
                  accentColor={categoryAccentColor}
                  index={index}
                  isPlaying={currentPlaying === item.id}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  progress={progress[item.id] || 0}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  isHovered={hoveredId === item.id}
                  onAudioRef={registerAudioRef}
                />
              ))}
            </div>
          )}
    </div>
  );
}
