# Codex Templates Marketplace

## Project Overview
Full-stack OpenAI Codex template marketplace built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma, Zustand, Recharts, and Zod.

## Tech Stack
- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS (dark theme)
- **Database**: PostgreSQL via Prisma (schema in `prisma/schema.prisma`)
- **State**: Zustand (Stack Builder in `src/store/stackBuilder.ts`)
- **Charts**: Recharts (trending page)
- **Validation**: Zod (API routes in `src/lib/validations.ts`)
- **Icons**: Lucide React
- **Markdown**: react-markdown + react-syntax-highlighter (blog posts)

## Commands
- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- `npm run db:generate` — Generate Prisma client
- `npm run db:push` — Push schema to database
- `npm run db:seed` — Seed database (`tsx prisma/seed.ts`)

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage (hero, search, grid, companies, tools)
│   ├── layout.tsx          # Root layout (Header + Footer)
│   ├── globals.css         # Tailwind + custom styles
│   ├── [category]/         # Dynamic category pages (agents, plugins, etc.)
│   ├── companies/          # Company list + [slug] detail
│   ├── featured/[slug]/    # Featured project detail
│   ├── trending/           # Trending dashboard with Recharts
│   ├── blog/               # Blog list + [slug] detail with markdown
│   └── api/                # API routes (all Zod-validated)
│       ├── components/     # GET/POST + [id] GET/PATCH
│       ├── companies/      # GET + [slug] GET
│       ├── blog/           # GET + [slug] GET
│       ├── featured/       # GET + [slug] GET
│       ├── trending/       # GET with ?range=today|week|month
│       └── analytics/      # POST download, GET stats
├── components/
│   ├── layout/             # Header.tsx, Footer.tsx
│   ├── ComponentCard.tsx   # Reusable component card with add-to-stack
│   ├── SearchBar.tsx       # Search + category filter + sort dropdown
│   ├── FeaturedCarousel.tsx# Featured projects carousel
│   └── StackBuilder.tsx    # Desktop sidebar + mobile bottom sheet
├── lib/
│   ├── data.ts             # Static mock data (35 companies, 55 components, etc.)
│   ├── db.ts               # Prisma client singleton
│   ├── types.ts            # Category definitions, shared types
│   └── validations.ts      # Zod schemas for API validation
└── store/
    └── stackBuilder.ts     # Zustand store with localStorage persistence
prisma/
├── schema.prisma           # Database schema (Component, Company, etc.)
└── seed.ts                 # Seed script (excluded from tsconfig)
```

## Design System
- **Background**: `#0d1117` — Cards: `#161b22` — Borders: `#30363d` — Text: `#e6edf3`
- **Primary accent**: `#10a37f` (OpenAI green)
- **Secondary accent**: `#2563eb` (blue)
- **Fonts**: Inter (sans), JetBrains Mono (mono)
- **Tailwind classes**: `bg-dark-bg`, `bg-dark-card`, `border-dark-border`, `text-dark-text`, `text-dark-muted`, `text-accent-green`, `text-accent-blue`
- **Utility classes**: `.card`, `.btn-primary`, `.btn-secondary`, `.badge`, `.ascii-glow`

## 7 Categories
| Category | Emoji | Tailwind Color |
|----------|-------|----------------|
| Agents | 🤖 | `text-category-agents` (blue) |
| Plugins | 🔌 | `text-category-plugins` (purple) |
| Commands | ⚡ | `text-category-commands` (yellow) |
| Settings | ⚙️ | `text-category-settings` (gray) |
| Hooks | 🪝 | `text-category-hooks` (orange) |
| Integrations | 🔗 | `text-category-integrations` (green) |
| Templates | 🎨 | `text-category-templates` (pink) |

## Data Layer
The app currently uses static mock data from `src/lib/data.ts` for all pages. When a PostgreSQL database is connected (via `DATABASE_URL` in `.env`), the API routes can be updated to use Prisma queries instead. The seed file at `prisma/seed.ts` populates the database with matching data.

## Key Patterns
- All client components use `'use client'` directive
- Search uses 300ms debounce via `useEffect` + `setTimeout`
- Stack Builder persists to localStorage via Zustand `persist` middleware
- Download tracking fires `POST /api/analytics/download` on copy-command click
- Blog posts render markdown with syntax-highlighted code blocks
- The `[category]` dynamic route handles all 7 category pages

## Deployment

**Production server**: Singapore — `167.71.205.41`  
**Live URL**: `http://167.71.205.41`  
**App directory**: `/opt/codex-marketplace`  
**Process manager**: PM2 (`codex-marketplace`, port `3001`)  
**Reverse proxy**: Nginx → port 80  

### SSH Access
Server is jump-hosted via New York:
```bash
ssh -J flashadmin@159.65.246.230 flashadmin@167.71.205.41
```

### Useful PM2 Commands
```bash
pm2 status                  # Check if app is running
pm2 logs codex-marketplace  # View app logs
pm2 restart codex-marketplace
```

### Re-deploy (from project root on Windows)
```bash
# 1. Create source archive (excludes node_modules, .next, .git, .env)
tar -czf "$env:TEMP\codex.tar.gz" --exclude='./.next' --exclude='./node_modules' --exclude='./.git' --exclude='./.env' .

# 2. Upload via jump host
scp -o "ProxyJump=flashadmin@159.65.246.230" "$env:TEMP\codex.tar.gz" flashadmin@167.71.205.41:/opt/codex-marketplace/codex.tar.gz

# 3. SSH in and run
ssh -J flashadmin@159.65.246.230 flashadmin@167.71.205.41
cd /opt/codex-marketplace && tar -xzf codex.tar.gz && rm codex.tar.gz
npm ci && npm run build
pm2 restart codex-marketplace
```

### Key Deploy Files
- `ecosystem.config.js` — PM2 config (port 3001, 1 instance)
- `deploy/nginx-codex.conf` — Nginx reverse proxy config
- `deploy/server-setup.sh` — First-time server setup script
- `deploy/.env.production` — Production env (no DB needed; app uses static mock data)

### Notes
- `autoprefixer`, `postcss`, `tailwindcss` are in `dependencies` (not devDependencies) — Next.js needs them at build time
- No database configured; app runs entirely on static mock data from `src/lib/data.ts`
