# Animation Performance Audit Checklist

**Purpose**: Guide for auditing animation performance using Chrome DevTools
**Target**: 60 FPS (16.67ms per frame) on desktop, 30+ FPS on mobile
**Last Updated**: 2026-01-19

---

## 🚀 Pre-Audit Setup

### 1. Enable Performance Monitoring
```bash
# Start development server
pnpm run dev

# Open Chrome DevTools
# Mac: Cmd + Option + I
# Windows/Linux: F12 or Ctrl + Shift + I
```

### 2. Configure DevTools Settings
- [ ] Open DevTools Settings (F1 or ⚙️ icon)
- [ ] Enable "Show frame rendering stats" under Rendering panel
- [ ] Enable "Paint flashing" to see repaints
- [ ] Enable "Layout Shift Regions" to detect layout instability
- [ ] Throttle CPU (4x slowdown) to simulate lower-end devices
- [ ] Throttle Network to "Fast 3G" for realistic conditions

---

## 📊 Performance Recording Checklist

### A. Initial Page Load Performance
```
Test Page: Homepage (/)
```

- [ ] Open Performance tab in DevTools
- [ ] Click Record button (●)
- [ ] Reload page (Cmd+R / Ctrl+R)
- [ ] Wait for page to fully load
- [ ] Stop recording

**Check for:**
- [ ] Total load time < 3 seconds
- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Time to Interactive (TTI) < 3.8s
- [ ] No long tasks > 50ms during initial animations
- [ ] No layout shifts (CLS < 0.1)

### B. Scroll Performance
```
Test Page: Homepage with multiple content cards
```

- [ ] Start Performance recording
- [ ] Scroll smoothly from top to bottom
- [ ] Scroll back up to top
- [ ] Stop recording after 10 seconds

**Check for:**
- [ ] Frame rate stays at 60 FPS during scroll
- [ ] No dropped frames in Timeline
- [ ] `whileInView` animations don't block scroll
- [ ] No forced reflows during scroll (check for yellow triangles)
- [ ] Scroll progress indicator doesn't cause jank

### C. Framer Motion Interaction Performance
```
Test Pages: All pages with interactive elements
```

- [ ] Start Performance recording
- [ ] Hover over content cards
- [ ] Click play buttons on audio content
- [ ] Open and close full audio player
- [ ] Interact with mini player
- [ ] Stop recording

**Check for:**
- [ ] All animations complete within 16.67ms (1 frame)
- [ ] No purple "Rendering" bars > 16ms
- [ ] No red "Scripting" bars during animations
- [ ] `whileHover` animations are instant (< 5ms response)
- [ ] `whileTap` animations feel responsive
- [ ] Drag gestures are smooth (60 FPS)

### D. Page Transition Performance
```
Test: Navigation between pages
```

- [ ] Start Performance recording
- [ ] Navigate from Home → Blog
- [ ] Navigate from Blog → Content detail
- [ ] Navigate from Content → Dashboard
- [ ] Stop recording

**Check for:**
- [ ] Route transition animations complete in < 300ms
- [ ] No layout shifts during transitions
- [ ] No flash of unstyled content (FOUC)
- [ ] Exit animations don't block navigation

### E. Audio Player Performance
```
Test: Audio playback and player interactions
```

- [ ] Start Performance recording
- [ ] Open full audio player
- [ ] Play/pause audio multiple times
- [ ] Seek to different positions
- [ ] Drag player down to dismiss
- [ ] Stop recording

**Check for:**
- [ ] Audio waveform animation stays at 60 FPS
- [ ] Canvas rendering doesn't cause main thread blocking
- [ ] Progress bar updates smoothly (no jank)
- [ ] Drag gesture is smooth and responsive
- [ ] Player animations don't interfere with audio playback

---

## 🔍 Memory Profiling

### 1. Heap Snapshot Analysis
- [ ] Open Memory tab in DevTools
- [ ] Take Heap Snapshot before interactions
- [ ] Interact with animations (open/close players, navigate pages)
- [ ] Take another Heap Snapshot
- [ ] Compare snapshots

**Check for:**
- [ ] Memory increase < 5MB for typical interactions
- [ ] No detached DOM nodes from AnimatePresence
- [ ] No memory leaks from event listeners
- [ ] Framer Motion instances are properly cleaned up

### 2. Allocation Timeline
- [ ] Start Allocation instrumentation
- [ ] Interact with animated components for 30 seconds
- [ ] Stop recording

**Check for:**
- [ ] No continuous memory growth (sawtooth pattern is OK)
- [ ] Memory stabilizes after interactions stop
- [ ] No allocation spikes > 1MB during animations

---

## 🎨 Rendering Performance

### 1. Paint Flashing Analysis
- [ ] Enable "Paint flashing" in Rendering panel
- [ ] Interact with animated elements

**Check for:**
- [ ] Only animated elements flash green
- [ ] No unnecessary repaints of static elements
- [ ] Image transforms don't cause repaints
- [ ] Text doesn't repaint during opacity animations

### 2. Layer Border Visualization
- [ ] Enable "Layer borders" in Rendering panel
- [ ] Inspect animated elements

**Check for:**
- [ ] Motion.div elements are promoted to own layers (orange borders)
- [ ] No excessive layer creation (< 20 layers total)
- [ ] Transform and opacity animations stay on compositor thread

### 3. Layout Shift Detection
- [ ] Enable "Layout Shift Regions" in Rendering panel
- [ ] Navigate through all pages
- [ ] Load content cards

