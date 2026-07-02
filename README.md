# Wobb Frontend Assignment — Influencer Discovery Platform

> A modern, production-grade influencer discovery and curation app built with **React 19**, **TypeScript 6**, **Vite 8**, **Tailwind CSS v4**, and **Zustand 5**. Completely redesigned from the starter scaffold with 12 bug fixes, full state management, WebGL fluid simulation background, performance optimizations, 19 unit tests, CI pipeline, and a premium glassmorphic UI.

<!-- If deployed, paste live URL here:
🔗 **Live Demo:** [https://your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)
-->

---

## Table of Contents

- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Bugs Found & Fixed](#-bugs-found--fixed)
- [Features Implemented](#-features-implemented)
- [State Management (Zustand)](#-state-management-zustand)
- [Data Flow](#-data-flow)
- [UI/UX Design](#-uiux-design)
- [Performance Optimizations](#-performance-optimizations)
- [Type System](#-type-system)
- [Testing](#-testing)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Libraries Added](#-libraries-added)
- [Assumptions & Trade-offs](#-assumptions--trade-offs)
- [Available Scripts](#-available-scripts)
- [Component Reference](#-component-reference)
- [What I'd Do With More Time](#-what-id-do-with-more-time)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

```bash
# Run tests
npm run test

# Lint the codebase
npm run lint

# Production build
npm run build
```

---

## 🧱 Tech Stack

| Layer              | Technology                                                         |
| ------------------ | ------------------------------------------------------------------ |
| **Framework**      | React 19.2 with TypeScript 6.0                                    |
| **Build Tool**     | Vite 8                                                             |
| **Styling**        | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) + custom CSS      |
| **State Mgmt**     | Zustand 5 with `persist` middleware (localStorage)                 |
| **Routing**        | React Router DOM v7                                                |
| **Drag & Drop**    | `@hello-pangea/dnd` (maintained fork of `react-beautiful-dnd`)     |
| **Animations**     | Framer Motion 12 (page transitions, stagger, spring physics)       |
| **3D Background**  | Three.js 0.185 (custom WebGL Navier-Stokes fluid simulation)      |
| **Icons**          | Lucide React (tree-shakeable)                                      |
| **Notifications**  | React Hot Toast                                                    |
| **Testing**        | Vitest 4 + React Testing Library + jest-dom                        |
| **CI**             | GitHub Actions (lint → build → test)                               |

---

## 🏗 Architecture Overview

```
┌───────────────────────────────────────────────────────────┐
│                       main.tsx                            │
│             StrictMode + BrowserRouter + Toaster          │
└───────────────────────────┬───────────────────────────────┘
                            │
                       ┌────▼────┐
                       │ App.tsx │  ← Route definitions + lazy loading
                       └────┬────┘
                            │
                 ┌──────────▼──────────┐
                 │     Layout.tsx      │  ← Navbar + LiquidEther BG + Footer
                 │   ┌─────────────┐  │
                 │   │ ListDrawer  │  │  ← Slide-over saved-list panel
                 │   └─────────────┘  │
                 └──────────┬─────────┘
                            │
            ┌───────────────┼────────────────┐
            │               │                │
       ┌────▼─────┐  ┌──────▼────────┐  ┌────▼────┐
       │  Search  │  │ ProfileDetail │  │  404    │
       │   Page   │  │     Page      │  │  Page   │
       └────┬─────┘  └───────────────┘  └─────────┘
            │
   ┌────────┼───────────────┐
   │        │               │
┌──▼───┐ ┌──▼──────────┐ ┌──▼──────────┐
│ Hero │ │PlatformFilter│ │ Spotlight   │
│Panel │ │(tabs+search) │ │ Sidebar     │
└──────┘ └──────────────┘ │ (top 3)     │
                          └─────────────┘
            │
       ┌────▼──────────┐
       │  ProfileList  │  ← Responsive grid + empty state
       └────┬──────────┘
            │
       ┌────▼──────────┐
       │ ProfileCard[] │  ← React.memo'd cards
       │   └─ VerifiedBadge
       └───────────────┘
```

### Routing Strategy

| Route                  | Component            | Loading Strategy                   |
| ---------------------- | -------------------- | ---------------------------------- |
| `/`                    | `SearchPage`         | Eager                              |
| `/profile/:username`   | `ProfileDetailPage`  | Lazy (`React.lazy` + `Suspense`)   |
| `*`                    | `NotFoundPage`       | Eager (inline in `App.tsx`)        |

- `ProfileDetailPage` is code-split via `React.lazy()` with a named-export remap pattern: `.then(mod => ({ default: mod.ProfileDetailPage }))`
- Suspense fallback renders `<Layout><ProfileDetailSkeleton /></Layout>` for a seamless loading experience
- The styled catch-all 404 route uses a `SearchX` icon from lucide-react

---

## 📁 Project Structure

```
src/
├── __tests__/                        # Unit tests (2 suites, 19 tests)
│   ├── useListStore.test.ts          #   Store CRUD, dedup, reorder, timestamps (8 tests)
│   └── searchAndFormatters.test.ts   #   Filter regression + formatter tests (11 tests)
│
├── assets/
│   ├── data/
│   │   ├── search/                   # Platform search result JSON files
│   │   │   ├── instagram.json        #   ~8KB — Instagram profiles
│   │   │   ├── youtube.json          #   ~9KB — YouTube profiles
│   │   │   └── tiktok.json           #   ~10KB — TikTok profiles
│   │   └── profiles/                 # Individual profile detail JSON files
│   │       ├── cristiano.json        #   257KB — Cristiano Ronaldo
│   │       ├── instagram.json        #   196KB — Instagram official
│   │       ├── khaby.lame.json       #   182KB — Khaby Lame
│   │       ├── mrbeast.json          #   190KB — MrBeast (Instagram)
│   │       ├── MrBeast6000.json      #   240KB — MrBeast (YouTube)
│   │       └── tseries.json          #   325KB — T-Series
│   ├── hero.png
│   └── react.svg, vite.svg
│
├── components/
│   ├── GlareHover.tsx / .css         # CSS-only cursor-tracking glare hover effect
│   ├── Layout.tsx                    # App shell: sticky navbar + AnimatePresence + footer
│   ├── LiquidEther.tsx / .css        # WebGL Navier-Stokes fluid sim (Three.js, 1170 lines)
│   ├── ListDrawer.tsx                # Slide-over drawer with DnD + CSV/JSON export
│   ├── PlatformFilter.tsx            # Segmented control tabs + search input
│   ├── ProfileCard.tsx               # Individual profile card (React.memo)
│   ├── ProfileList.tsx               # Responsive card grid + empty state
│   ├── Skeleton.tsx                  # Shimmer skeletons (card + detail variants)
│   └── VerifiedBadge.tsx             # Mint-green verified checkmark circle
│
├── hooks/
│   └── useDebounce.ts                # Generic debounce hook (setTimeout/clearTimeout)
│
├── pages/
│   ├── SearchPage.tsx                # Discovery page: hero, filters, stats, grid, spotlight
│   └── ProfileDetailPage.tsx         # Profile detail: hero, dynamic stats, async loading
│
├── store/
│   └── useListStore.ts               # Zustand store + persist middleware
│
├── types/
│   └── index.ts                      # All TypeScript interfaces (6 types)
│
├── utils/
│   ├── dataHelpers.ts                # extractProfiles() + filterProfiles() + PLATFORMS
│   ├── formatters.ts                 # formatFollowers() + formatEngagementRate()
│   └── profileLoader.ts             # import.meta.glob dynamic profile JSON loader
│
├── App.tsx                           # Route config + lazy loading + 404 page
├── main.tsx                          # Entry point (StrictMode + BrowserRouter + Toaster)
├── index.css                         # Global styles: design tokens + glass system (626 lines)
└── vite-env.d.ts                     # Vite type declarations
```

---

## 🐛 Bugs Found & Fixed

Twelve bugs were identified and fixed in the original starter code:

| #  | Severity     | Bug                                                    | Root Cause                                                                        | Fix Applied                                                                                       |
| -- | ------------ | ------------------------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1  | 🔴 Critical  | **`npm install` fails**                                | `react-beautiful-dnd@13.1.1` requires React ≤18; project uses React 19            | Replaced with `@hello-pangea/dnd` (maintained fork, identical API, React 19 compatible)           |
| 2  | 🟡 Medium    | **Case-sensitive username search**                     | Raw string comparison — searching "MR" wouldn't match `mrbeast`                   | Added `.toLowerCase()` to both sides in `filterProfiles()` (`dataHelpers.ts`)                     |
| 3  | 🟡 Medium    | **Engagement rate off by 100×**                        | Inline calculation used `rate * 10000` instead of `rate * 100`                    | Replaced with shared `formatEngagementRate()` from `formatters.ts`                                |
| 4  | 🟡 Medium    | **"Engagements" card shows rate, not count**           | Displayed `formatEngagementRate()` instead of actual engagements value              | Now displays real engagements count using `formatFollowers()`                                     |
| 5  | 🟢 Low       | **Duplicate follower formatters**                      | `formatFollowersLocal()` and `formatFollowersDetail()` reinvented the wheel       | Deleted duplicates; single shared `formatFollowers()` imported everywhere                          |
| 6  | 🟢 Low       | **Dead `SearchBar.tsx` component**                     | Fully built component never imported or rendered anywhere                         | Deleted; `PlatformFilter` already includes a search input                                         |
| 7  | 🟢 Low       | **Missing alt text on all `<img>` tags**               | Accessibility violation — screen readers can't describe images                    | Added descriptive `alt` attributes to all images                                                  |
| 8  | 🟡 Medium    | **Hardcoded `w-[700px]`**                              | Fixed width breaks on mobile and tablet screens                                   | Replaced with responsive `w-full`                                                                 |
| 9  | 🟢 Low       | **Dead `clickCount` state**                            | `useState` + `console.log` doing nothing in production code                       | Removed entirely                                                                                  |
| 10 | 🟢 Low       | **Pointless `data-search` DOM attribute**              | Search query unnecessarily dumped on every card's DOM node                        | Removed                                                                                           |
| 11 | 🟡 Medium    | **No 404 route**                                       | Navigating to unknown paths showed a blank page                                   | Added catch-all `<Route path="*">` with styled `NotFoundPage`                                    |
| 12 | 🟡 Medium    | **No memoization**                                     | `extractProfiles` / `filterProfiles` recomputed on every render                   | Wrapped in `useMemo` with proper dependency arrays                                                |

---

## ✨ Features Implemented

### Core Features

#### 🔍 Influencer Search & Discovery
- Real-time search across all loaded influencer profiles
- **Debounced input** (250ms via custom `useDebounce` hook) to prevent excessive re-filtering
- **Case-insensitive matching** on `username`, `handle`, and `fullname` fields simultaneously
- Memoized filtering pipeline (5 `useMemo` instances in `SearchPage`)
- "Clear search" button appears when a query is active
- Platform change automatically resets the search query

#### 🏷 Platform Filtering
- **Segmented control** (tab-based) for Instagram, YouTube, TikTok with platform icons
- Uses proper ARIA roles: `role="tablist"` and `role="tab"` with `aria-selected`
- Combined with search query for compound filtering
- Responsive: collapses to grid layout on mobile (< 760px)

#### 📊 Live Statistics
- **Stats strip** on the search page showing:
  - **Total Reach** — sum of all followers across filtered profiles
  - **Profiles** — count of visible profiles
  - **Avg Engagement** — mean engagement rate across results
- All stats recomputed reactively via `useMemo` when filters change

#### 🌟 Spotlight Sidebar
- **Top 3 creators** displayed in a dedicated sidebar panel
- Selected from the current platform's profiles
- Quick glance at the highest-profile influencers

#### 📋 Add to List / Save Profiles
- **Add/Remove toggle** available on both `ProfileCard` and `ProfileDetailPage`
- **Duplicate prevention** — checks by `user_id` before adding
- Persisted to `localStorage` under key `"wobb-selected-profiles"` — survives page refreshes, tab closures, and browser restarts
- **Count badge** in the navbar showing number of saved profiles
- Each saved profile stores an `addedAt` timestamp

#### 📂 List Management Drawer
- **Slide-over drawer** from the right side (spring animation: damping 30, stiffness 300)
- **Backdrop overlay** with blur effect
- **Drag-to-reorder** saved profiles using `@hello-pangea/dnd`
  - `DragDropContext` → `Droppable` → `Draggable` for each item
  - Drag handle with `GripVertical` icon
- **Export as CSV** — proper CSV escaping via `csvEscape()` helper, triggers Blob download
- **Export as JSON** — formatted JSON download
- **Clear All** with confirmation toast notification
- **Individual remove** buttons with per-item toast feedback
- **Empty state** with `UserX` icon when list is empty

#### 👤 Profile Detail Page
- Loaded asynchronously via `loadProfileByUsername()` using `import.meta.glob` for code splitting
- **Hero section**: large avatar (128–160px), platform chip, fullname + verified badge, @handle, bio/description, add/remove + "View Profile" (external link) buttons
- **Dynamic stats grid** — conditionally renders available metrics:
  - Always shown: Followers, Engagement Rate
  - Conditionally shown: Posts, Avg Likes, Avg Comments, Avg Views, Avg Reels Plays, Engagements
- **Staggered stat card animation**: each card animates in with `0.04s` incremental delay
- **Stale data guard**: uses `let active = true` pattern in `useEffect` cleanup to prevent state updates after unmount or username change
- Graceful **"Profile not found"** and **"Invalid profile"** empty states via `EmptyDetail` helper component
- Platform inferred from `?platform=` query param, defaults to `"instagram"`

### Bonus Features

| Feature                        | Details                                                                 |
| ------------------------------ | ----------------------------------------------------------------------- |
| **Drag-to-reorder**            | Full DnD support in the saved list drawer                               |
| **CSV/JSON Export**            | Production-ready export functionality with proper CSV escaping          |
| **19 Unit Tests**              | Comprehensive Vitest suite covering store, filters, and formatters      |
| **GitHub Actions CI**          | Automated lint → build → test pipeline on every push/PR to `main`       |
| **Accessibility**              | ARIA labels/roles, semantic HTML, keyboard nav, focus-visible, prefers-reduced-motion |
| **Dark Mode**                  | Automatic via `prefers-color-scheme` media query                        |
| **Skeleton Loaders**           | Pixel-perfect shimmer loading states matching actual component layouts   |
| **Toast Notifications**        | Glassmorphism-styled toasts for add/remove/export/clear actions         |
| **WebGL Fluid Background**     | Animated Navier-Stokes fluid simulation with auto-pilot + mouse interaction |
| **Page Transitions**           | Framer Motion `AnimatePresence` with fade+slide (220ms ease-out)        |
| **404 Page**                   | Styled catch-all route with navigation back to home                     |

---

## 🗄 State Management (Zustand)

The app uses a single **Zustand** store with the `persist` middleware to automatically sync state to `localStorage`.

**Store**: `src/store/useListStore.ts`  
**LocalStorage key**: `"wobb-selected-profiles"`

```typescript
// Saved profile extends the base summary with platform and timestamp
interface ListProfile extends UserProfileSummary {
  platform: Platform;
  addedAt: number;  // Date.now() timestamp when added
}

interface ListStore {
  profiles: ListProfile[];                          // Saved influencer profiles

  addProfile(profile, platform): boolean;           // Add (deduplicates by user_id, returns false if duplicate)
  removeProfile(userId: string): void;              // Remove by user_id
  reorderProfiles(start, end): void;                // Drag-and-drop splice-based reorder
  clearList(): void;                                // Clear all saved profiles
  isInList(userId: string): boolean;                // Check if profile is saved (.some() check)
}
```

**Persistence details**:
- The `profiles` array is serialized to `localStorage` automatically via Zustand's `persist` middleware
- The user's curated list survives page refreshes, tab closures, and browser restarts
- Transient UI state (like drawer open/close) is **not** persisted
- The store is accessible outside React via `useListStore.getState()` (used in tests)

---

## 🔄 Data Flow

```
Static JSON files (src/assets/data/search/*.json)
        │
        ▼
  extractProfiles(platform)    ← Maps accounts[].account.user_profile → UserProfileSummary[]
        │
        ▼
    useMemo (cached)           ← Recomputed only when platform changes
        │
        ▼
  useDebounce(query, 250ms)    ← Delays search input by 250ms
        │
        ▼
  filterProfiles(profiles, debouncedQuery)  ← Case-insensitive match on username/handle/fullname
        │
        ▼
    useMemo (cached)           ← Recomputed only when profiles or query change
        │
        ├── ProfileList → ProfileCard[]         ← Rendered in responsive grid
        ├── Spotlight sidebar (top 3)           ← Sliced from filtered results
        └── Stats strip (reach, count, avg)     ← Computed from filtered results
```

### Data Sources

| Directory                    | Contents                                   | Loading Strategy                     |
| ---------------------------- | ------------------------------------------ | ------------------------------------ |
| `src/assets/data/search/`   | Platform search results (3 JSON files)     | Static import at build time          |
| `src/assets/data/profiles/` | Individual profile details (6 JSON files)  | Dynamic import via `import.meta.glob`|

### Search Data Pipeline (SearchPage)

1. **Import**: Three JSON files (`instagram.json`, `youtube.json`, `tiktok.json`) are statically imported at build time
2. **Platform mapping**: `platformData` Record maps platform names to their JSON data
3. **Extraction**: `extractProfiles(platform)` maps `accounts[].account.user_profile` to `UserProfileSummary[]`
4. **Debouncing**: The raw search query is debounced by 250ms via `useDebounce` before being passed to the filter
5. **Filtering**: `filterProfiles(profiles, query)` performs case-insensitive `.includes()` on `username`, `handle`, and `fullname`
6. **Rendering**: Filtered results are rendered in a responsive grid, and additional `useMemo` computations derive spotlight profiles, total reach, and average engagement

### Profile Detail Loading (ProfileDetailPage)

1. Username extracted from URL params (`:username`), platform from `?platform=` query string
2. `loadProfileByUsername(username)` uses `import.meta.glob<ProfileDetailResponse>("../assets/data/profiles/*.json")` to dynamically resolve the profile JSON
3. A `DetailState` pattern (`{ username, data }`) guards against stale data from previously loaded usernames
4. An `active` flag in the `useEffect` cleanup prevents state updates after unmount or navigation

---

## 🎨 UI/UX Design

### Design System

Design tokens are defined in `index.css` via Tailwind CSS v4's `@theme` directive:

| Token                | Value                       | Usage                                    |
| -------------------- | --------------------------- | ---------------------------------------- |
| **Primary Dark**     | `#071426`                   | App background, deep surfaces            |
| **Primary**          | `#15375b`                   | Navbar, elevated surfaces                |
| **Secondary**        | `#4f8fb9`                   | Interactive elements, borders            |
| **Light Blue**       | `#bfe3f7`                   | Text highlights, accents                 |
| **Off White**        | `#f7fbff`                   | Primary text color                       |
| **Accent Mint**      | `#83f2d1`                   | CTAs, verified badges, focus rings       |
| **Accent Gold**      | `#ffd166`                   | Warning states, secondary highlights     |
| **Accent Rose**      | `#ff8fab`                   | Danger actions, removal buttons          |
| **Glass BG**         | `rgba(21,55,91,0.55)`       | Glassmorphic panel backgrounds           |
| **Glass Border**     | `rgba(191,227,247,0.2)`     | Subtle glass panel borders               |
| **Typography**       | Inter (300–800 weights)     | All text via Google Fonts                |
| **Border Radius**    | Cards: 18px, Controls: 14px, Pills: 999px | Consistent rounding system |

### Visual Effects

| Effect                   | Implementation                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| **Glassmorphism**        | `backdrop-filter: blur(22px) saturate(150%)` with semi-transparent backgrounds (alpha 0.04–0.72) |
| **LiquidEther Background** | Full-screen WebGL Navier-Stokes fluid dynamics simulation using Three.js custom GLSL shaders (advection, divergence, Poisson pressure, viscous diffusion) |
| **Auto-Demo Mode**       | Virtual cursor smoothly animates when user is idle (3s resume delay); seamless smoothstep takeover on mouse interaction |
| **Card Hover Effects**   | `translateY(-4px)` lift, gradient overlay appears, border color transitions to mint              |
| **Page Transitions**     | Framer Motion `AnimatePresence` with fade+slide (220ms ease-out) keyed on `location.pathname`    |
| **Stagger Animations**   | Stat cards animate in with 0.04s incremental delay per card                                      |
| **Spring Physics**       | Drawer slide-in uses spring animation (damping: 30, stiffness: 300)                              |
| **Skeleton Loaders**     | CSS shimmer animation (1.45s cycle) with placeholders matching actual component layouts           |
| **GlareHover**           | Cursor-tracking light-reflection effect component (CSS `::before` pseudo-element with linear gradient) |
| **Custom Scrollbar**     | Thin glass-themed scrollbar with mint hover highlight (WebKit + standard)                        |
| **Selection Styling**    | Custom `::selection` colors matching brand palette                                               |

### Responsive Design

- **CSS Grid** layout: 1 col (mobile) → 2 cols (sm) → 3 cols (lg) → 4 cols (xl)
- **Mobile breakpoint** at 760px: segmented control becomes grid, stat strip becomes single column
- Replaced hardcoded `w-[700px]` with responsive `w-full` (bug fix #8)
- SearchPage uses `lg:grid-cols-[minmax(0,1fr)_360px]` for hero + sidebar layout
- Touch-friendly button sizes and spacing throughout

### Accessibility

| Feature                    | Implementation                                                       |
| -------------------------- | -------------------------------------------------------------------- |
| **ARIA Roles**             | `role="tablist"`, `role="tab"`, `aria-selected` on platform filter   |
| **ARIA Labels**            | `aria-label` on interactive elements, `aria-label="Verified profile"` |
| **Semantic HTML**          | `<nav>`, `<main>`, `<aside>` used appropriately                      |
| **Keyboard Navigation**    | `tabIndex={0}`, Enter/Space triggers card navigation                 |
| **Focus Visible**          | Mint-green outline ring on keyboard focus                             |
| **Alt Text**               | Descriptive `alt` attributes on all images (bug fix #7)              |
| **Reduced Motion**         | `@media (prefers-reduced-motion: reduce)` disables all animations    |
| **Dark Mode**              | Automatic via `prefers-color-scheme` — respects OS preference        |

---

## ⚡ Performance Optimizations

| Optimization                | Technique                                                                                       | Impact                                |
| --------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------- |
| **Debounced Search**        | Custom `useDebounce` hook (250ms delay)                                                         | Prevents re-filtering per keystroke   |
| **Memoized Data (5×)**     | `useMemo` on extractProfiles, filtered, spotlight, totalFollowers, avgEngagement                 | Avoids redundant array processing     |
| **Code Splitting**          | `React.lazy()` + `Suspense` on `ProfileDetailPage`                                              | Reduces initial bundle size           |
| **Dynamic Import**          | `import.meta.glob` for profile detail JSON files                                                | Only loads profile data when visited  |
| **Component Memoization**   | `React.memo` wrapper on `ProfileCard`                                                           | Skips re-renders when props unchanged |
| **Callback Stability**      | `useCallback` on all event handlers (ProfileCard, ListDrawer, ProfileDetailPage)                | Prevents child re-renders             |
| **Lazy Images**             | `loading="lazy"` attribute on all `<img>` elements                                              | Defers off-screen image loading       |
| **Tree-Shaking**            | Individual icon imports from `lucide-react`                                                     | Only ships used icons                 |
| **WebGL Off-screen Pause**  | `IntersectionObserver` pauses LiquidEther rendering when not visible                            | Zero GPU cost when off-screen         |
| **Tab Visibility Pause**    | `document.visibilitychange` pauses WebGL when tab is hidden                                     | Saves battery on background tabs      |
| **Resize Debouncing**       | `ResizeObserver` + `requestAnimationFrame` for canvas resize                                    | Prevents layout thrashing             |
| **Resolution Multiplier**   | LiquidEther renders at 0.5× resolution, DPR capped at 2                                        | Maintains 60fps on mid-range GPUs     |
| **iOS FBO Compatibility**   | Auto-detects iOS and uses `HalfFloatType` for framebuffer objects                               | Prevents WebGL crashes on Safari      |
| **Static Data Bundling**    | JSON imported at build time — no runtime API calls                                              | Zero latency data loading             |

---

## 📐 Type System

All TypeScript interfaces are centralized in `src/types/index.ts`:

```typescript
// Platform union type
type Platform = "instagram" | "youtube" | "tiktok";

// Core profile data displayed on cards and in search results
interface UserProfileSummary {
  user_id: string;
  username: string;
  url: string;
  picture: string;
  fullname: string;
  is_verified: boolean;
  followers: number;
  engagements?: number;
  engagement_rate?: number;
  handle?: string;
  avg_views?: number;
}

// Wrapper type matching the JSON search data structure
interface SearchAccount {
  account: {
    user_profile: UserProfileSummary;
  };
  audience_source: string;
}

// Top-level search data response
interface SearchData {
  total: number;
  accounts: SearchAccount[];
}

// Extended profile for the detail page
interface FullUserProfile extends UserProfileSummary {
  type?: string;
  description?: string;
  is_business?: boolean;
  posts_count?: number;
  avg_likes?: number;
  avg_comments?: number;
  avg_reels_plays?: number;
  gender?: string;
  age_group?: string;
}

// Detail page API response wrapper
interface ProfileDetailResponse {
  cached?: boolean;
  data: {
    success: boolean;
    user_profile: FullUserProfile;
  };
}
```

**Additional types defined in component files**:
- `ListProfile extends UserProfileSummary` — adds `platform: Platform` + `addedAt: number` (in store)
- `ListStore` — full Zustand store interface with 5 methods
- `StatProps` — `{ label: string; value: string }` for stat cards
- `DetailState` — `{ username: string | null; data: ProfileDetailResponse | null }` for async loading guard
- Component `Props` interfaces in: Layout, ListDrawer, PlatformFilter, ProfileCard, ProfileList

The codebase maintains **strict TypeScript** with **zero `any` types** (except `@ts-nocheck` on the ported GlareHover component). Strict lint rules: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`.

---

## 🧪 Testing

**Runner**: Vitest 4 (Vite-native, fast HMR-compatible test runner)  
**Utilities**: React Testing Library + `@testing-library/jest-dom`  
**Environment**: jsdom  
**Store testing**: Uses `useListStore.setState()` for direct state manipulation (no component rendering needed)

### Test Suite: `useListStore.test.ts` — Store Logic (8 tests)

| Test                            | Validates                                                      |
| ------------------------------- | -------------------------------------------------------------- |
| Empty initial state             | Store starts with empty `profiles` array                       |
| Add profile                     | Returns `true`, profile added with correct fields              |
| Prevent duplicate additions     | Returns `false`, `profiles.length` unchanged                   |
| Remove profile                  | Profile correctly filtered out by `user_id`                    |
| `isInList` returns true/false   | Correctly identifies saved vs. unsaved profiles                |
| Clear all profiles              | `clearList()` empties the array                                |
| Reorder profiles                | Splice-based drag-and-drop produces correct ordering           |
| Timestamp on `addedAt`          | `addedAt` is within `Date.now()` bounds at time of add         |

### Test Suite: `searchAndFormatters.test.ts` — Filters & Formatters (11 tests)

| Test                             | Validates                                                     |
| -------------------------------- | ------------------------------------------------------------- |
| Empty query returns all          | No filter applied when query is empty                         |
| **Case-insensitive username**    | **Regression test for Bug #2** — "MR" matches `mrbeast`      |
| Case-insensitive fullname        | Matches on `fullname` field regardless of case                |
| Partial username match           | Substring matching works correctly                            |
| No match returns empty           | Returns `[]` when no profiles match                           |
| Match by username or fullname    | Either field can trigger a match                              |
| Format followers (millions)      | `2500000` → `"2.5M"`                                         |
| Format followers (thousands)     | `1500` → `"1.5K"`                                            |
| Format followers (small)         | `999` → `"999"`                                               |
| **Format engagement rate**       | **Regression test for Bug #3** — uses `rate * 100` not `10000` |
| Format undefined rate            | `undefined` → `"N/A"`                                         |

### Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch
```

### Test Results

```
 ✓ src/__tests__/useListStore.test.ts (8 tests)
 ✓ src/__tests__/searchAndFormatters.test.ts (11 tests)

 Test Files  2 passed (2)
      Tests  19 passed (19)
```

---

## 🔁 CI/CD Pipeline

**GitHub Actions** workflow runs on every push and PR to `main`:

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-build-test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node 20 (with npm cache)
      - npm ci
      - npm run lint
      - npm run build   # Includes TypeScript type-checking (tsc -b)
      - npm run test
```

This ensures that no code with lint errors, type errors, or failing tests can be merged into `main`.

---

## 📦 Libraries Added

| Library                     | Version    | Purpose                                                                                     |
| --------------------------- | ---------- | ------------------------------------------------------------------------------------------- |
| `zustand`                   | ^5.0.5     | Lightweight state management with `persist` middleware for automatic localStorage sync       |
| `@hello-pangea/dnd`         | ^18.0.1    | Drop-in replacement for abandoned `react-beautiful-dnd` — React 19 compatible, same API     |
| `framer-motion`             | ^12.12.1   | Page transitions, stagger animations, spring-based drawer slide-in effects                  |
| `react-hot-toast`           | ^2.5.2     | Lightweight, customizable toast notifications with glassmorphism styling                    |
| `lucide-react`              | ^0.525.0   | Modern, tree-shakeable SVG icon library                                                     |
| `three`                     | ^0.185.1   | WebGL rendering engine for the LiquidEther Navier-Stokes fluid simulation background        |
| `vitest`                    | ^4.1.9     | Fast, Vite-native test runner (dev dependency)                                              |
| `@testing-library/react`    | ^16.3.2    | DOM testing utilities for React components (dev dependency)                                  |
| `@testing-library/jest-dom` | ^6.9.1     | Custom Jest matchers for DOM assertions (dev dependency)                                     |
| `jsdom`                     | ^29.1.1    | DOM implementation for test environment (dev dependency)                                     |

---

## 📋 Assumptions & Trade-offs

1. **No actual React Context existed** in the starter code. The assignment says "replace Context with Zustand" but no Context provider was present. State management was built from scratch with Zustand, which achieves the intended outcome.

2. **Profile detail data is only available for 6 of ~30 profiles** (`cristiano`, `instagram`, `khaby.lame`, `mrbeast`, `MrBeast6000`, `tseries`). A graceful "Profile not found" empty state handles profiles without detail JSON files.

3. **`react-beautiful-dnd` → `@hello-pangea/dnd`**: This is the community-maintained fork [recommended by Atlassian](https://github.com/atlassian/react-beautiful-dnd) (the original creators). The API is identical — it's a one-line import change. This fixes the React 19 peer dependency conflict while enabling drag-to-reorder functionality.

4. **Dark mode is automatic** via `prefers-color-scheme`. No manual toggle was added to keep the UI clean, though one could easily be added to the navbar.

5. **Chunk size warning** in the production build comes from the large static JSON profile detail files (182–325KB each), not from application code. In a production app, this data would come from an API.

6. **CSS-first approach**: Complex glass/card effects use custom CSS classes defined in `index.css`, while Tailwind CSS handles layout and spacing. This gives maximum control over the glassmorphism design system.

7. **No error boundaries**: The app relies on conditional rendering for error states (loading → not found → loaded) rather than React error boundaries. This is sufficient for the static data approach.

---

## 📜 Available Scripts

| Command             | Description                                                |
| ------------------- | ---------------------------------------------------------- |
| `npm run dev`       | Start Vite development server with HMR                     |
| `npm run build`     | TypeScript type-check (`tsc -b`) + Vite production build   |
| `npm run lint`      | Run ESLint across the entire codebase                      |
| `npm run test`      | Run all tests with Vitest (single run)                     |
| `npm run test:watch`| Run tests in watch mode (re-runs on file changes)          |
| `npm run preview`   | Preview the production build locally                       |

---

## 🧩 Component Reference

### Pages

| Component            | File                          | Lines | Description                                              |
| -------------------- | ----------------------------- | ----- | -------------------------------------------------------- |
| `SearchPage`         | `src/pages/SearchPage.tsx`    | ~200  | Discovery page: hero panel, platform filter, stats strip, spotlight sidebar, profile grid |
| `ProfileDetailPage`  | `src/pages/ProfileDetailPage.tsx` | ~270 | Async profile detail: hero section, dynamic stats grid, verified badge, add-to-list |

### Layout & Shell

| Component       | File                            | Lines | Description                                                  |
| --------------- | ------------------------------- | ----- | ------------------------------------------------------------ |
| `Layout`        | `src/components/Layout.tsx`     | ~115  | App shell — sticky navbar with brand logo, AnimatePresence page transitions, footer with dynamic year |
| `ListDrawer`    | `src/components/ListDrawer.tsx` | ~280  | Slide-over panel with DnD reorder, CSV/JSON export, clear all, individual remove |

### UI Components

| Component        | File                                | Lines | Description                                         |
| ---------------- | ----------------------------------- | ----- | --------------------------------------------------- |
| `ProfileCard`    | `src/components/ProfileCard.tsx`    | ~135  | Memoized card: avatar, platform chip, 3-stat grid, add/remove toggle, keyboard accessible |
| `ProfileList`    | `src/components/ProfileList.tsx`    | ~40   | Responsive grid container with empty state                  |
| `PlatformFilter` | `src/components/PlatformFilter.tsx` | ~55   | Segmented control + search input with ARIA roles     |
| `Skeleton`       | `src/components/Skeleton.tsx`       | ~65   | Shimmer placeholders (card + detail page variants)   |
| `VerifiedBadge`  | `src/components/VerifiedBadge.tsx`  | ~15   | Mint-green circle with check icon, ARIA-labeled      |

### Visual Effects

| Component      | File                               | Lines | Description                                                    |
| -------------- | ---------------------------------- | ----- | -------------------------------------------------------------- |
| `LiquidEther`  | `src/components/LiquidEther.tsx`   | ~1170 | Full-screen WebGL Navier-Stokes fluid sim with auto-demo, mouse interaction, custom GLSL shaders, IntersectionObserver pause |
| `GlareHover`   | `src/components/GlareHover.tsx`    | ~45   | CSS-only cursor-tracking glare effect using `::before` pseudo-element |

### Hooks

| Hook           | File                        | Description                                        |
| -------------- | --------------------------- | -------------------------------------------------- |
| `useDebounce`  | `src/hooks/useDebounce.ts`  | Generic debounce hook using setTimeout/clearTimeout  |

### Utilities

| Function              | File                          | Description                                                   |
| --------------------- | ----------------------------- | ------------------------------------------------------------- |
| `extractProfiles`     | `src/utils/dataHelpers.ts`    | Maps `accounts[].account.user_profile` → `UserProfileSummary[]` |
| `filterProfiles`      | `src/utils/dataHelpers.ts`    | Case-insensitive filter on username, handle, and fullname     |
| `getSearchData`       | `src/utils/dataHelpers.ts`    | Returns raw `SearchData` for a given platform                 |
| `PLATFORMS`            | `src/utils/dataHelpers.ts`    | Constant array: `["instagram", "youtube", "tiktok"]`          |
| `getPlatformLabel`    | `src/utils/dataHelpers.ts`    | Maps platform key → display name ("Instagram", "YouTube", "TikTok") |
| `formatFollowers`     | `src/utils/formatters.ts`     | Formats numbers to K/M notation (e.g., `2500000` → `"2.5M"`) |
| `formatEngagementRate`| `src/utils/formatters.ts`     | Formats decimal rates to percentage (e.g., `0.0345` → `"3.45%"`) |
| `loadProfileByUsername` | `src/utils/profileLoader.ts` | Dynamic import via `import.meta.glob` for profile detail JSON |

---

## 🔮 What I'd Do With More Time

- Add **E2E tests with Playwright** for full user flow coverage
- Implement a **Cmd+K command palette** for power-user search
- Add an **influencer comparison feature** (side-by-side stats)
- Implement **virtual scrolling** for very large profile datasets
- Add a **manual dark/light mode toggle** with localStorage persistence
- **Deploy to Vercel** with preview environments on pull requests
- Add **pagination or infinite scroll** for the profile grid
- Implement **React error boundaries** for runtime crash resilience
- Add **analytics tracking** for search queries and profile views
- Integrate a **real API layer** replacing static JSON data
