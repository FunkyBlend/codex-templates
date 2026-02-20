# Codex Templates - Full Implementation Plan

## Overview
Build an OpenAI Codex template marketplace (modeled after aitmpl.com) using Next.js 14+ App Router, Tailwind CSS, PostgreSQL via Supabase/Prisma, and Zustand for client state.

**Branding**: "Codex Templates" for OpenAI Codex
**Categories**: agents, plugins, commands, settings, hooks, integrations, templates

---

## Phase 1: Project Setup & Configuration

### Step 1.1 - Initialize Next.js
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### Step 1.2 - Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/ssr prisma @prisma/client
npm install recharts lucide-react clsx tailwind-merge
npm install @radix-ui/react-select @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install zustand zod react-markdown rehype-highlight
```

### Step 1.3 - Directory Structure
```
src/
├── app/
│   ├── layout.tsx                    # Root layout (dark theme, fonts)
│   ├── page.tsx                      # Homepage
│   ├── globals.css                   # Tailwind + custom styles
│   ├── agents/page.tsx
│   ├── plugins/page.tsx
│   ├── commands/page.tsx
│   ├── settings/page.tsx
│   ├── hooks/page.tsx
│   ├── integrations/page.tsx
│   ├── templates/page.tsx
│   ├── trending/page.tsx
│   ├── blog/page.tsx
│   ├── blog/[slug]/page.tsx
│   ├── companies/page.tsx
│   ├── companies/[slug]/page.tsx
│   ├── featured/[slug]/page.tsx
│   └── api/
│       ├── components/route.ts
│       ├── components/[id]/route.ts
│       ├── components/search/route.ts
│       ├── companies/route.ts
│       ├── companies/[slug]/route.ts
│       ├── blog/route.ts
│       ├── blog/[slug]/route.ts
│       ├── featured/route.ts
│       ├── trending/route.ts
│       ├── analytics/download/route.ts
│       └── analytics/stats/route.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── home/
│   │   ├── AsciiHero.tsx
│   │   ├── FeaturedCarousel.tsx
│   │   ├── SearchFilterBar.tsx
│   │   ├── ComponentGrid.tsx
│   │   ├── CompanyGrid.tsx
│   │   ├── ToolsSection.tsx
│   │   └── BadgeRow.tsx
│   ├── cards/
│   │   ├── ComponentCard.tsx
│   │   ├── CompanyCard.tsx
│   │   ├── ToolCard.tsx
│   │   ├── FeaturedCard.tsx
│   │   └── BlogPostCard.tsx
│   ├── shared/
│   │   ├── CopyButton.tsx
│   │   ├── CategoryBadge.tsx
│   │   ├── DownloadCounter.tsx
│   │   ├── SearchInput.tsx
│   │   ├── SortDropdown.tsx
│   │   ├── CategoryDropdown.tsx
│   │   ├── EmptyState.tsx
│   │   └── LoadingSpinner.tsx
│   ├── stack-builder/
│   │   ├── StackBuilder.tsx
│   │   ├── StackCategoryCount.tsx
│   │   ├── StackCommandOutput.tsx
│   │   └── StackShareButtons.tsx
│   ├── trending/
│   │   ├── TrendingDashboard.tsx
│   │   ├── DownloadChart.tsx
│   │   ├── CategoryTrending.tsx
│   │   ├── TopCountries.tsx
│   │   └── TimeRangeToggle.tsx
│   └── blog/
│       ├── BlogList.tsx
│       ├── BlogFilters.tsx
│       └── DifficultyBadge.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── db/
│   │   ├── components.ts
│   │   ├── companies.ts
│   │   ├── blog.ts
│   │   ├── featured.ts
│   │   └── analytics.ts
│   ├── utils.ts
│   └── constants.ts
├── store/
│   └── stack-store.ts
├── types/
│   ├── component.ts
│   ├── company.ts
│   ├── blog.ts
│   ├── featured.ts
│   └── analytics.ts
└── hooks/
    ├── useDebounce.ts
    ├── useCopyToClipboard.ts
    └── useComponentSearch.ts
```

### Step 1.4 - Tailwind Config (Design System)
```
Primary Green:     #10a37f  (OpenAI green)
Accent Blue:       #2563eb
Background:        #0d1117  (dark, GitHub-style)
Card Surface:      #161b22
Border:            #30363d
Text Primary:      #e6edf3
Text Secondary:    #8b949e
Fonts Sans:        Inter
Fonts Mono:        JetBrains Mono / Fira Code
```

### Step 1.5 - Environment Variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
NEXT_PUBLIC_SITE_URL=
```

---

## Phase 2: Database Schema (Prisma)

### Tables:
1. **components** - name, slug, description, category (enum: 7 types), installCommand, downloads, isFeatured, companyId (FK), tags[], sourceUrl, timestamps
2. **companies** - name, slug, description, icon (emoji/URL), websiteUrl, timestamps
3. **featured_projects** - name, slug, tagline, description (text), logoUrl, websiteUrl, sponsorName, problemStatement, features (JSON), integrations (JSON), ctaText, ctaUrl, isActive, sortOrder, timestamps
4. **blog_posts** - title, slug, excerpt, content (text), difficulty (enum: basic/intermediate/advanced), isFeatured, publishedAt, timestamps
5. **download_events** - componentId (FK), country, createdAt

### Indexes:
- components: category, downloads DESC, companyId
- blog_posts: difficulty, publishedAt DESC
- download_events: componentId, createdAt, country

