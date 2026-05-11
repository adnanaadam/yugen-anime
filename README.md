# Yugen Anime

A minimalist anime tracking platform with progress tracking, gamification, and social profiles.

## Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL (Neon) + Prisma
- **Authentication**: Auth.js
- **API Integration**: AniList API

## Project Structure

```
src/
├── app/
│   ├── (public)/                     # Public-facing routes
│   │   ├── page.tsx                  # Home page
│   │   ├── explore/
│   │   │   └── page.tsx              # Browse/discover anime
│   │   ├── anime/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # Anime detail page (dynamic)
│   │   │   └── search/
│   │   │       └── page.tsx          # Search results page
│   │   └── layout.tsx                # Public layout wrapper
│   │
│   ├── (auth)/                       # Authentication routes
│   │   ├── signin/
│   │   │   └── page.tsx              # Sign-in page
│   │   ├── signup/
│   │   │   └── page.tsx              # Sign-up page
│   │   └── layout.tsx                # Auth layout (centered content)
│   │
│   ├── (dashboard)/                  # Authenticated user routes
│   │   ├── dashboard/
│   │   │   └── page.tsx              # User dashboard overview
│   │   ├── library/
│   │   │   └── page.tsx              # User's anime library
│   │   ├── profile/
│   │   │   └── page.tsx              # User profile
│   │   ├── settings/
│   │   │   └── page.tsx              # User settings
│   │   └── layout.tsx                # Dashboard layout (sidebar nav)
│   │
│   ├── api/                          # API route handlers
│   │   ├── auth/                     # Authentication endpoints
│   │   ├── anime/                    # Anime data endpoints
│   │   ├── user/                     # User data endpoints
│   │   └── tracking/                 # Tracking/progress endpoints
│   │
│   └── layout.tsx                    # Root layout (fonts, base styles)
│
├── components/
│   ├── ui/                           # Reusable UI primitives (buttons, inputs, cards, etc.)
│   ├── layout/                       # Layout components (navbar, footer, sidebar)
│   ├── anime/                        # Anime-specific components (cards, grids, detail sections)
│   ├── profile/                      # Profile-related components
│   └── common/                       # Shared components (loaders, error boundaries, etc.)
│
├── features/                         # Feature modules (domain-driven structure)
│   ├── anime/
│   │   ├── api.ts                    # Anime API functions
│   │   ├── hooks.ts                  # Anime React hooks
│   │   ├── types.ts                  # Anime TypeScript types
│   │   └── utils.ts                  # Anime utilities (formatting, labels)
│   │
│   ├── user/
│   │   ├── api.ts                    # User API functions
│   │   ├── hooks.ts                  # User React hooks
│   │   └── types.ts                  # User TypeScript types
│   │
│   ├── tracking/
│   │   ├── api.ts                    # Tracking API functions
│   │   ├── hooks.ts                  # Tracking React hooks
│   │   └── types.ts                  # Tracking TypeScript types
│   │
│   ├── gamification/
│   │   └── types.ts                  # XP, levels, and achievements types
│   │
│   └── auth/
│       └── types.ts                  # Auth session and credentials types
│
├── lib/                              # Core utilities and configurations
│   ├── prisma.ts                     # Prisma client singleton
│   ├── auth.ts                       # Auth.js configuration
│   ├── anilist.ts                    # AniList GraphQL client
│   └── utils.ts                      # General utilities (cn, formatDate, truncate)
│
├── services/                         # External service integrations
│   └── anilist.service.ts            # AniList API service (queries, mutations)
│
├── hooks/                            # Global hooks (re-exports from features)
│   ├── useAnime.ts                   # Re-exports anime hooks
│   ├── useUser.ts                    # Re-exports user hooks
│   └── useProgress.ts                # Re-exports tracking hooks
│
├── store/                            # State management (future: Zustand/Context)
│
├── types/                            # Global type re-exports
│   ├── anime.ts                      # Re-exports from features/anime
│   ├── user.ts                       # Re-exports from features/user
│   └── global.ts                     # Cross-feature type aggregator
│
├── styles/                           # Global styles and theme
│
└── middleware.ts                     # Next.js middleware (auth guards, redirects)
```

## Key Conventions

### Route Groups

- **`(public)`** — Unauthenticated pages anyone can visit
- **`(auth)`** — Authentication pages (sign-in, sign-up)
- **`(dashboard)`** — Authenticated pages requiring a session

### Feature Modules

Each feature is self-contained with its own `api.ts`, `hooks.ts`, `types.ts`, and optionally `utils.ts`. This keeps related code co-located and makes features easy to add, remove, or refactor.

### Components

Components are organized by domain:
- `ui/` — Generic, reusable UI primitives
- `layout/` — Page layout components
- `anime/`, `profile/` — Domain-specific components
- `common/` — Shared components used across domains

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```env
# Database
DATABASE_URL=

# Auth
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

## Planned Features

- Anime tracking (watching, completed, paused, dropped, plan to watch)
- Episode-level progress tracking
- XP and leveling system with achievements
- Public user profiles with shared anime lists
- AniList import/export integration
- Social features (friends, comparisons)