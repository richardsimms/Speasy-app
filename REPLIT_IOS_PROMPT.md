# Replit iOS App Development Prompt: Speasy Audio Content Platform

## Project Overview

Build a native iOS application for **Speasy** - an audio content platform that transforms articles and written content into podcast-style audio experiences. The iOS app should replicate the web application's core functionality while leveraging native iOS capabilities for an optimal mobile experience.

## Core Purpose

Speasy helps users consume their reading list through audio. Users discover curated content across various categories, listen to AI-generated audio versions of articles, and track their listening progress. The app reduces screen time while keeping users informed and engaged with quality content.

---

## Technical Stack Requirements

### iOS Development
- **Language**: Swift 5.9+ or SwiftUI
- **Minimum iOS Version**: iOS 16.0+
- **Architecture**: MVVM or Clean Architecture with SwiftUI
- **Package Manager**: Swift Package Manager (SPM)

### Backend Integration
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (email/password, OAuth providers)
- **Storage**: Supabase Storage for audio files
- **Real-time**: Supabase Realtime for live updates (optional)

### Key Dependencies
```swift
// Recommended Swift Packages:
- Supabase Swift SDK (https://github.com/supabase/supabase-swift)
- Kingfisher (image loading and caching)
- SwiftUI native components
- AVFoundation (audio playback)
```

---

## Database Schema (Supabase)

### Content Items Table: `content_items`
```sql
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  image_url TEXT,
  url TEXT,
  source_name TEXT,
  source_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'done', 'failed'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Audio Files Table: `audio_files`
```sql
CREATE TABLE audio_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  duration INTEGER, -- duration in seconds
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Categories Table: `categories`
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Content Item Tags Table: `content_item_tags`
```sql
CREATE TABLE content_item_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(content_item_id, category_id)
);
```

### Content Sources Table: `content_sources`
```sql
CREATE TABLE content_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT,
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Users Table: `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscription_status TEXT,
  subscription_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Listening History Table: `listening_history` (New - iOS specific)
```sql
CREATE TABLE listening_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0, -- current playback position in seconds
  duration INTEGER, -- total duration
  completed BOOLEAN DEFAULT false,
  last_played_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, content_item_id)
);
```

---

## Core Features & Requirements

### 1. Authentication & Onboarding

#### Sign Up / Sign In
- Email/password authentication via Supabase Auth
- Optional OAuth providers (Apple, Google)
- Seamless onboarding flow with app introduction
- Password reset functionality

```swift
// Example Supabase Auth integration
Task {
  do {
    let session = try await supabase.auth.signIn(
      email: email,
      password: password
    )
    // Handle successful sign in
  } catch {
    // Handle error
  }
}
```

### 2. Discover Screen (Home)

#### Content Discovery
- **Grid/List View**: Display content items grouped by category
- **Category Headers**: Clear section headers for each category
- **Content Cards**: Show for each item:
  - Title
  - Summary (truncated)
  - Category badge
  - Duration indicator
  - Cover image (with placeholder fallback)
  - Play button overlay

#### Supabase Query
```swift
// Fetch content items with audio files and categories
let response = try await supabase
  .from("content_items")
  .select("""
    id,
    title,
    summary,
    image_url,
    created_at,
    status,
    content_item_tags(
      categories(name)
    ),
    audio_files!inner(
      file_url,
      duration
    )
  """)
  .eq("status", value: "done")
  .order("created_at", ascending: false)
  .limit(50)
  .execute()
```

#### UI Components
- Pull-to-refresh for new content
- Infinite scroll or pagination
- Category filter/sort options
- Search functionality (optional Phase 2)
- Smooth animations and transitions

### 3. Content Detail Screen

#### Layout
- **Header Section**:
  - Large cover image (full width)
  - Title (serif font, large and readable)
  - Metadata row: Date published, duration, source link
  - Category badge

- **Content Section**:
  - Summary card (background with subtle border)
  - Full content/transcript (collapsible)
  - "View Original Article" button (opens Safari)