### Seed Data:
- 30+ companies (OpenAI, Anthropic, Stripe, AWS, GitHub, Vercel, Supabase, Shopify, Twilio, Salesforce, Slack, Discord, Notion, Linear, Figma, Firebase, MongoDB, Redis, Docker, Kubernetes, etc.)
- 50+ components across all 7 categories
- 3 featured projects
- 8-10 blog posts
- Sample download events

---

## Phase 3: Implementation Order (Page by Page)

### 3.1 - Root Layout + Header + Footer [Day 1]
- Dark theme `<html className="dark">`
- Inter + JetBrains Mono fonts via next/font
- Meta tags, OG image, JSON-LD structured data
- Header: Logo, Blog, Discord, GitHub nav links
- Footer: 4 columns (Product, Community, Resources, Copyright)

### 3.2 - Homepage [Days 2-5]
Build sections in order:
1. **AsciiHero** - Large ASCII art "CODEX TEMPLATES", tagline, npm badges
2. **BadgeRow** - shield.io badges (version, downloads, MIT license)
3. **FeaturedCarousel** - 3 featured projects with left/right arrows, auto-advance 8s
4. **SearchFilterBar** - SearchInput + CategoryDropdown + SortDropdown + results count
5. **ComponentGrid** - Responsive grid (1/2/3 cols), loading skeletons, pagination
6. **CompanyGrid** - Horizontal scroll, 8 companies + "View All 30+"
7. **ToolsSection** - 4 CLI tool cards (Analytics, Health Check, Conversation Monitor, Plugin Dashboard)
8. **StackBuilder** sidebar - Zustand-powered, category counts, command output, share/clear

### 3.3 - Category Pages [Days 6-7]
- Dynamic route: `src/app/[category]/page.tsx`
- Validates category param against enum
- Pre-filtered SearchFilterBar + ComponentGrid
- `generateStaticParams()` for all 7 categories

### 3.4 - Companies Pages [Days 8-9]
- `/companies` - Full grid of 30+ companies, searchable
- `/companies/[slug]` - Company detail with logo, description, filtered components

### 3.5 - Featured Project Pages [Day 10]
- `/featured/[slug]` - Hero, tagline, problem statement, features list, integrations, CTAs

### 3.6 - Trending Page [Days 11-13]
- Download growth chart (Recharts AreaChart)
- Time range toggle (Today/Week/Month)
- Category trending sections (top items per category)
- Top 5 countries by downloads

### 3.7 - Blog Pages [Days 14-15]
- `/blog` - Blog listing with featured section, difficulty sort
- `/blog/[slug]` - Full post with Markdown rendering + code highlighting

---

## Phase 4: API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/components` | GET | List + filter + sort + paginate |
| `/api/components` | POST | Create (admin) |
| `/api/components/[id]` | GET/PATCH | Single CRUD |
| `/api/components/search` | GET | Full-text search |
| `/api/companies` | GET | List all |
| `/api/companies/[slug]` | GET | Company + components |
| `/api/blog` | GET | List posts |
| `/api/blog/[slug]` | GET | Single post |
| `/api/featured` | GET | Active featured |
| `/api/featured/[slug]` | GET | Single featured |
| `/api/trending` | GET | Trending data by range |
| `/api/analytics/download` | POST | Record download |
| `/api/analytics/stats` | GET | Aggregate stats |

All routes: Zod validation, Prisma queries, consistent error shape, pagination metadata.

---

## Phase 5: State Management

### Client State (Zustand - stack-store.ts):
- Stack Builder selections (persisted to localStorage)
- addItem / removeItem / clearAll
- getCountByCategory / getGeneratedCommand / getShareText

### URL State (Next.js searchParams):
- Search query, category filter, sort order
- Makes searches shareable/bookmarkable

### Server State:
- React Server Components fetch directly via Prisma
- Client interactive sections use fetch() to API routes

---

## Phase 6: Key Component Specifications

### ComponentCard
- Name, description (2-line truncate), CategoryBadge, DownloadCounter
- Install command with CopyButton
- "Add to Stack" toggle button
- Dark card with border-subtle, hover elevation

### StackBuilder
- Right sidebar (320px) on desktop, bottom sheet on mobile
- Category counts with emoji icons
- Command output: `npx codex-templates@latest add [items]`
- Copy command + Share (X, Threads) + Clear All

### AsciiHero
- Pre-formatted ASCII block art for "CODEX TEMPLATES"
- OpenAI green (#10a37f) gradient
- Tagline: "Ready-to-use configurations for your OpenAI Codex projects"

### FeaturedCarousel
- 3 cards, horizontal scroll with arrow nav
- Each: logo, name, tagline, CTA arrow
- Auto-advance every 8 seconds

---

## Phase 7: Category System

```
agents:       🤖  text-blue-400
plugins:      🔌  text-purple-400
commands:     ⚡  text-yellow-400
settings:     ⚙️  text-gray-400
hooks:        🪝  text-orange-400
integrations: 🔗  text-green-400
templates:    🎨  text-pink-400
```

---

## Phase 8: Deployment

- **Hosting**: Vercel (auto-deploy from GitHub)
- **Database**: Supabase PostgreSQL
- **Static**: Homepage + category pages use ISR (revalidate: 3600)
- **Dynamic**: Trending page (no cache, real-time)
- **Blog**: Static generation at build time
- **Images**: next/image with Supabase remote patterns

---

## Phase 9: Performance Targets

- Lighthouse: 90+ on all metrics
- FCP < 1.5s, LCP < 2.5s
- Bundle: code-split per route
- Search: debounced 300ms, PostgreSQL GIN index
- Images: WebP via next/image optimization

---

## Summary: 60+ files, ~15 days estimated build time
