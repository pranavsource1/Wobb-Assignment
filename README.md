# Wobb Frontend Assignment — Influencer Discovery Platform

> A modern, production-grade influencer discovery and curation app built with **React 19**, **TypeScript**, **Vite 8**, **Tailwind CSS v4**, and **Zustand**. Completely redesigned from the starter scaffold with 12 bug fixes, full state management, performance optimizations, 19 unit tests, CI pipeline, and a premium glassmorphic UI.

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
| **Styling**        | Tailwind CSS v4 (via `@tailwindcss/vite` plugin)                   |
| **State Mgmt**     | Zustand 5 with `persist` middleware                                |
| **Routing**        | React Router DOM v7                                                |
| **Drag & Drop**    | `@hello-pangea/dnd` (maintained fork of `react-beautiful-dnd`)     |
| **Animations**     | Framer Motion 12                                                   |
| **3D Background**  | Three.js (custom WebGL shader for animated gradient)               |
| **Icons**          | Lucide React (tree-shakeable)                                      |
| **Notifications**  | React Hot Toast                                                    |
| **Testing**        | Vitest 4 + React Testing Library                                   |
| **CI**             | GitHub Actions (lint → build → test)                               |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      main.tsx                           │
│               BrowserRouter + Toaster                   │
└────────────────────────┬────────────────────────────────┘
                         │
                    ┌────▼────┐
                    │ App.tsx │  ← Route definitions
                    └────┬────┘
                         │
              ┌──────────▼──────────┐
              │     Layout.tsx      │  ← Navbar + LiquidEther bg
              │   ┌─────────────┐  │
              │   │ ListDrawer  │  │  ← Slide-over saved list
              │   └─────────────┘  │
              └──────────┬─────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐   ┌──────▼───────┐  ┌────▼────┐
    │ Search  │   │ProfileDetail │  │  404    │
    │  Page   │   │    Page      │  │  Page   │
    └────┬────┘   └──────────────┘  └─────────┘
         │
    ┌────▼──────────┐
    │PlatformFilter │  ← Search input + platform tabs
    └────┬──────────┘
         │
    ┌────▼──────────┐
    │  ProfileList  │  ← Animated grid container
    └────┬──────────┘
         │
    ┌────▼──────────┐
    │ ProfileCard[] │  ← Memo'd cards with GlareHover
    └───────────────┘
