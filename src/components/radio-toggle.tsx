'use client';

import { Radio } from 'lucide-react';
import { usePlaybackOptional } from '@/components/audio/playback-provider';
import { cn } from '@/libs/utils';

type RadioToggleProps = {
  className?: string;
  variant?: 'button' | 'badge';
};

/**
 * Radio toggle component for enabling/disabling radio player
 * Can be used anywhere in the app
 */
export function RadioToggle({ className, variant = 'button' }: RadioToggleProps) {
  const playback = usePlaybackOptional();

  if (!playback) {
    return null;
  }

  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={playback.togglePlayerEnabled}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all',
          'hover:bg-white/5 active:scale-95',
          playback.playerEnabled
            ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
            : 'border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20',
          className,
        )}
        aria-label={
          playback.playerEnabled
            ? 'Turn off radio player'
            : 'Turn on radio player'
        }
        aria-pressed={playback.playerEnabled}
      >
        <Radio
          className={cn(
            'h-4 w-4 shrink-0',
            playback.playerEnabled && 'text-blue-400',
          )}
        />
        <span>Radio</span>
        <span
          className={cn(
            'ml-auto h-2 w-2 rounded-full transition-colors',
            playback.playerEnabled ? 'bg-green-500' : 'bg-white/20',
          )}
          aria-hidden="true"
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={playback.togglePlayerEnabled}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all',
        'hover:bg-white/5 active:scale-95',
        playback.playerEnabled
          ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
          : 'border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20',
        className,
      )}
      aria-label={
        playback.playerEnabled
          ? 'Turn off radio player'
          : 'Turn on radio player'
      }
      aria-pressed={playback.playerEnabled}
    >
      <Radio
        className={cn(
          'h-5 w-5 shrink-0',
          playback.playerEnabled && 'text-blue-400',
        )}
      />
      <span>Radio</span>
      <span
        className={cn(
          'ml-auto h-2 w-2 rounded-full transition-colors',
          playback.playerEnabled ? 'bg-green-500' : 'bg-white/20',
        )}
        aria-hidden="true"
      />
    </button>
  );
}