- **Audio Player** (Fixed bottom):
  - Play/Pause button (prominent, centered)
  - Progress bar (seekable)
  - Current time / Total duration
  - Skip forward/backward 15 seconds
  - Playback speed control (0.75x, 1x, 1.25x, 1.5x, 2x)

#### Audio Playback
```swift
// AVPlayer integration for audio playback
import AVFoundation

class AudioPlayerManager: ObservableObject {
  @Published var isPlaying = false
  @Published var currentTime: TimeInterval = 0
  @Published var duration: TimeInterval = 0

  private var player: AVPlayer?
  private var timeObserver: Any?

  func loadAudio(url: URL) {
    let playerItem = AVPlayerItem(url: url)
    player = AVPlayer(playerItem: playerItem)

    // Add periodic time observer
    let interval = CMTime(seconds: 0.5, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
    timeObserver = player?.addPeriodicTimeObserver(forInterval: interval, queue: .main) { [weak self] time in
      self?.currentTime = time.seconds
    }

    // Observe duration
    player?.currentItem?.observe(\.duration) { [weak self] item, _ in
      self?.duration = item.duration.seconds
    }
  }

  func play() {
    player?.play()
    isPlaying = true
  }

  func pause() {
    player?.pause()
    isPlaying = false
  }

  func seek(to time: TimeInterval) {
    let cmTime = CMTime(seconds: time, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
    player?.seek(to: cmTime)
  }
}
```

#### Background Audio
- Continue playing when app is backgrounded
- Lock screen controls (Now Playing info)
- AirPods/CarPlay integration
- Remote control events

```swift
// Configure audio session for background playback
import AVFoundation

func configureAudioSession() {
  do {
    let audioSession = AVAudioSession.sharedInstance()
    try audioSession.setCategory(.playback, mode: .spokenAudio)
    try audioSession.setActive(true)
  } catch {
    print("Failed to configure audio session: \(error)")
  }
}

// Set Now Playing info
func updateNowPlayingInfo(title: String, duration: TimeInterval) {
  var nowPlayingInfo = [String: Any]()
  nowPlayingInfo[MPMediaItemPropertyTitle] = title
  nowPlayingInfo[MPMediaItemPropertyPlaybackDuration] = duration
  nowPlayingInfo[MPNowPlayingInfoPropertyElapsedPlaybackTime] = currentTime

  MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
}
```

### 4. Mini Player (Global)

When navigating away from detail screen while audio is playing:
- Persistent mini player at bottom of screen
- Shows: thumbnail, title, play/pause button
- Tap to expand to full detail screen
- Swipe down to dismiss (pause audio)

### 5. Profile / Settings Screen

#### User Settings
- Account information (email, subscription status)
- Playback preferences:
  - Default playback speed
  - Auto-play next episode
  - Download quality (cellular data settings)
- Appearance: Light/Dark/System theme
- Notifications preferences
- About & Help
- Sign out

#### Subscription Integration (Optional)
- Show subscription status
- Link to subscription management
- Free tier vs Premium tier features

### 6. Offline Downloads (Optional - Phase 2)

- Download audio files for offline listening
- Download manager with progress indicators
- Storage management
- Auto-delete completed episodes

---

## Design System

### Color Palette
```swift
// Dark mode primary (matches web app)
extension Color {
  static let speasyBackground = Color(hex: "0A0A0A")
  static let speasyCard = Color.white.opacity(0.05)
  static let speasyBorder = Color.white.opacity(0.1)
  static let speasyText = Color.white
  static let speasyTextSecondary = Color.white.opacity(0.7)
  static let speasyTextMuted = Color.white.opacity(0.6)
  static let speasyAccent = Color(hex: "3B82F6") // Blue
  static let speasyAccentSecondary = Color(hex: "A855F7") // Purple
}
```