```

### Routing Strategy

| Route                  | Component            | Loading    |
| ---------------------- | -------------------- | ---------- |
| `/`                    | `SearchPage`         | Eager      |
| `/profile/:username`   | `ProfileDetailPage`  | Lazy (code-split) |
| `*`                    | 404 Page             | Eager (inline) |

- `ProfileDetailPage` is loaded via `React.lazy()` + `Suspense` to reduce initial bundle size.
- A styled catch-all 404 route handles unknown paths gracefully.

---

## 📁 Project Structure

```
src/
├── __tests__/                    # Unit tests
│   ├── useListStore.test.ts      #   Store logic tests (8 tests)
│   └── searchAndFormatters.test.ts #  Filter & formatter tests (11 tests)
├── assets/
│   └── data/                     # Static JSON profile data files
├── components/
│   ├── GlareHover.tsx            # Light-reflection hover effect
│   ├── GlareHover.css            # Glare animation styles
│   ├── Layout.tsx                # App shell: navbar + background + drawer
│   ├── LiquidEther.tsx           # WebGL animated gradient background (Three.js)
│   ├── LiquidEther.css           # Background canvas styles
│   ├── ListDrawer.tsx            # Slide-over drawer with DnD reorder + export
│   ├── PlatformFilter.tsx        # Search input + platform tab filter
│   ├── ProfileCard.tsx           # Individual profile card (React.memo)
│   ├── ProfileList.tsx           # Animated card grid container
│   ├── Skeleton.tsx              # Shimmer loading skeletons
│   └── VerifiedBadge.tsx         # Verified account checkmark icon
├── hooks/
│   └── useDebounce.ts            # Generic debounce hook (250ms)
├── pages/
│   ├── SearchPage.tsx            # Main discovery page with search/filter
│   └── ProfileDetailPage.tsx     # Individual profile detail view
├── store/
│   └── useListStore.ts           # Zustand store with localStorage persist
├── types/
│   └── index.ts                  # TypeScript interfaces (ProfileSummary, ProfileDetail)
├── utils/
│   ├── dataHelpers.ts            # extractProfiles() + filterProfiles()
│   ├── formatters.ts             # formatFollowers() + formatEngagementRate()
│   └── profileLoader.ts          # Dynamic import for profile detail JSON
├── App.tsx                       # Route configuration + lazy loading
├── main.tsx                      # Entry point (BrowserRouter + Toaster)
├── index.css                     # Global styles + Tailwind config
└── vite-env.d.ts                 # Vite type declarations
```

---

## 🐛 Bugs Found & Fixed

Twelve bugs were identified and fixed in the original starter code:

| #  | Severity     | Bug                                                    | Root Cause                                                                        | Fix Applied                                                                                       |
| -- | ------------ | ------------------------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1  | 🔴 Critical  | **`npm install` fails**                                | `react-beautiful-dnd@13.1.1` requires React ≤18; project uses React 19            | Replaced with `@hello-pangea/dnd` (maintained fork, identical API, React 19 compatible)           |
| 2  | 🟡 Medium    | **Case-sensitive username search**                     | Raw string comparison — searching "MR" wouldn't match `mrbeast`                   | Added `.toLowerCase()` to both sides in `filterProfiles()` (`dataHelpers.ts`)                     |
| 3  | 🟡 Medium    | **Engagement rate off by 100×**                        | Inline calculation used `rate * 10000` instead of `rate * 100`                    | Replaced with shared `formatEngagementRate()` from `formatters.ts`                                |
| 4  | 🟡 Medium    | **"Engagements" card shows rate, not count**           | Displayed `formatEngagementRate()` instead of actual `user.engagements` value      | Now displays real engagements count using `formatFollowers()`                                     |
| 5  | 🟢 Low       | **Duplicate follower formatters**                      | `formatFollowersLocal()` and `formatFollowersDetail()` reinvented the wheel       | Deleted duplicates; single `formatFollowers()` imported everywhere                                |
| 6  | 🟢 Low       | **Dead `SearchBar.tsx` component**                     | Fully built component never imported anywhere                                     | Deleted; `PlatformFilter` already includes search input                                           |
| 7  | 🟢 Low       | **Missing alt text on all `<img>` tags**               | Accessibility violation — screen readers can't describe images                    | Added descriptive `alt` attributes                                                                |
| 8  | 🟡 Medium    | **Hardcoded `w-[700px]`**                              | Fixed width breaks on mobile/tablet screens                                       | Replaced with responsive `w-full`                                                                 |
| 9  | 🟢 Low       | **Dead `clickCount` state**                            | `useState` + `console.log` doing nothing in production                            | Removed entirely                                                                                  |
| 10 | 🟢 Low       | **Pointless `data-search` DOM attribute**              | Search query unnecessarily dumped on every card's DOM node                        | Removed                                                                                           |
| 11 | 🟡 Medium    | **No 404 route**                                       | Navigating to unknown paths showed a blank page                                   | Added catch-all `<Route path="*">` with styled 404 page                                          |
| 12 | 🟡 Medium    | **No memoization**                                     | `extractProfiles` / `filterProfiles` recomputed on every render                   | Wrapped in `useMemo` with proper dependency arrays                                                |

---

## ✨ Features Implemented

### Core Features

#### 🔍 Influencer Search & Discovery
- Real-time search across all loaded influencer profiles
- **Debounced input** (250ms via custom `useDebounce` hook) to prevent excessive re-filtering
- Case-insensitive username matching (regression bug fix)
- Memoized filtering for optimal performance

#### 🏷 Platform Filtering
- Tab-based filter bar for **Instagram**, **YouTube**, **TikTok**, and **All**
- Combined with search query for compound filtering
- Responsive tab layout that works across all screen sizes

#### 📋 Add to List / Save Profiles
- **Add/Remove toggle** available on both `ProfileCard` and `ProfileDetailPage`
- **Duplicate prevention** — checks by `user_id` before adding
- Persisted to `localStorage` — survives page refreshes and browser restarts
- **Count badge** in the navbar showing number of saved profiles

#### 📂 List Management Drawer
- **Slide-over drawer** accessible from the navbar
- **Drag-to-reorder** saved profiles using `@hello-pangea/dnd`
- **Export as CSV** — downloads a structured `.csv` file
- **Export as JSON** — downloads a formatted `.json` file
- **Clear All** with confirmation toast notification
- Individual remove buttons for each saved profile

#### 👤 Profile Detail Page
- Full profile view with **bio**, **verified badge**, and stat cards:
  - Followers (formatted: K/M/B notation)
  - Engagements (formatted count)
  - Engagement Rate (percentage)
  - Following count
  - Media/Post count
- Graceful "Profile not found" empty state for profiles without detail data
- Code-split via `React.lazy` for smaller initial bundle

### Bonus Features

| Feature                    | Details                                                                 |
| -------------------------- | ----------------------------------------------------------------------- |
| **Drag-to-reorder**        | Full DnD support in the saved list drawer                               |
| **CSV/JSON Export**        | Production-ready export functionality for the saved list                |
| **19 Unit Tests**          | Comprehensive Vitest suite covering store, filters, and formatters      |
| **GitHub Actions CI**      | Automated lint → build → test pipeline on every push                    |
| **Accessibility**          | ARIA labels, semantic HTML (`nav`, `main`, `aside`), focus-visible      |
| **Dark Mode**              | Automatic via `prefers-color-scheme` media query                        |
| **Skeleton Loaders**       | Shimmer loading states instead of generic "Loading..." text             |
| **Toast Notifications**    | Non-intrusive feedback for add/remove/clear actions                     |
| **WebGL Background**       | Animated liquid gradient using Three.js custom shaders                  |
| **404 Page**               | Styled catch-all route with navigation back to home                     |

---

## 🗄 State Management (Zustand)

The app uses a single **Zustand** store with the `persist` middleware to automatically sync state to `localStorage`.

**Store**: `src/store/useListStore.ts`

```typescript
interface ListStore {
  list: ProfileSummary[];      // Saved influencer profiles
  drawerOpen: boolean;         // Drawer visibility toggle

