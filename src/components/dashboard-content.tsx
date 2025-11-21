'use client';

import { ChevronRight, Cpu, DollarSign, Home, Palette, Star, Trophy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
  if (name.includes('design') || name.includes('arts') || name.includes('culture')) {
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
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
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
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

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
  const categoryAccentColor = accentColors[selectedTabIndex % accentColors.length];

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap',
                isActive
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-muted-foreground hover:text-white hover:bg-white/5',
              )}
            >
              <Icon className={cn(
                'w-4 h-4',
                isActive ? 'text-white' : 'text-muted-foreground',
              )}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
        {/* Scroll indicator */}
        <button
          type="button"
          className="text-muted-foreground ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition-colors hover:border-white/20 hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Content Grid */}
      {displayedItems.length === 0
        ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">
                No content available in this category. Check back soon!
              </p>
            </div>
          )
        : (
            <div className="grid gap-6 lg:grid-cols-3">
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
