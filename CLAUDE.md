# DevStash

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run production build
npm run lint     # run ESLint
```

## Stack

- **Next.js 16.2.4** with App Router (`src/app/`) — see AGENTS.md warning about breaking changes
- **React 19.2.4**
- **Tailwind CSS v4** — imported via `@import "tailwindcss"` in `globals.css`, configured through `postcss.config.mjs`
- **TypeScript**

## Architecture

Uses the Next.js App Router. All routes live under `src/app/`. The root layout (`src/app/layout.tsx`) sets up Geist Sans/Mono fonts as CSS variables and wraps pages in a full-height flex column body. Global styles are in `src/app/globals.css`.