  addToList(profile): void;    // Add profile (deduplicates by user_id)
  removeFromList(userId): void;// Remove by user_id
  reorder(start, end): void;   // Drag-and-drop index swap
  clearList(): void;           // Clear all saved profiles
  isInList(userId): boolean;   // Check if profile is already saved
  toggleDrawer(): void;        // Toggle drawer open/closed
}
```

**Persistence**: The `list` array is serialized to `localStorage` under the key `influencer-list`. The `drawerOpen` state is **not** persisted (transient UI state). This means the user's curated list survives:
- Page refreshes
- Browser tab closures
- Browser restarts

---

## 🔄 Data Flow

```
Static JSON files (src/assets/data/)
        │
        ▼
  extractProfiles()     ← Flattens nested JSON into ProfileSummary[]
        │
        ▼
    useMemo (cached)    ← Recomputed only when raw data changes
        │
        ▼
  filterProfiles()      ← Filters by platform + debounced search query
        │
        ▼
    useMemo (cached)    ← Recomputed only when profiles/platform/query change
        │
        ▼
  ProfileList → ProfileCard[]   ← Rendered with Framer Motion stagger
```

### Data Processing Pipeline

1. **Import**: Raw JSON data files are statically imported at build time
2. **Extraction**: `extractProfiles(data)` normalizes the nested JSON structure into a flat `ProfileSummary[]` array
3. **Filtering**: `filterProfiles(profiles, platform, query)` applies:
   - **Platform filter**: Case-insensitive platform match (or "all" to skip)
   - **Search filter**: Case-insensitive `username.includes(query)` match
4. **Memoization**: Both stages are wrapped in `useMemo` with explicit dependency arrays
5. **Debouncing**: The search input value is debounced (250ms) before being passed to the filter, preventing per-keystroke recomputation

### Profile Detail Loading

Individual profile detail data is loaded dynamically via `profileLoader.ts`, which uses `import()` to dynamically import the specific JSON file for a given username. This supports code splitting — detail data is only loaded when a user navigates to the profile page.

---

## 🎨 UI/UX Design

### Design System

| Token           | Value         | Usage                              |
| --------------- | ------------- | ---------------------------------- |
| **Deep Navy**   | `#0A1931`     | Primary background, navbar         |
| **Ocean Blue**  | `#1A3D63`     | Secondary surfaces, card borders   |
| **Ice Blue**    | `#B3CFE5`     | Accent highlights, hover states    |
| **Typography**  | Inter (Google Fonts) | All text across the application |

