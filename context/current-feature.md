# Current Feature

Stats & Sidebar - Replace mock data with real database data for stats cards and sidebar

## Status

Completed

## Goals

- Display stats pertaining to database data, keeping the current design/layout
- Display item types in sidebar with their icons, linking to /items/[typename]
- Add "View all collections" link under the collections list that goes to /collections
- Keep the star icons for favorite collections but for recents, each collection should show a colored circle based on the most-used item type in that collection
- Create `src/lib/db/items.ts` and add the database functions (use collections file for reference)

## Notes

- Reference: `src/lib/db/collections.ts`
- Stats and sidebar data should come from Prisma/Neon DB, not mock-data.ts

## History

- **Initial Setup** - Next.js 16, Tailwind CSS v4, TypeScript configured (Completed)
- **Dashboard UI Phase 1** - ShadCN UI initialization, dashboard route at /dashboard, main layout with dark mode, top bar with search and buttons, sidebar and main placeholders (Completed)
- **Dashboard UI Phase 2** - Collapsible sidebar with item type links, favorite/all collections, user avatar area, mobile drawer with backdrop, desktop collapse toggle (Completed)
- **Dashboard UI Phase 3** - Stats cards (items/collections/favorites), recent collections grid, pinned items list, 10 recent items list using mock data (Completed)
- **Database Setup** - Prisma 7 with Neon PostgreSQL, full schema (User, Item, ItemType, Collection, ItemCollection, Tag, NextAuth models), initial migration, system item types seeded (Completed)
- **Seed Data** - Demo user (demo@devstash.io), 7 system item types, 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) with 18 items across snippets, prompts, commands, and links (Completed)
- **Dashboard Collections** - Replaced mock collection data with real Prisma/Neon DB data; created `src/lib/db/collections.ts`, border color derived from dominant item type, type icons shown per collection, dashboard page converted to async server component (Completed)
- **Dashboard Items** - Replaced mock item data with real Prisma/Neon DB data; created `src/lib/db/items.ts` with `getPinnedItems`, `getRecentItems`, `getDashboardStats`; icon/border derived from item type; pinned section hidden when empty; stats cards wired to live counts (Completed)
- **Stats & Sidebar** - Wired sidebar item types and collections to real DB data; added `getSystemItemTypes()` to `src/lib/db/items.ts` and `getSidebarCollections()` to `src/lib/db/collections.ts`; sidebar item types link to `/items/[type]s` with live counts; favorite collections show star icon, recent collections show colored circle based on dominant item type; added "View all collections" link to `/collections`; refactored dashboard layout into server component + `DashboardShell` client component (Completed)
