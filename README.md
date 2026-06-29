# Wobb Frontend Assignment — Influencer Discovery Platform

A modern, polished influencer discovery app built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **Zustand**. Completely redesigned from the starter scaffold with bug fixes, state management, performance optimizations, and premium UI/UX.

<!-- If deployed, paste live URL here:
🔗 **Live Demo:** [https://your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)
-->

---

## ✅ What Was Done

### 1. Bugs Found & Fixed

| # | Bug | File | Fix |
|---|-----|------|-----|
| 1 | **`npm install` fails** — `react-beautiful-dnd@13.1.1` requires React ≤18 but project uses React 19 | `package.json` | Replaced with `@hello-pangea/dnd` (maintained fork, same API, React 19 compatible) |
| 2 | **Case-sensitive username search** — searching "MR" wouldn't match `mrbeast` | `dataHelpers.ts` | Added `.toLowerCase()` to both sides of the username comparison |
| 3 | **Engagement rate off by 100×** — inline `rate * 10000` instead of `rate * 100` | `ProfileDetailPage.tsx` | Replaced with `formatEngagementRate()` from shared formatters |
| 4 | **"Engagements" card shows rate instead of count** — displayed `formatEngagementRate()` instead of actual `user.engagements` value | `ProfileDetailPage.tsx` | Now displays the real engagements count using `formatFollowers()` |
| 5 | **Duplicate follower formatters** — `formatFollowersLocal()` and `formatFollowersDetail()` reinvented `formatFollowers()` | `ProfileCard.tsx`, `ProfileDetailPage.tsx` | Deleted duplicates, imported shared `formatFollowers()` from `formatters.ts` |
| 6 | **Dead `SearchBar.tsx` component** — fully built but never imported anywhere | `SearchBar.tsx` | Deleted; `PlatformFilter` already had its own search input |
| 7 | **Missing alt text on all `<img>` tags** — accessibility violation | `ProfileCard.tsx`, `ProfileDetailPage.tsx` | Added descriptive alt attributes |
| 8 | **Hardcoded `w-[700px]`** — breaks on mobile/tablet screens | `ProfileCard.tsx` | Replaced with responsive `w-full` |
| 9 | **Dead `clickCount` state** — useState + console.log doing nothing | `SearchPage.tsx` | Removed entirely |
| 10 | **Pointless `data-search` DOM attribute** — search query dumped on every card's DOM | `ProfileCard.tsx` | Removed |
| 11 | **No 404 route** — navigating to `/anything` showed a blank page | `App.tsx` | Added catch-all `<Route path="*">` with styled 404 page |
| 12 | **No memoization** — `extractProfiles`/`filterProfiles` recomputed on every render | `SearchPage.tsx` | Wrapped in `useMemo` with proper dependency arrays |

### 2. UI/UX Redesign

- **Brand identity**: Prussian Blue (#1F4072) + Butter Yellow (#FFF3B4) color palette
- **Typography**: Inter font from Google Fonts
- **Responsive layout**: 2-column grid on desktop, single column on mobile
- **Modern card design**: Rounded corners, subtle shadows, hover elevation effects
- **Animated transitions**: Framer Motion page transitions + stagger animations on card lists
- **Skeleton loaders**: Shimmer loading states instead of plain "Loading..." text
- **Beautiful empty states**: Custom icons and messaging for no results / empty list
- **Dark mode**: Full dark mode support via `prefers-color-scheme` media query
- **Sticky navigation**: Persistent branded navbar with Prussian Blue background
- **Toast notifications**: Non-intrusive feedback on add/remove actions

### 3. Zustand State Management

- Replaced the (non-existent) React Context with **Zustand** store
- `persist` middleware saves the list to `localStorage` automatically
- Survives page refreshes — your list is always there
- Store in `src/store/useListStore.ts`

### 4. "Add to List" Feature

- **Add/Remove toggle** on both `ProfileCard` and `ProfileDetailPage`
- **Duplicate prevention** by `user_id`
- **Slide-over drawer** to view and manage the saved list
- **Drag-to-reorder** using `@hello-pangea/dnd`
- **Export as CSV or JSON** download
- **Clear All** with confirmation toast
- **Count badge** in the navbar showing saved profile count

### 5. Code Quality

- Deleted dead code (`SearchBar.tsx`, `clickCount`, `data-search`)
- Eliminated all duplicate utility functions
- Strict TypeScript — zero `any` types
- Proper folder structure: `store/`, `hooks/`, `components/`, `pages/`, `utils/`, `types/`
- `React.memo` on `ProfileCard` to prevent unnecessary re-renders
- `useCallback` on all event handlers
- Clean, focused components with single responsibilities

### 6. Performance Optimizations

- **Debounced search**: Custom `useDebounce` hook (250ms) prevents re-filtering on every keystroke
- **Memoized data**: `useMemo` on `extractProfiles` and `filterProfiles`
- **Code splitting**: `React.lazy` + `Suspense` for `ProfileDetailPage` (separate chunk)
- **Lazy image loading**: `loading="lazy"` on all profile images
- **`React.memo`** on `ProfileCard` to skip re-renders when props haven't changed

### 7. Bonus Features

- **Drag-to-reorder** the saved list (using `@hello-pangea/dnd`)
- **Export list as CSV/JSON** — ready for real-world use
- **19 unit tests** with Vitest covering store logic, search filter regression, and formatters
- **GitHub Actions CI** — lint + build + test on every push
- **Accessibility**: ARIA labels, semantic HTML (`nav`, `main`, `aside`), keyboard navigation, focus-visible styles
- **Selection styling** matching brand colors

---

## 🛠 Libraries Added

| Library | Why |
|---------|-----|
| `zustand` | State management (assignment requirement) with `persist` middleware for localStorage |
| `@hello-pangea/dnd` | Drop-in replacement for abandoned `react-beautiful-dnd` — React 19 compatible, same API. Used for drag-to-reorder |
| `framer-motion` | Smooth page transitions, stagger animations, drawer slide-in |
| `react-hot-toast` | Lightweight toast notifications for add/remove feedback |
| `lucide-react` | Modern, tree-shakeable icon library |
| `vitest` | Fast, Vite-native test runner |
| `@testing-library/react` | DOM testing utilities for React components |

---

## 📋 Assumptions & Trade-offs

1. **No actual React Context existed** in the starter code. The assignment says "replace Context with Zustand" but no Context provider was present. I built state management from scratch with Zustand, which is the intended outcome.

2. **Profile detail data only exists for 5 out of 30 profiles** (`cristiano`, `instagram`, `khaby.lame`, `mrbeast`, `MrBeast6000`, `tseries`). I added a graceful "Profile not found" empty state for profiles without detail JSON.

3. **`react-beautiful-dnd` → `@hello-pangea/dnd`**: This is the community-maintained fork recommended by Atlassian (the original creators). The API is identical — it's a 1-line import change. This fixes the React 19 peer dependency conflict and gives us drag-to-reorder as a feature.

4. **Dark mode** is automatic via `prefers-color-scheme`. No manual toggle was added to keep the UI clean, though one could easily be added.

5. **Chunk size warning** in production build is from the large JSON data files (profile data), not from application code. In a real app, this data would come from an API.

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run all tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run preview` | Preview production build |

---

## 🧪 Test Results

```
 ✓ src/__tests__/useListStore.test.ts (8 tests)
 ✓ src/__tests__/searchAndFormatters.test.ts (11 tests)

 Test Files  2 passed (2)
      Tests  19 passed (19)
```

---

## What I'd Do With More Time

- Add E2E tests with Playwright
- Implement a Cmd+K command palette for power-user search
- Add influencer comparison feature (side-by-side stats)
- Implement virtual scrolling for very large lists
- Add a manual dark/light mode toggle
- Deploy to Vercel with preview environments on PRs