### Visual Effects

| Effect               | Implementation                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| **Glassmorphism**    | Semi-transparent backgrounds with `backdrop-filter: blur()` on cards and navbar                  |
| **GlareHover**       | Custom React component that tracks cursor position to create a light-reflection effect on cards  |
| **LiquidEther**      | Full-screen WebGL animated gradient background powered by Three.js with custom GLSL shaders      |
| **Page Transitions** | Framer Motion `AnimatePresence` with fade/slide animations between routes                        |
| **Stagger Animations** | Cards animate in with staggered delays using Framer Motion's `variants` system                |
| **Skeleton Loaders** | CSS shimmer animation on placeholder cards during data loading                                   |
| **Selection Styling** | Custom `::selection` colors matching brand palette                                              |

### Responsive Design

- **Mobile-first** CSS Grid layout with responsive breakpoints
- Replaced hardcoded `w-[700px]` with responsive `w-full` (bug fix #8)
- Fully responsive navbar, card grid, drawer, and detail page
- Touch-friendly button sizes and spacing

### Dark Mode

Automatic dark mode support via `prefers-color-scheme` CSS media query. No manual toggle — the app respects the user's system preference.

### Accessibility

- Descriptive `alt` text on all images (bug fix #7)
- ARIA labels on interactive elements
- Semantic HTML: `<nav>`, `<main>`, `<aside>`
- Keyboard navigation support
- `focus-visible` styling for keyboard users

---

## ⚡ Performance Optimizations

| Optimization            | Technique                                                                                       | Impact                                |
| ----------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------- |
| **Debounced Search**    | Custom `useDebounce` hook (250ms delay)                                                         | Prevents re-filtering per keystroke   |
| **Memoized Data**       | `useMemo` on `extractProfiles()` and `filterProfiles()` with proper dependency arrays           | Avoids redundant array processing     |
| **Code Splitting**      | `React.lazy()` + `Suspense` on `ProfileDetailPage`                                              | Reduces initial bundle size           |
| **Component Memoization** | `React.memo` wrapper on `ProfileCard`                                                         | Skips re-renders when props unchanged |
| **Callback Stability**  | `useCallback` on all event handlers                                                             | Prevents child re-renders             |
| **Lazy Images**         | `loading="lazy"` attribute on all `<img>` elements                                              | Defers off-screen image loading       |
| **Tree-Shaking**        | Individual icon imports from `lucide-react`                                                     | Only ships used icons                 |

---

## 📐 Type System

All TypeScript interfaces are centralized in `src/types/index.ts`:

```typescript
// Core profile data displayed on cards and in the saved list
interface ProfileSummary {
  user_id: string;
  username: string;
  full_name: string;
  profile_pic_url: string;
  is_verified: boolean;
  follower_count: number;
  platform: string;
  engagement_rate: number;
}

// Extended profile data for the detail page (extends ProfileSummary)
interface ProfileDetail extends ProfileSummary {
  bio: string;
  following_count: number;
  media_count: number;
  engagements: number;
}
```

The codebase maintains **strict TypeScript** with **zero `any` types**. All function parameters, return types, and component props are fully typed.

---

## 🧪 Testing

**Runner**: Vitest 4 (Vite-native, fast HMR-compatible test runner)  
**Utilities**: React Testing Library + `@testing-library/jest-dom`  
**Environment**: jsdom

### Test Suites

#### `useListStore.test.ts` — Store Logic (8 tests)

| Test                          | Validates                                                      |
| ----------------------------- | -------------------------------------------------------------- |
| Add profile to list           | Profile is added to the store's `list` array                   |
| Prevent duplicate additions   | Adding the same `user_id` twice doesn't create duplicates      |
| Remove profile from list      | Profile is correctly removed by `user_id`                      |
| Reorder profiles              | Drag-and-drop index swap produces correct ordering             |
| Clear all profiles            | `clearList()` empties the array                                |
| `isInList` returns true       | Returns `true` for profiles currently in the list              |
| `isInList` returns false      | Returns `false` for profiles not in the list                   |
| Toggle drawer                 | `toggleDrawer()` flips `drawerOpen` boolean                    |

#### `searchAndFormatters.test.ts` — Filters & Formatters (11 tests)

| Test                             | Validates                                                     |
| -------------------------------- | ------------------------------------------------------------- |
| Filter by platform               | Only matching platform profiles returned                      |
| Filter by search query           | Username substring match works                                |
| **Case-insensitive search**      | **Regression test for Bug #2** — "MR" matches `mrbeast`      |
| Combined platform + search       | Both filters applied simultaneously                           |
| Empty results                    | Returns empty array when no matches                           |
| Format followers (thousands)     | `1500` → `"1.5K"`                                            |
| Format followers (millions)      | `2500000` → `"2.5M"`                                         |
| Format followers (billions)      | `1000000000` → `"1.0B"`                                      |
| Format followers (small)         | `999` → `"999"`                                              |
| Format engagement rate           | Decimal → percentage string                                   |
| Format engagement rate precision | Correct number of decimal places                              |

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

**GitHub Actions** workflow runs on every push:

```yaml
# .github/workflows/ci.yml
Steps:
  1. Checkout code
  2. Install dependencies (npm install)
  3. Lint (npm run lint)
  4. Build (npm run build — includes TypeScript type-checking)
  5. Test (npm run test)
```

This ensures that no code with lint errors, type errors, or failing tests can be merged.

---

## 📦 Libraries Added

| Library                   | Version  | Purpose                                                                                     |
| ------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `zustand`                 | ^5.0.5   | Lightweight state management with `persist` middleware for localStorage sync                 |
| `@hello-pangea/dnd`       | ^18.0.1  | Drop-in replacement for abandoned `react-beautiful-dnd` — React 19 compatible, same API     |
| `framer-motion`           | ^12.12.1 | Page transitions, stagger animations, drawer slide-in effects                               |
| `react-hot-toast`         | ^2.5.2   | Lightweight, customizable toast notifications                                               |
| `lucide-react`            | ^0.525.0 | Modern, tree-shakeable SVG icon library                                                     |
| `three`                   | ^0.185.1 | WebGL rendering for the animated LiquidEther background                                     |
| `vitest`                  | ^4.1.9   | Fast, Vite-native test runner (dev dependency)                                              |
| `@testing-library/react`  | ^16.3.2  | DOM testing utilities for React components (dev dependency)                                  |
| `@testing-library/jest-dom` | ^6.9.1 | Custom Jest matchers for DOM assertions (dev dependency)                                     |

---

## 📋 Assumptions & Trade-offs

1. **No actual React Context existed** in the starter code. The assignment says "replace Context with Zustand" but no Context provider was present. State management was built from scratch with Zustand, which achieves the intended outcome.

2. **Profile detail data is only available for 5 of 30 profiles** (`cristiano`, `instagram`, `khaby.lame`, `mrbeast`, `MrBeast6000`, `tseries`). A graceful "Profile not found" empty state handles profiles without detail JSON.

3. **`react-beautiful-dnd` → `@hello-pangea/dnd`**: This is the community-maintained fork [recommended by Atlassian](https://github.com/atlassian/react-beautiful-dnd) (the original creators). The API is identical — it's a one-line import change. This fixes the React 19 peer dependency conflict while enabling drag-to-reorder functionality.

4. **Dark mode is automatic** via `prefers-color-scheme`. No manual toggle was added to keep the UI clean, though one could easily be added.

5. **Chunk size warning** in the production build comes from the large static JSON data files (profile data), not from application code. In a production app, this data would come from an API.

---

## 📜 Available Scripts

| Command             | Description                                      |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Start Vite development server (HMR enabled)      |
| `npm run build`     | TypeScript type-check + Vite production build     |
| `npm run lint`      | Run ESLint across the codebase                   |
| `npm run test`      | Run all tests with Vitest (single run)           |
| `npm run test:watch`| Run tests in watch mode                          |
| `npm run preview`   | Preview the production build locally             |

---

## 🧩 Component Reference

### Pages

| Component            | File                          | Description                                              |
| -------------------- | ----------------------------- | -------------------------------------------------------- |
| `SearchPage`         | `src/pages/SearchPage.tsx`    | Main discovery page with search bar, platform tabs, and profile grid |
| `ProfileDetailPage`  | `src/pages/ProfileDetailPage.tsx` | Individual profile view with stats, bio, and add-to-list |

### Layout & Shell

| Component       | File                            | Description                                                  |
| --------------- | ------------------------------- | ------------------------------------------------------------ |
| `Layout`        | `src/components/Layout.tsx`     | App shell — persistent navbar, animated background, drawer   |
| `ListDrawer`    | `src/components/ListDrawer.tsx` | Slide-over panel with DnD reorder, export, and clear         |

### UI Components

| Component        | File                                | Description                                         |
| ---------------- | ----------------------------------- | --------------------------------------------------- |
| `ProfileCard`    | `src/components/ProfileCard.tsx`    | Memoized profile card with add/remove toggle        |
| `ProfileList`    | `src/components/ProfileList.tsx`    | Animated grid container with Framer Motion stagger  |
| `PlatformFilter` | `src/components/PlatformFilter.tsx` | Search input + platform tab filter bar              |
| `Skeleton`       | `src/components/Skeleton.tsx`       | Shimmer loading placeholder cards                   |
| `VerifiedBadge`  | `src/components/VerifiedBadge.tsx`  | Blue checkmark SVG for verified accounts            |

### Visual Effects

| Component      | File                               | Description                                                    |
| -------------- | ---------------------------------- | -------------------------------------------------------------- |
| `GlareHover`   | `src/components/GlareHover.tsx`    | Cursor-tracking light-reflection effect on card hover           |
| `LiquidEther`  | `src/components/LiquidEther.tsx`   | Full-screen WebGL animated gradient via Three.js custom shaders |

### Hooks

| Hook           | File                        | Description                                        |
| -------------- | --------------------------- | -------------------------------------------------- |
| `useDebounce`  | `src/hooks/useDebounce.ts`  | Generic debounce hook — delays value updates by Nms |

### Utilities

| Utility           | File                          | Description                                              |
| ----------------- | ----------------------------- | -------------------------------------------------------- |
| `extractProfiles` | `src/utils/dataHelpers.ts`    | Flattens nested JSON data into `ProfileSummary[]`        |
| `filterProfiles`  | `src/utils/dataHelpers.ts`    | Filters profiles by platform and search query            |
| `formatFollowers` | `src/utils/formatters.ts`     | Formats numbers to K/M/B notation (e.g., `2.5M`)        |
| `formatEngagementRate` | `src/utils/formatters.ts` | Formats decimal rates to percentage strings              |
| `loadProfile`     | `src/utils/profileLoader.ts`  | Dynamically imports profile detail JSON by username      |

---

## 🔮 What I'd Do With More Time

- Add **E2E tests with Playwright** for full user flow coverage
- Implement a **Cmd+K command palette** for power-user search
- Add an **influencer comparison feature** (side-by-side stats)
- Implement **virtual scrolling** for very large profile datasets
- Add a **manual dark/light mode toggle** with persistence
- **Deploy to Vercel** with preview environments on pull requests
- Add **pagination or infinite scroll** for the profile grid
- Implement **analytics tracking** for search queries and profile views
