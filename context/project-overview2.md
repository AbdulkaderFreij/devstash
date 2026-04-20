# DevStash — Project Overview

> **One fast, searchable, AI-enhanced hub for all your dev knowledge & resources.**

---

## Table of Contents

1. [Problem & Vision](#problem--vision)
2. [Target Users](#target-users)
3. [Tech Stack](#tech-stack)
4. [Data Models & Prisma Schema](#data-models--prisma-schema)
5. [Entity Relationship Diagram](#entity-relationship-diagram)
6. [Features](#features)
7. [Item Types](#item-types)
8. [Monetization](#monetization)
9. [UI/UX Guidelines](#uiux-guidelines)
10. [URL Structure](#url-structure)

---

## Problem & Vision

Developers keep their essentials scattered across too many places:

| Where | What lives there |
|---|---|
| VS Code / Notion | Code snippets |
| AI chat history | Prompts & system messages |
| Project folders | Context files |
| Browser bookmarks | Useful links |
| Random folders | Docs & references |
| `.txt` files | Commands |
| GitHub Gists | Project templates |
| Bash history | Terminal commands |

This creates **context switching**, **lost knowledge**, and **inconsistent workflows**.

DevStash solves this with a single, fast, keyboard-friendly hub — think [Raycast](https://www.raycast.com/) meets [Notion](https://www.notion.so/), built for developers.

---

## Target Users

| User | Primary Need |
|---|---|
| **Everyday Developer** | Quickly grab snippets, prompts, commands, and links |
| **AI-first Developer** | Save prompts, contexts, workflows, and system messages |
| **Content Creator / Educator** | Store code blocks, explanations, and course notes |
| **Full-stack Builder** | Collect patterns, boilerplates, and API examples |

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) / [React 19](https://react.dev/) | SSR + API routes in one repo |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict mode |
| **Database** | [Neon](https://neon.tech/) (PostgreSQL) | Serverless Postgres |
| **ORM** | [Prisma 7](https://www.prisma.io/) | Always use migrations — never `db push` |
| **Auth** | [NextAuth v5](https://authjs.dev/) | Email/password + GitHub OAuth |
| **File Storage** | [Cloudflare R2](https://developers.cloudflare.com/r2/) | S3-compatible, cheap egress |
| **AI** | [OpenAI](https://platform.openai.com/) `gpt-4o-mini` | Pro-only features |
| **CSS** | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Dark mode default |
| **Caching** | Redis (TBD) | Optional, for search/session caching |

> ⚠️ **Migration rule:** Never run `prisma db push` against any environment. Always generate and run proper migrations.

---

## Data Models & Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Auth (NextAuth v5) ──────────────────────────────────────────────────────

model User {
  id                    String    @id @default(cuid())
  name                  String?
  email                 String    @unique
  emailVerified         DateTime?
  image                 String?
  password              String?   // hashed, null for OAuth users

  isPro                 Boolean   @default(false)
  stripeCustomerId      String?   @unique
  stripeSubscriptionId  String?   @unique

  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  accounts    Account[]
  sessions    Session[]
  items       Item[]
  collections Collection[]
  itemTypes   ItemType[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─── Core Domain ─────────────────────────────────────────────────────────────

model Item {
  id          String   @id @default(cuid())
  title       String
  description String?
  
  // Content
  contentType ContentType // TEXT | FILE
  content     String?     @db.Text // null if FILE
  language    String?     // e.g. "typescript", "python" — for code highlighting
  url         String?     // for LINK type items only

  // File (R2)
  fileUrl     String?     // Cloudflare R2 URL
  fileName    String?     // original filename
  fileSize    Int?        // bytes

  // Meta
  isFavorite  Boolean  @default(false)
  isPinned    Boolean  @default(false)
  lastUsedAt  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  itemTypeId  String
  itemType    ItemType @relation(fields: [itemTypeId], references: [id])

  tags        TagsOnItems[]
  collections ItemCollection[]
}

model ItemType {
  id       String  @id @default(cuid())
  name     String  // "snippet" | "prompt" | "note" | "command" | "file" | "image" | "link"
  slug     String  // url-safe, e.g. "snippet"
  icon     String  // Lucide icon name, e.g. "Code"
  color    String  // hex, e.g. "#3b82f6"
  isSystem Boolean @default(false) // system types can't be deleted/edited

  userId   String?  // null for system types
  user     User?    @relation(fields: [userId], references: [id], onDelete: Cascade)

  items    Item[]

  @@unique([slug, userId]) // prevent duplicate slugs per user
}

model Collection {
  id            String   @id @default(cuid())
  name          String
  description   String?
  isFavorite    Boolean  @default(false)
  
  defaultTypeId String?  // preferred type for display/filtering

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  userId  String
  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items   ItemCollection[]
}

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item       Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique

  items TagsOnItems[]
}

model TagsOnItems {
  itemId String
  tagId  String

  item Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([itemId, tagId])
}

// ─── Enums ────────────────────────────────────────────────────────────────────

enum ContentType {
  TEXT
  FILE
  URL
}
```

---

## Entity Relationship Diagram

```
┌──────────┐       ┌──────────┐       ┌───────────────┐
│   User   │──────<│   Item   │>──────│ ItemCollection│
└──────────┘       └────┬─────┘       └───────┬───────┘
     │                  │                     │
     │             ┌────┴─────┐         ┌─────┴──────┐
     │             │ ItemType │         │ Collection │
     │             └──────────┘         └────────────┘
     │                  │
     │             ┌────┴─────┐
     │             │TagsOnItem│
     │             └────┬─────┘
     │                  │
     │             ┌────┴──┐
     └────────────>│  Tag  │
                   └───────┘
```

- One **User** has many **Items**, **Collections**, and custom **ItemTypes**
- An **Item** belongs to one **ItemType** and can be in many **Collections** (via `ItemCollection`)
- An **Item** can have many **Tags** (via `TagsOnItems`)
- System **ItemTypes** have `userId = null` and are shared across all users

---

## Features

### A — Items

Items are the core unit of DevStash. Each item has a **type**, optional **tags**, and can belong to multiple **collections**.

- Quick-create via a slide-in **drawer** (no page navigation required)
- Markdown editor for `TEXT` content types
- File upload (drag & drop) for `FILE` content types
- Syntax highlighting for code via language field
- Import content directly from a file
- Pin items to keep them at the top
- Mark items as favourite
- "Recently used" tracking via `lastUsedAt`

### B — Collections

Group items into named collections. An item can belong to **multiple** collections simultaneously.

```
"React Patterns"    → snippets, notes
"Context Files"     → files
"Python Snippets"   → snippets
"Interview Prep"    → snippets, notes, commands
```

- Collections display as colour-coded cards in the main grid
- Card background colour is derived from the **dominant item type** in that collection
- Individual items display as colour-coded cards with a **border** in the type colour

### C — Search

Full-text search across:
- Item title
- Item content
- Tags
- Item type name

### D — Authentication

Powered by **NextAuth v5**:
- Email + password (hashed with bcrypt)
- GitHub OAuth

### E — Other Features

| Feature | Notes |
|---|---|
| Favourites | Items and collections |
| Pin to top | Items only |
| Recently used | Tracked via `lastUsedAt` |
| Import from file | Pastes file content into editor |
| Markdown editor | For `TEXT` content types |
| File upload | For `FILE` / `IMAGE` types (Pro) |
| Export data | JSON / ZIP (Pro) |
| Dark mode | Default; light mode toggle available |
| Multi-collection | Add/remove items to multiple collections |
| Collection membership view | See which collections an item belongs to |

### F — AI Features (Pro only)

| Feature | Description |
|---|---|
| **Auto-tag suggestions** | Suggests relevant tags on save |
| **AI Summary** | One-line summary of any item |
| **Explain This Code** | Plain-English explanation of a snippet |
| **Prompt Optimizer** | Rewrites saved prompts for better results |

All AI features use `gpt-4o-mini` via the OpenAI API.

---

## Item Types

### System Types (non-editable)

| Type | Slug | Icon (Lucide) | Color | Content Type |
|---|---|---|---|---|
| Snippet | `snippet` | `Code` | `#3b82f6` (blue) | TEXT |
| Prompt | `prompt` | `Sparkles` | `#8b5cf6` (purple) | TEXT |
| Note | `note` | `StickyNote` | `#fde047` (yellow) | TEXT |
| Command | `command` | `Terminal` | `#f97316` (orange) | TEXT |
| Link | `link` | `Link` | `#10b981` (emerald) | URL |
| File | `file` | `File` | `#6b7280` (gray) | FILE — *Pro only* |
| Image | `image` | `Image` | `#ec4899` (pink) | FILE — *Pro only* |

> Custom types (user-defined) are a **future Pro feature**.

---

## Monetization

### Free Tier

- 50 items total
- 3 collections
- All system types **except** File & Image
- Basic search
- No file/image uploads
- No AI features

### Pro — $8/month or $72/year (~25% savings)

- Unlimited items
- Unlimited collections
- File & Image uploads (via Cloudflare R2)
- Custom item types *(coming later)*
- AI auto-tagging
- AI code explanation
- AI prompt optimizer
- Export data (JSON / ZIP)
- Priority support

> **Dev note:** During development, all users have full Pro access. The `isPro` flag and Stripe fields are scaffolded but not enforced until billing is wired up.

Payments via **Stripe** — track with `stripeCustomerId` and `stripeSubscriptionId` on the User model.

---

## UI/UX Guidelines

### Design Principles

- Modern, minimal, developer-focused
- Dark mode by default (light mode optional)
- Clean typography, generous whitespace
- Subtle borders and shadows
- References: [Notion](https://notion.so), [Linear](https://linear.app), [Raycast](https://raycast.com)
- Syntax highlighting for all code blocks

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Sidebar (collapsible)   │  Main Content                │
│                          │                              │
│  Item Types              │  Collections Grid            │
│  ├─ Snippets             │  ┌──────┐ ┌──────┐ ┌──────┐ │
│  ├─ Prompts              │  │ Coll │ │ Coll │ │ Coll │ │
│  ├─ Commands             │  └──────┘ └──────┘ └──────┘ │
│  ├─ Notes                │                              │
│  ├─ Links                │  Items in Selected Collection│
│  └─ ...                  │  ┌──────┐ ┌──────┐          │
│                          │  │ Item │ │ Item │          │
│  Collections             │  └──────┘ └──────┘          │
│  ├─ React Patterns       │                              │
│  ├─ Python Snippets      │                 [+ New Item] │
│  └─ ...                  │                              │
└─────────────────────────────────────────────────────────┘
```

- Sidebar becomes a **drawer** on mobile
- Items open in a **slide-in drawer** (not a new page)
- Collection cards: background colour = dominant item type colour
- Item cards: left border colour = item type colour

### Micro-interactions

- Smooth slide transitions on drawers
- Hover states on all cards
- Toast notifications for create / update / delete / copy actions
- Loading skeletons (never blank screens)

### Responsive

- Desktop-first
- Mobile: sidebar collapses to hamburger drawer; grid becomes single column

---

## URL Structure

```
/                          → Dashboard / Home
/items                     → All items
/items/snippets            → Snippets
/items/prompts             → Prompts
/items/commands            → Commands
/items/notes               → Notes
/items/links               → Links
/items/files               → Files (Pro)
/items/images              → Images (Pro)
/collections               → All collections
/collections/[id]          → Single collection view
/settings                  → User settings
/settings/billing          → Subscription & billing
/api/items                 → Items API
/api/collections           → Collections API
/api/upload                → File upload endpoint (R2)
/api/ai/tag                → AI auto-tag
/api/ai/explain            → AI explain code
/api/ai/summarize          → AI summary
/api/ai/optimize-prompt    → AI prompt optimizer
```
