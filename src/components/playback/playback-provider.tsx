'use client';

import type { PlayerState, Track } from '@/types/playback';
import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FullPlayer } from '@/components/playback/ui/full-player';
import { MiniPlayer } from '@/components/playback/ui/mini-player';

type PlaybackContextValue = {
  state: PlayerState;
  activeTrack: Track | null;
  playTrack: (track: Track, queue?: Track[]) => Promise<void>;
  pause: () => void;
  togglePlay: () => Promise<void>;
  seek: (timeSec: number) => void;
  openPlayer: () => void;
  closePlayer: () => void;
  next: () => void;
  prev: () => void;
};

const PlaybackContext = createContext<PlaybackContextValue | undefined>(
  undefined,
);

const initialState: PlayerState = {
  uiMode: 'inline',
  queueEnabled: false,
  queue: [],
  activeIndex: -1,
  isPlaying: false,
  currentTimeSec: 0,
  durationSec: null,
};

export function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>(initialState);

  const queueRef = useRef<Track[]>([]);
  const activeIndexRef = useRef<number>(-1);
  const queueEnabledRef = useRef<boolean>(false);
  const hasHydratedFromStorage = useRef(false);

  useEffect(() => {
    queueRef.current = state.queue;
    activeIndexRef.current = state.activeIndex;
    queueEnabledRef.current = state.queueEnabled;
  }, [state.queue, state.activeIndex, state.queueEnabled]);

  const ensureAudio = useCallback(() => {
    if (typeof Audio === 'undefined') {
      return null;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
    }
    return audioRef.current;
  }, []);

  const loadTrack = useCallback(
    async (
      track: Track,
      { autoplay = true, startTimeSec = 0 }: { autoplay?: boolean; startTimeSec?: number } = {},
    ) => {
      const audio = ensureAudio();
      if (!audio) {
        return;
      }

      if (audio.src !== track.audioUrl) {
        audio.src = track.audioUrl;
      }

      audio.load();

      if (Number.isFinite(startTimeSec)) {
        audio.currentTime = startTimeSec;
      }

      setState(prev => ({
        ...prev,
        currentTimeSec: startTimeSec || 0,
      }));

      if (autoplay) {
        try {
          await audio.play();
          setState(prev => ({
            ...prev,
            isPlaying: true,
          }));
        } catch {
          setState(prev => ({
            ...prev,
            isPlaying: false,
          }));
        }
      } else {
        setState(prev => ({
          ...prev,
          isPlaying: false,
        }));
      }
    },
    [ensureAudio],
  );

  const activeTrack = useMemo(
    () => state.queue[state.activeIndex] ?? null,
    [state.queue, state.activeIndex],
  );

  const startTrackAtIndex = useCallback(
    async (index: number) => {
      const track = queueRef.current[index];
      if (!track) {
        return;
      }
      setState(prev => ({
        ...prev,
        activeIndex: index,
        currentTimeSec: 0,
        durationSec: track.durationSec ?? null,
        isPlaying: true,
      }));
      await loadTrack(track, { autoplay: true, startTimeSec: 0 });
    },
    [loadTrack],
  );

  const playTrack = useCallback(
    async (track: Track, queue?: Track[]) => {
      const normalizedQueue = (queue?.length ? queue : [track]).filter(
        item => !!item.audioUrl,
      );
      const desiredIndex = normalizedQueue.findIndex(item => item.id === track.id);
      const targetIndex = desiredIndex >= 0 ? desiredIndex : 0;
      const chosenTrack = normalizedQueue[targetIndex];

      if (!chosenTrack) {
        return;
      }

      setState(prev => ({
        ...prev,
        queue: normalizedQueue,
        activeIndex: targetIndex,
        queueEnabled: false,
        uiMode: 'inline',
        isPlaying: true,
        currentTimeSec: 0,
        durationSec: chosenTrack.durationSec ?? null,
      }));

      await loadTrack(chosenTrack, { autoplay: true, startTimeSec: 0 });
    },
    [loadTrack],
  );

  const pause = useCallback(() => {
    const audio = ensureAudio();
    if (!audio) {
      return;
    }
    audio.pause();
    setState(prev => ({
      ...prev,
      isPlaying: false,
    }));
  }, [ensureAudio]);

  const togglePlay = useCallback(async () => {
    const audio = ensureAudio();
    if (!audio || !activeTrack) {
      return;
    }
    if (audio.paused) {
      try {
        await audio.play();
        setState(prev => ({
          ...prev,
          isPlaying: true,
        }));
      } catch {
        setState(prev => ({
          ...prev,
          isPlaying: false,
        }));
      }
    } else {
      audio.pause();
      setState(prev => ({
        ...prev,
        isPlaying: false,
      }));
    }
  }, [activeTrack, ensureAudio]);

  const seek = useCallback(
    (timeSec: number) => {
      const audio = ensureAudio();
      if (!audio) {
        return;
      }
      audio.currentTime = Math.max(0, timeSec);
      setState(prev => ({
        ...prev,
        currentTimeSec: audio.currentTime,
      }));
    },
    [ensureAudio],
  );

  const next = useCallback(() => {
    if (!queueEnabledRef.current) {
      return;
    }
    const nextIndex = activeIndexRef.current + 1;
    if (nextIndex < queueRef.current.length) {
      startTrackAtIndex(nextIndex);
    }
  }, [startTrackAtIndex]);

  const prev = useCallback(() => {
    if (!queueEnabledRef.current) {
      return;
    }
    const prevIndex = activeIndexRef.current - 1;
    if (prevIndex >= 0) {
      startTrackAtIndex(prevIndex);
    }
  }, [startTrackAtIndex]);

  const openPlayer = useCallback(() => {
    setState(prev => ({
      ...prev,
      uiMode: 'player',
      queueEnabled: true,
    }));
  }, []);

  const closePlayer = useCallback(() => {
    setState(prev => ({
      ...prev,
      uiMode: 'inline',
      queueEnabled: false,
    }));

    const track = activeTrack;
    if (track?.contentUrl && pathname && pathname !== track.contentUrl) {
      router.push(track.contentUrl);
    }
  }, [activeTrack, pathname, router]);

  const handleEnded = useCallback(() => {
    if (
      queueEnabledRef.current
      && activeIndexRef.current + 1 < queueRef.current.length
    ) {
      void startTrackAtIndex(activeIndexRef.current + 1);
      return;
    }

    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentTimeSec: 0,
    }));
  }, [startTrackAtIndex]);

  useEffect(() => {
    const audio = ensureAudio();
    if (!audio) {
      return;
    }

    const handleTimeUpdate = () => {
      setState(prev => ({
        ...prev,
        currentTimeSec: audio.currentTime,
      }));
    };

    const handleLoadedMetadata = () => {
      setState(prev => ({
        ...prev,
        durationSec: Number.isFinite(audio.duration) ? audio.duration : prev.durationSec,
      }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [ensureAudio, handleEnded]);

  useEffect(() => {
    if (typeof window === 'undefined' || hasHydratedFromStorage.current) {
      return;
    }
    const saved = window.localStorage.getItem('speasy-playback');
    if (!saved) {
      return;
    }
    try {
      const parsed = JSON.parse(saved) as {
        queue?: Track[];
        activeIndex?: number;
        currentTimeSec?: number;
        queueEnabled?: boolean;
      };
      if (parsed.queue?.length) {
        const targetIndex = parsed.activeIndex ?? 0;
        const safeIndex = Math.min(
          Math.max(targetIndex, 0),
          parsed.queue.length - 1,
        );
        queueRef.current = parsed.queue;
        activeIndexRef.current = safeIndex;
        queueEnabledRef.current = !!parsed.queueEnabled;
        hasHydratedFromStorage.current = true;
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect, react-hooks/set-state-in-effect
        setState(prev => ({
          ...prev,
          queue: parsed.queue!,
          activeIndex: safeIndex,
          currentTimeSec: parsed.currentTimeSec ?? 0,
          durationSec: parsed.queue?.[safeIndex]?.durationSec ?? null,
          queueEnabled: !!parsed.queueEnabled,
          uiMode: 'inline',
          isPlaying: false,
        }));
        const track = parsed.queue[safeIndex];
        if (track) {
          void loadTrack(track, {
            autoplay: false,
            startTimeSec: parsed.currentTimeSec ?? 0,
          });
        }
      }
    } catch {
      // Ignore hydration errors
    }
  }, [loadTrack]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const data = {
      queue: state.queue,
      activeIndex: state.activeIndex,
      currentTimeSec: state.currentTimeSec,
      queueEnabled: state.queueEnabled,
    };
    window.localStorage.setItem('speasy-playback', JSON.stringify(data));
  }, [
    state.queue,
    state.activeIndex,
    state.currentTimeSec,
    state.queueEnabled,
  ]);

  const contextValue = useMemo<PlaybackContextValue>(() => ({
    state,
    activeTrack,
    playTrack,
    pause,
    togglePlay,
    seek,
    openPlayer,
    closePlayer,
    next,
    prev,
  }), [
    activeTrack,
    closePlayer,
    next,
    openPlayer,
    pause,
    playTrack,
    prev,
    seek,
    state,
    togglePlay,
  ]);

  return (
    <PlaybackContext value={contextValue}>
      {children}
      <MiniPlayer />
      <FullPlayer />
    </PlaybackContext>
  );
}

export function usePlayback() {
  const context = use(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
}
