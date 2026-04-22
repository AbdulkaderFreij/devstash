import { PrismaClient, ContentType } from '../src/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const systemItemTypes = [
  { name: 'snippet', icon: 'Code', color: '#3b82f6', isSystem: true },
  { name: 'prompt', icon: 'Sparkles', color: '#8b5cf6', isSystem: true },
  { name: 'command', icon: 'Terminal', color: '#f97316', isSystem: true },
  { name: 'note', icon: 'StickyNote', color: '#fde047', isSystem: true },
  { name: 'file', icon: 'File', color: '#6b7280', isSystem: true },
  { name: 'image', icon: 'Image', color: '#ec4899', isSystem: true },
  { name: 'link', icon: 'Link', color: '#10b981', isSystem: true },
]

async function main() {
  console.log('Seeding system item types...')
  for (const type of systemItemTypes) {
    const existing = await prisma.itemType.findFirst({
      where: { name: type.name, userId: null },
    })
    if (!existing) {
      await prisma.itemType.create({ data: type })
    }
  }

  console.log('Seeding demo user...')
  const hashedPassword = await bcrypt.hash('12345678', 12)
  const user = await prisma.user.upsert({
    where: { email: 'demo@devstash.io' },
    update: {},
    create: {
      email: 'demo@devstash.io',
      name: 'Demo User',
      password: hashedPassword,
      isPro: false,
      emailVerified: new Date(),
    },
  })

  const getType = async (name: string) => {
    const type = await prisma.itemType.findFirst({ where: { name, userId: null } })
    if (!type) throw new Error(`Item type "${name}" not found`)
    return type
  }

  const snippetType = await getType('snippet')
  const promptType = await getType('prompt')
  const commandType = await getType('command')
  const linkType = await getType('link')

  console.log('Seeding collections and items...')

  // ── React Patterns ──────────────────────────────────────────────
  const reactCollection = await prisma.collection.upsert({
    where: { id: 'seed-react-patterns' },
    update: {},
    create: {
      id: 'seed-react-patterns',
      name: 'React Patterns',
      description: 'Reusable React patterns and hooks',
      userId: user.id,
    },
  })

  const reactItems = [
    {
      id: 'seed-react-1',
      title: 'Custom Hooks — useDebounce & useLocalStorage',
      contentType: ContentType.TEXT,
      language: 'typescript',
      content: `import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    }
  }

  return [storedValue, setValue] as const
}`,
    },
    {
      id: 'seed-react-2',
      title: 'Component Patterns — Context & Compound Components',
      contentType: ContentType.TEXT,
      language: 'typescript',
      content: `import { createContext, useContext, useState, ReactNode } from 'react'

// Context Provider Pattern
interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark') }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

// Compound Component Pattern
interface TabsProps { children: ReactNode; defaultTab: string }
interface TabProps { id: string; label: string; children: ReactNode }

const TabsContext = createContext<{ active: string; setActive: (id: string) => void } | null>(null)

export function Tabs({ children, defaultTab }: TabsProps) {
  const [active, setActive] = useState(defaultTab)
  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>
}

export function Tab({ id, label, children }: TabProps) {
  const ctx = useContext(TabsContext)!
  return (
    <div>
      <button onClick={() => ctx.setActive(id)} aria-selected={ctx.active === id}>{label}</button>
      {ctx.active === id && <div>{children}</div>}
    </div>
  )
}`,
    },
    {
      id: 'seed-react-3',
      title: 'Utility Functions — cn, formatDate, truncate',
      contentType: ContentType.TEXT,
      language: 'typescript',
      content: `import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(new Date(date))
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, wait: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}`,
    },
  ]

  for (const item of reactItems) {
    const created = await prisma.item.upsert({
      where: { id: item.id },
      update: {},
      create: { ...item, userId: user.id, itemTypeId: snippetType.id },
    })
    await prisma.itemCollection.upsert({
      where: { itemId_collectionId: { itemId: created.id, collectionId: reactCollection.id } },
      update: {},
      create: { itemId: created.id, collectionId: reactCollection.id },
    })
  }

  // ── AI Workflows ─────────────────────────────────────────────────
  const aiCollection = await prisma.collection.upsert({
    where: { id: 'seed-ai-workflows' },
    update: {},
    create: {
      id: 'seed-ai-workflows',
      name: 'AI Workflows',
      description: 'AI prompts and workflow automations',
      userId: user.id,
    },
  })

  const aiItems = [
    {
      id: 'seed-ai-1',
      title: 'Code Review Prompt',
      contentType: ContentType.TEXT,
      content: `You are an expert code reviewer. Review the following code and provide structured feedback:

1. **Correctness** — Does the code do what it's supposed to? Are there bugs or edge cases?
2. **Security** — Are there vulnerabilities (SQL injection, XSS, auth issues, etc.)?
3. **Performance** — Any unnecessary re-renders, N+1 queries, or inefficient algorithms?
4. **Readability** — Is the code easy to understand? Are names meaningful?
5. **Patterns** — Does it follow established patterns for this codebase/language?

Format your response as:
- 🔴 Critical issues (must fix)
- 🟡 Improvements (should fix)
- 🟢 Suggestions (nice to have)
- ✅ What was done well

Code to review:
\`\`\`
{PASTE_CODE_HERE}
\`\`\``,
    },
    {
      id: 'seed-ai-2',
      title: 'Documentation Generation Prompt',
      contentType: ContentType.TEXT,
      content: `Generate comprehensive documentation for the following code. Include:

- **Overview**: What does this module/function/component do?
- **Parameters/Props**: Document each with type, description, and whether required
- **Return value**: What is returned and when
- **Examples**: 2-3 practical usage examples
- **Edge cases**: Any gotchas or important behaviours to be aware of

Use JSDoc format for functions and MDX/Markdown for higher-level docs.

Code:
\`\`\`
{PASTE_CODE_HERE}
\`\`\``,
    },
    {
      id: 'seed-ai-3',
      title: 'Refactoring Assistance Prompt',
      contentType: ContentType.TEXT,
      content: `Refactor the following code to improve quality while preserving behaviour.

Goals (apply all that are relevant):
- Reduce duplication (DRY principle)
- Improve naming clarity
- Break large functions into focused, single-responsibility units
- Remove unnecessary complexity
- Improve TypeScript types (eliminate \`any\`, add generics where appropriate)
- Apply modern language features where they improve readability

Constraints:
- Do NOT change the public API or exported types
- Do NOT add new dependencies
- Keep the same file structure unless a split is clearly beneficial

Provide the refactored code followed by a brief explanation of the key changes made.

Code to refactor:
\`\`\`
{PASTE_CODE_HERE}
\`\`\``,
    },
  ]

  for (const item of aiItems) {
    const created = await prisma.item.upsert({
      where: { id: item.id },
      update: {},
      create: { ...item, userId: user.id, itemTypeId: promptType.id },
    })
    await prisma.itemCollection.upsert({
      where: { itemId_collectionId: { itemId: created.id, collectionId: aiCollection.id } },
      update: {},
      create: { itemId: created.id, collectionId: aiCollection.id },
    })
  }

  // ── DevOps ────────────────────────────────────────────────────────
  const devopsCollection = await prisma.collection.upsert({
    where: { id: 'seed-devops' },
    update: {},
    create: {
      id: 'seed-devops',
      name: 'DevOps',
      description: 'Infrastructure and deployment resources',
      userId: user.id,
    },
  })

  const devopsSnippet = await prisma.item.upsert({
    where: { id: 'seed-devops-snippet' },
    update: {},
    create: {
      id: 'seed-devops-snippet',
      title: 'Docker Multi-Stage Build & CI/CD Config',
      contentType: ContentType.TEXT,
      language: 'dockerfile',
      content: `# Dockerfile — multi-stage Next.js build
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]

---

# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}`,
      userId: user.id,
      itemTypeId: snippetType.id,
    },
  })

  const devopsCommand = await prisma.item.upsert({
    where: { id: 'seed-devops-command' },
    update: {},
    create: {
      id: 'seed-devops-command',
      title: 'Deployment Scripts',
      contentType: ContentType.TEXT,
      language: 'bash',
      content: `#!/bin/bash
# Zero-downtime deploy helper

set -euo pipefail

echo "Running migrations..."
npx prisma migrate deploy

echo "Building app..."
npm run build

echo "Restarting service..."
pm2 reload ecosystem.config.js --update-env

echo "Deploy complete ✓"`,
      userId: user.id,
      itemTypeId: commandType.id,
    },
  })

  const devopsLinks = [
    {
      id: 'seed-devops-link-1',
      title: 'Docker Documentation',
      contentType: ContentType.URL,
      url: 'https://docs.docker.com',
      description: 'Official Docker documentation — reference for Dockerfile syntax, CLI, and Compose',
    },
    {
      id: 'seed-devops-link-2',
      title: 'GitHub Actions Documentation',
      contentType: ContentType.URL,
      url: 'https://docs.github.com/en/actions',
      description: 'Official GitHub Actions docs — workflows, triggers, runners, and marketplace actions',
    },
  ]

  for (const item of [devopsSnippet, devopsCommand]) {
    await prisma.itemCollection.upsert({
      where: { itemId_collectionId: { itemId: item.id, collectionId: devopsCollection.id } },
      update: {},
      create: { itemId: item.id, collectionId: devopsCollection.id },
    })
  }

  for (const item of devopsLinks) {
    const created = await prisma.item.upsert({
      where: { id: item.id },
      update: {},
      create: { ...item, userId: user.id, itemTypeId: linkType.id },
    })
    await prisma.itemCollection.upsert({
      where: { itemId_collectionId: { itemId: created.id, collectionId: devopsCollection.id } },
      update: {},
      create: { itemId: created.id, collectionId: devopsCollection.id },
    })
  }

  // ── Terminal Commands ─────────────────────────────────────────────
  const terminalCollection = await prisma.collection.upsert({
    where: { id: 'seed-terminal-commands' },
    update: {},
    create: {
      id: 'seed-terminal-commands',
      name: 'Terminal Commands',
      description: 'Useful shell commands for everyday development',
      userId: user.id,
    },
  })

  const terminalItems = [
    {
      id: 'seed-term-1',
      title: 'Git Operations — Undo, Stash & Clean',
      contentType: ContentType.TEXT,
      language: 'bash',
      content: `# Undo last commit (keep changes staged)
git reset --soft HEAD~1

# Undo last commit (unstage changes)
git reset HEAD~1

# Discard all local changes
git checkout -- .

# Stash with a message
git stash push -m "WIP: feature description"

# Apply most recent stash and drop it
git stash pop

# Delete merged local branches
git branch --merged main | grep -v main | xargs git branch -d

# Interactive rebase last N commits
git rebase -i HEAD~3`,
    },
    {
      id: 'seed-term-2',
      title: 'Docker Commands — Container & Image Management',
      contentType: ContentType.TEXT,
      language: 'bash',
      content: `# Remove all stopped containers
docker container prune -f

# Remove unused images
docker image prune -a -f

# Remove everything (containers, images, volumes, networks)
docker system prune -a --volumes -f

# Follow logs of a running container
docker logs -f <container_name>

# Open shell inside running container
docker exec -it <container_name> sh

# List running containers with port mappings
docker ps --format "table {{.Names}}\t{{.Ports}}"

# Copy file from container to host
docker cp <container>:/path/to/file ./local-path`,
    },
    {
      id: 'seed-term-3',
      title: 'Process Management — Find & Kill Ports',
      contentType: ContentType.TEXT,
      language: 'bash',
      content: `# Find process using a port (macOS/Linux)
lsof -i :3000

# Kill process on a port
kill -9 $(lsof -ti :3000)

# Find process using a port (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# List all Node processes
ps aux | grep node

# Monitor CPU/memory in real time
top -o cpu

# Show listening ports
ss -tlnp          # Linux
netstat -an | grep LISTEN   # macOS`,
    },
    {
      id: 'seed-term-4',
      title: 'Package Manager Utilities — npm & pnpm',
      contentType: ContentType.TEXT,
      language: 'bash',
      content: `# Check for outdated packages
npm outdated

# Update all packages to latest (respects semver)
npm update

# Update a single package to latest
npm install package-name@latest

# Remove unused packages
npm prune

# Audit and fix vulnerabilities
npm audit fix

# List globally installed packages
npm list -g --depth=0

# Clear npm cache
npm cache clean --force

# Check which package provides a binary
npm which <binary>

# pnpm equivalents
pnpm outdated
pnpm update --latest
pnpm dlx npm-check-updates -u`,
    },
  ]

  for (const item of terminalItems) {
    const created = await prisma.item.upsert({
      where: { id: item.id },
      update: {},
      create: { ...item, userId: user.id, itemTypeId: commandType.id },
    })
    await prisma.itemCollection.upsert({
      where: { itemId_collectionId: { itemId: created.id, collectionId: terminalCollection.id } },
      update: {},
      create: { itemId: created.id, collectionId: terminalCollection.id },
    })
  }

  // ── Design Resources ──────────────────────────────────────────────
  const designCollection = await prisma.collection.upsert({
    where: { id: 'seed-design-resources' },
    update: {},
    create: {
      id: 'seed-design-resources',
      name: 'Design Resources',
      description: 'UI/UX resources and references',
      userId: user.id,
    },
  })

  const designLinks = [
    {
      id: 'seed-design-1',
      title: 'Tailwind CSS Documentation',
      contentType: ContentType.URL,
      url: 'https://tailwindcss.com/docs',
      description: 'Official Tailwind CSS docs — utility classes, configuration, and v4 migration guide',
    },
    {
      id: 'seed-design-2',
      title: 'shadcn/ui Components',
      contentType: ContentType.URL,
      url: 'https://ui.shadcn.com',
      description: 'Beautifully designed, accessible components built on Radix UI and Tailwind CSS',
    },
    {
      id: 'seed-design-3',
      title: 'Radix UI Primitives',
      contentType: ContentType.URL,
      url: 'https://www.radix-ui.com/primitives',
      description: 'Unstyled, accessible component primitives for building design systems',
    },
    {
      id: 'seed-design-4',
      title: 'Lucide Icons',
      contentType: ContentType.URL,
      url: 'https://lucide.dev/icons',
      description: 'Open-source icon library with 1000+ consistent SVG icons for React and more',
    },
  ]

  for (const item of designLinks) {
    const created = await prisma.item.upsert({
      where: { id: item.id },
      update: {},
      create: { ...item, userId: user.id, itemTypeId: linkType.id },
    })
    await prisma.itemCollection.upsert({
      where: { itemId_collectionId: { itemId: created.id, collectionId: designCollection.id } },
      update: {},
      create: { itemId: created.id, collectionId: designCollection.id },
    })
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