**Check for:**
- [ ] No blue flash during animations
- [ ] Images have proper width/height attributes
- [ ] Skeleton loaders match actual content dimensions
- [ ] No CLS from dynamic content loading

---

## 📱 Mobile Performance Testing

### 1. Responsive Design Mode
- [ ] Toggle Device Toolbar (Cmd+Shift+M / Ctrl+Shift+M)
- [ ] Select "iPhone 12 Pro"
- [ ] Throttle CPU to 4x slowdown
- [ ] Throttle Network to "Slow 3G"

**Re-run all tests above with mobile settings**

### 2. Touch Interaction Testing
- [ ] Switch to touch emulation mode
- [ ] Test all `whileTap` interactions
- [ ] Test swipe gestures (full player dismiss)
- [ ] Test scroll performance

**Check for:**
- [ ] Touch targets are min 44x44px
- [ ] Tap delays are minimized (< 100ms)
- [ ] No scroll jank during touch scrolling
- [ ] Gestures work smoothly on mobile

---

## ⚡ Bundle Size Analysis

### 1. Check Framer Motion Bundle Impact
```bash
# Build production bundle
pnpm run build

# Analyze bundle with built-in analyzer
ANALYZE=true pnpm run build-stats
```

**Check for:**
- [ ] Framer Motion total size < 70KB (gzipped)
- [ ] No duplicate Framer Motion imports
- [ ] Motion components are code-split where appropriate
- [ ] Unused Framer Motion features are tree-shaken

### 2. Lighthouse Performance Audit
```bash
# Run Lighthouse audit
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:3000
```

**Target Scores:**
- [ ] Performance: > 90
- [ ] First Contentful Paint: < 1.8s
- [ ] Speed Index: < 3.4s
- [ ] Largest Contentful Paint: < 2.5s
- [ ] Time to Interactive: < 3.8s
- [ ] Total Blocking Time: < 200ms
- [ ] Cumulative Layout Shift: < 0.1

---

## 🐛 Common Performance Issues

### Issue Checklist
- [ ] **Long Tasks**: Check for tasks > 50ms blocking main thread
- [ ] **Forced Reflow**: Look for "Recalculate Style" during animations
- [ ] **Memory Leaks**: Detached DOM nodes not garbage collected
- [ ] **Excessive Repaints**: Non-transform/opacity properties animating
- [ ] **Render Blocking**: Large initial JavaScript bundle
- [ ] **Scroll Jank**: Event listeners without throttling
- [ ] **Layout Thrashing**: Reading layout properties during animation loop

---

## ✅ Performance Optimization Verification

After implementing Phase 1-3 optimizations, verify:

### Phase 1 Fixes (Completed)
- [x] Reduced motion support doesn't impact performance
- [x] `useScroll` hook eliminates scroll listener overhead
- [x] Removed unused `tw-animate-css` reduces bundle size

### Phase 2 Improvements (Completed)
- [x] Skeleton loaders don't cause layout shifts
- [x] Page transitions complete smoothly
- [x] Exit animations don't block navigation
- [x] Centralized motion config doesn't increase bundle size

### Phase 3 Polish (In Progress)
- [x] CSS transitions target specific properties
- [x] Haptic feedback doesn't cause jank
- [ ] All animations pass 60 FPS threshold
- [ ] No performance regressions from motion system

---

## 📝 Audit Report Template

### Performance Metrics
```
Date: [Date]
Browser: Chrome [Version]
Device: [Desktop/Mobile]
CPU Throttling: [4x/None]
Network: [Fast 3G/None]

Homepage Load:
- FCP: [X.XX]s
- LCP: [X.XX]s
- TTI: [X.XX]s
- CLS: [0.XX]
- TBT: [XXX]ms

Scroll Performance:
- Average FPS: [XX]
- Dropped Frames: [X]%
- Longest Task: [XX]ms

Animation Performance:
- Hover Response: [X]ms
- Click Response: [X]ms
- Transition Duration: [XXX]ms
- Frame Rate: [XX] FPS

Memory Usage:
- Initial: [XX] MB
- After Interactions: [XX] MB
- Increase: [+X] MB
- Detached Nodes: [X]

Bundle Size:
- Framer Motion: [XX] KB (gzipped)
- Total JS: [XXX] KB (gzipped)
- Unused Code: [X]%
```

### Issues Found
```
1. [Issue Description]
   - Severity: High/Medium/Low
   - Location: [Component/Page]
   - Impact: [Performance impact]
   - Recommendation: [Fix suggestion]

2. [Issue Description]
   ...
```

---

## 🎯 Performance Targets

### Desktop (Modern Laptop)
- Frame Rate: 60 FPS (16.67ms per frame)
- Page Load: < 2 seconds
- Time to Interactive: < 3 seconds
- Animation Response: < 100ms
- Memory Growth: < 10MB per session

### Mobile (Mid-range Phone)
- Frame Rate: 30+ FPS (33ms per frame)
- Page Load: < 4 seconds
- Time to Interactive: < 5 seconds
- Animation Response: < 150ms
- Memory Growth: < 5MB per session

### Network Conditions
- Fast 3G: LCP < 4 seconds
- Slow 3G: LCP < 6 seconds
- Offline: Service worker cache hit < 500ms

---

## 📚 Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Framer Motion Performance](https://www.framer.com/motion/guide-upgrade/#performance)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [RAIL Performance Model](https://web.dev/rail/)
- [Core Web Vitals](https://web.dev/vitals/)

---

**Next Steps**: Run through this checklist after each phase completion to ensure no performance regressions.