### Typography
```swift
// Serif for titles, Sans-serif for body
extension Font {
  static let speasyTitle = Font.system(.largeTitle, design: .serif, weight: .bold)
  static let speasyHeadline = Font.system(.title2, design: .serif, weight: .semibold)
  static let speasyBody = Font.system(.body, design: .default, weight: .regular)
  static let speasyCaption = Font.system(.caption, design: .default, weight: .regular)
}
```

### Component Styles
- Rounded corners: 16pt (cards), 12pt (buttons)
- Card backgrounds: White 5% opacity over dark background
- Borders: White 10% opacity
- Shadows: Subtle, consistent depth
- Animations: Smooth, native iOS feel (spring animations)

---

## Data Flow & State Management

### Recommended Architecture
```
View (SwiftUI)
  ↓
ViewModel (ObservableObject)
  ↓
Repository Layer
  ↓
Supabase Client
```

### Example ViewModel
```swift
@MainActor
class DiscoverViewModel: ObservableObject {
  @Published var categories: [ContentCategory] = []
  @Published var isLoading = false
  @Published var errorMessage: String?

  private let repository: ContentRepository

  init(repository: ContentRepository) {
    self.repository = repository
  }

  func fetchContent() async {
    isLoading = true
    defer { isLoading = false }

    do {
      let items = try await repository.fetchContentItems()
      categories = groupByCategory(items)
    } catch {
      errorMessage = "Failed to load content: \(error.localizedDescription)"
    }
  }

  private func groupByCategory(_ items: [ContentItem]) -> [ContentCategory] {
    // Group items by category
    let grouped = Dictionary(grouping: items) { $0.category }
    return grouped.map { ContentCategory(name: $0.key, items: $0.value) }
      .sorted { $0.name < $1.name }
  }
}
```

### Example Repository
```swift
protocol ContentRepository {
  func fetchContentItems() async throws -> [ContentItem]
  func fetchContentDetail(id: UUID) async throws -> ContentItem
}

class SupabaseContentRepository: ContentRepository {
  private let supabase: SupabaseClient

  init(supabase: SupabaseClient) {
    self.supabase = supabase
  }

  func fetchContentItems() async throws -> [ContentItem] {
    let response: [ContentItemDTO] = try await supabase
      .from("content_items")
      .select("""
        id,
        title,
        summary,
        image_url,
        created_at,
        content_item_tags(categories(name)),
        audio_files!inner(file_url, duration)
      """)
      .eq("status", value: "done")
      .order("created_at", ascending: false)
      .limit(50)
      .execute()
      .value

    return response.map { $0.toContentItem() }
  }
}
```

---

## Models / Data Types

```swift
struct ContentItem: Identifiable, Codable {
  let id: UUID
  let title: String
  let summary: String?
  let content: String?
  let imageUrl: String?
  let category: String
  let audioUrl: String?
  let duration: Int? // seconds
  let sourceUrl: String?
  let sourceName: String?
  let sourceLink: String?
  let createdAt: Date
}

struct ContentCategory: Identifiable {
  let id = UUID()
  let name: String
  let items: [ContentItem]
}

struct User: Identifiable, Codable {
  let id: UUID
  let email: String
  let subscriptionStatus: String?
  let subscriptionEndDate: Date?
}

struct ListeningProgress: Codable {
  let contentItemId: UUID
  let progress: Int // seconds
  let duration: Int // seconds
  let completed: Bool
  let lastPlayedAt: Date

  var progressPercentage: Double {
    guard duration > 0 else { return 0 }
    return Double(progress) / Double(duration)
  }
}
```

---

## Supabase Integration Setup

### 1. Initialize Supabase Client
```swift
import Supabase

let supabaseURL = URL(string: "https://your-project.supabase.co")!
let supabaseKey = "your-anon-key"

let supabase = SupabaseClient(
  supabaseURL: supabaseURL,
  supabaseKey: supabaseKey
)
```

