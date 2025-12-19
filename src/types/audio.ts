/**
 * Audio player types for global playback state
 */

/**
 * Lean track type for the audio player queue
 * Built from Supabase content schema via a mapper
 */
export type Track = {
  id: string;
  title: string;
  audioUrl: string;
  author?: string;
  imageUrl?: string;
  publishedAt?: string;
  contentUrl: string;
  category: string;
  duration?: number;
};

/**
 * Context for the visible queue on screen
 * Used to rebuild queue from the current list view
 */
export type VisibleQueueContext = {
  source: 'category' | 'latest';
  locale: string;
  categoryId?: string;
  /** Track IDs in newest → oldest order */
  visibleTrackIds: string[];
};

/**
 * UI mode for the player
 * - 'inline': Mini player bar at bottom (default when track is active)
 * - 'player': Full player sheet is open
 */
export type PlayerUIMode = 'inline' | 'player';

/**
 * Global playback state managed by PlaybackProvider
 */
type PlaybackState = {
  /** Current UI mode */
  uiMode: PlayerUIMode;
  /** Whether the global player is enabled (toggle in nav) - defaults to true */
  playerEnabled: boolean;
  /** Current queue of tracks */
  queue: Track[];
  /** Index of the currently active track in the queue */
  activeIndex: number;
  /** Currently active track (derived from queue[activeIndex]) */
  activeTrack: Track | null;
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Current playback position in seconds */
  currentTimeSec: number;
  /** Total duration of current track in seconds */
  durationSec: number | null;
  /** Context for the visible queue (for rebuilding on navigation) */
  visibleQueueContext?: VisibleQueueContext;
  /** Selected category ID for close-to-home persistence */
  selectedCategoryId?: string;
  /** Whether audio is loading */
  isLoading: boolean;
};

/**
 * Actions available from the playback provider
 */
type PlaybackActions = {
  /** Play a specific track, optionally setting queue context */
  playTrack: (
    trackId: string,
    queueContext?: VisibleQueueContext,
    tracks?: Track[],
  ) => void;
  /** Pause playback */
  pause: () => void;
  /** Toggle play/pause */
  togglePlay: () => void;
  /** Seek to a specific time in seconds */
  seek: (timeSec: number) => void;
  /** Open the full player sheet */
  openPlayer: () => void;
  /** Close the full player sheet */
  closePlayer: () => void;
  /** Skip to next track */
  next: () => void;
  /** Skip to previous track */
  prev: () => void;
  /** Set the visible queue context and tracks */
  setQueueContext: (context: VisibleQueueContext, tracks: Track[]) => void;
  /** Set the selected category ID for persistence */
  setSelectedCategoryId: (categoryId: string | undefined) => void;
  /** Toggle the global player on/off */
  togglePlayerEnabled: () => void;
};

/**
 * Combined context value for the playback provider
 */
export type PlaybackContextValue = PlaybackState & PlaybackActions;

/**
 * localStorage keys for persistence
 */
export const PLAYBACK_STORAGE_KEYS = {
  activeTrackId: 'speasy-active-track-id',
  currentTimeSec: 'speasy-current-time-sec',
  selectedCategoryId: 'speasy-selected-category-id',
  lastQueueContext: 'speasy-last-queue-context',
  playerEnabled: 'speasy-player-enabled',
} as const;