### 2. Authentication Flow
```swift
// Sign up
try await supabase.auth.signUp(email: email, password: password)

// Sign in
let session = try await supabase.auth.signIn(email: email, password: password)

// Get current user
let user = try await supabase.auth.user()

// Sign out
try await supabase.auth.signOut()

// Listen to auth state changes
for await state in supabase.auth.authStateChanges {
  switch state {
  case .signedIn(let session):
    print("User signed in: \(session.user.email)")
  case .signedOut:
    print("User signed out")
  }
}
```

### 3. Content Queries
```swift
// Fetch content with relationships
let response: [ContentItemDTO] = try await supabase
  .from("content_items")
  .select("""
    *,
    audio_files(*),
    content_item_tags(categories(*))
  """)
  .eq("status", value: "done")
  .execute()
  .value

// Fetch single item by ID
let item: ContentItemDTO = try await supabase
  .from("content_items")
  .select("*")
  .eq("id", value: itemId)
  .single()
  .execute()
  .value
```

### 4. Progress Tracking
```swift
// Save listening progress
struct ProgressUpdate: Encodable {
  let userId: UUID
  let contentItemId: UUID
  let progress: Int
  let duration: Int
  let completed: Bool
  let lastPlayedAt: Date
}

try await supabase
  .from("listening_history")
  .upsert(progressUpdate)
  .execute()

// Fetch user's listening history
let history: [ListeningProgress] = try await supabase
  .from("listening_history")
  .select("*")
  .eq("user_id", value: userId)
  .order("last_played_at", ascending: false)
  .execute()
  .value
```

---

## Analytics & Tracking (Optional)

### Events to Track
```swift
enum AnalyticsEvent {
  case contentPlayStarted(contentId: UUID, contentName: String, category: String)
  case contentPlayCompleted(contentId: UUID, contentName: String, category: String)
  case contentShared(contentId: UUID, platform: String)
  case searchPerformed(query: String, resultCount: Int)
  case categoryFiltered(category: String)
}
```

### Implementation Options
- Use Supabase built-in Analytics
- Integrate PostHog iOS SDK
- Use Firebase Analytics
- Custom event logging to Supabase table

---

## Error Handling & Edge Cases

### Network Errors
- Show user-friendly error messages
- Implement retry logic with exponential backoff
- Cache content for offline viewing
- Handle no internet connection gracefully

### Audio Playback Errors
- Handle invalid audio URLs
- Show loading states during buffering
- Handle interruptions (phone calls, other audio)
- Resume playback after interruption

### Empty States
- No content available
- No search results
- No listening history
- Network unavailable

---

## Performance Optimization

### Image Loading
```swift
// Use Kingfisher for efficient image loading
import Kingfisher

KFImage(URL(string: imageUrl))
  .placeholder { ProgressView() }
  .resizable()
  .aspectRatio(contentMode: .fill)
  .frame(width: 200, height: 200)
  .clipped()
```

### Pagination
- Load 20-50 items initially
- Implement infinite scroll
- Prefetch next page when user reaches 75% of current list

### Audio Caching
- Cache downloaded audio files
- Implement LRU cache eviction
- Respect iOS storage limitations

---

## Testing Requirements

### Unit Tests
- ViewModel logic
- Repository layer
- Data transformations
- Utility functions

### UI Tests
- Authentication flow
- Content discovery navigation
- Audio playback controls
- Search functionality

### Manual Testing Checklist
- [ ] Sign up and sign in work correctly
- [ ] Content loads and displays properly
- [ ] Audio plays without interruption
- [ ] Background playback works
- [ ] Lock screen controls function
- [ ] Progress is saved and restored
- [ ] Offline mode works (if implemented)
- [ ] App handles poor network gracefully
- [ ] Dark mode displays correctly
- [ ] Accessibility features work (VoiceOver)

---

## Deployment & Distribution

### App Store Requirements
- **App Name**: Speasy - Audio Content Player
- **Category**: News & Magazines / Productivity
- **Privacy Policy**: Required (link to web version)
- **Age Rating**: 4+ (no objectionable content)
- **App Icon**: High-quality 1024x1024px icon
- **Screenshots**: 6.7", 6.5", and 5.5" iPhone sizes

### TestFlight Beta
- Distribute to beta testers before public release
- Collect feedback and iterate
- Test on multiple iOS devices and versions

---

## Phase 1 MVP Scope

**Core Features for Initial Release:**
1. ✅ Authentication (email/password + Apple Sign In)
2. ✅ Discover screen with categorized content
3. ✅ Content detail screen with full article
4. ✅ Audio playback with basic controls
5. ✅ Background playback with lock screen controls
6. ✅ Mini player for global playback
7. ✅ User profile and settings
8. ✅ Dark mode support

**Deferred to Phase 2:**
- Offline downloads
- Search functionality
- Push notifications for new content
- Social sharing
- Bookmarks/Favorites
- Playback history syncing

---

## Environment Variables

Create a `Config.swift` file:
```swift
enum Config {
  static let supabaseURL = "https://your-project.supabase.co"
  static let supabaseAnonKey = "your-anon-key"

  #if DEBUG
  static let isDebug = true
  #else
  static let isDebug = false
  #endif
}
```

---

## Success Criteria

### Functionality
- ✅ Users can authenticate and access content
- ✅ Content loads within 2 seconds on 4G connection
- ✅ Audio plays smoothly without buffering (after initial load)
- ✅ Background playback works reliably
- ✅ Progress is saved and synced across sessions

### User Experience
- ✅ Intuitive navigation, no onboarding needed
- ✅ Smooth animations and transitions
- ✅ Accessible to VoiceOver users
- ✅ Follows iOS Human Interface Guidelines
- ✅ Consistent with web app branding

### Technical
- ✅ No crashes or memory leaks
- ✅ Handles edge cases gracefully
- ✅ Follows Swift best practices
- ✅ Code is well-documented
- ✅ 80%+ test coverage on critical paths

---

## Resources & References

### Supabase Documentation
- [Supabase Swift Client](https://github.com/supabase/supabase-swift)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Database Guide](https://supabase.com/docs/guides/database)

### iOS Development
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [AVFoundation Programming Guide](https://developer.apple.com/av-foundation/)
- [Background Execution](https://developer.apple.com/documentation/avfoundation/media_playback/creating_a_basic_video_player_ios_and_tvos/playing_audio_from_a_video_asset_in_the_background)

### Design Inspiration
- Apple Podcasts app
- Overcast
- Pocket Casts
- Audible

---

## Next Steps for Replit AI

1. **Setup Project Structure**
   - Create new iOS project in Xcode
   - Configure Swift Package Manager
   - Add Supabase dependency

2. **Implement Authentication**
   - Create sign in/sign up views
   - Integrate Supabase Auth
   - Handle auth state

3. **Build Discover Screen**
   - Fetch content from Supabase
   - Display in categorized grid
   - Implement navigation to detail

4. **Implement Audio Player**
   - Create audio player manager
   - Build player UI
   - Add background playback support

5. **Polish & Test**
   - Add error handling
   - Implement loading states
   - Write unit tests
   - Conduct user testing

---

## Questions to Clarify

Before starting development, please confirm:

1. **Authentication**: Should we use Supabase Auth exclusively, or also support Clerk iOS SDK to match the web app?
2. **Content Management**: Will content be added via web admin panel, or do we need iOS content creation?
3. **Subscription Model**: Is Stripe integration needed for in-app purchases, or is this handled via web?
4. **Push Notifications**: Are push notifications required for new content alerts in MVP?
5. **Analytics**: Which analytics platform should be integrated (PostHog, Firebase, Supabase Analytics)?

---

## Summary

This iOS app replicates the core Speasy web experience with native iOS optimizations. Focus on audio playback quality, smooth animations, and intuitive navigation. Use Supabase as the single source of truth for content, authentication, and user data. Start with Phase 1 MVP features and iterate based on user feedback.

**Good luck building the iOS version of Speasy! 🎧📱**
