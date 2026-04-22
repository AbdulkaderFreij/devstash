// Single source of truth for mock dashboard data (used until database is wired up)

export type ContentType = 'TEXT' | 'FILE' | 'URL';

export type ItemTypeName =
  | 'snippet'
  | 'prompt'
  | 'command'
  | 'note'
  | 'file'
  | 'image'
  | 'link';

export interface ItemType {
  id: string;
  name: ItemTypeName;
  icon: string;
  color: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  content?: string;
  url?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  language?: string;
  isFavorite: boolean;
  isPinned: boolean;
  itemType: ItemType;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  itemCount: number;
  items: Item[];
  createdAt: string;
  updatedAt: string;
}

// ─── Item Types ────────────────────────────────────────────────────────────────

export const ITEM_TYPES: ItemType[] = [
  { id: 'type-snippet', name: 'snippet', icon: 'Code',       color: '#3b82f6' },
  { id: 'type-prompt',  name: 'prompt',  icon: 'Sparkles',   color: '#8b5cf6' },
  { id: 'type-command', name: 'command', icon: 'Terminal',   color: '#f97316' },
  { id: 'type-note',    name: 'note',    icon: 'StickyNote', color: '#fde047' },
  { id: 'type-file',    name: 'file',    icon: 'File',       color: '#6b7280' },
  { id: 'type-image',   name: 'image',   icon: 'Image',      color: '#ec4899' },
  { id: 'type-link',    name: 'link',    icon: 'Link',       color: '#10b981' },
];

// ─── Items ─────────────────────────────────────────────────────────────────────

export const MOCK_ITEMS: Item[] = [
  {
    id: 'item-1',
    title: 'useAuth Hook',
    description: 'Custom authentication hook for React applications',
    contentType: 'TEXT',
    content: `import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth({ required = false } = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (required && status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [required, status, router]);

  return { session, status, isLoading: status === 'loading' };
}`,
    language: 'typescript',
    isFavorite: true,
    isPinned: true,
    itemType: ITEM_TYPES[0],
    tags: [
      { id: 'tag-react', name: 'react' },
      { id: 'tag-auth',  name: 'auth' },
      { id: 'tag-hooks', name: 'hooks' },
    ],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'item-2',
    title: 'API Error Handling Pattern',
    description: 'Fetch wrapper with exponential backoff retry logic',
    contentType: 'TEXT',
    content: `async function fetchWithRetry(url: string, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 2 ** i * 500));
    }
  }
}`,
    language: 'typescript',
    isFavorite: false,
    isPinned: true,
    itemType: ITEM_TYPES[0],
    tags: [
      { id: 'tag-api',   name: 'api' },
      { id: 'tag-error', name: 'error-handling' },
      { id: 'tag-fetch', name: 'fetch' },
    ],
    createdAt: '2025-01-12T09:00:00Z',
    updatedAt: '2025-01-12T09:00:00Z',
  },
  {
    id: 'item-3',
    title: 'Code Review Prompt',
    description: 'Structured prompt for thorough AI code reviews',
    contentType: 'TEXT',
    content: `Review the following code for:
1. Security vulnerabilities (XSS, SQL injection, auth bypass)
2. Performance issues (N+1 queries, unnecessary re-renders)
3. Logic errors and edge cases
4. Code style and best practices
5. Test coverage gaps

Provide specific line references and suggested fixes.`,
    isFavorite: true,
    isPinned: false,
    itemType: ITEM_TYPES[1],
    tags: [
      { id: 'tag-code-review', name: 'code-review' },
      { id: 'tag-ai',          name: 'ai' },
    ],
    createdAt: '2025-01-10T14:00:00Z',
    updatedAt: '2025-01-10T14:00:00Z',
  },
  {
    id: 'item-4',
    title: 'git reset --hard HEAD~1',
    description: 'Undo the last commit, discarding all changes',
    contentType: 'TEXT',
    content: 'git reset --hard HEAD~1',
    language: 'bash',
    isFavorite: false,
    isPinned: false,
    itemType: ITEM_TYPES[2],
    tags: [
      { id: 'tag-git',  name: 'git' },
      { id: 'tag-undo', name: 'undo' },
    ],
    createdAt: '2025-01-08T11:00:00Z',
    updatedAt: '2025-01-08T11:00:00Z',
  },
  {
    id: 'item-5',
    title: 'Docker Compose Up',
    description: 'Start all services defined in docker-compose.yml',
    contentType: 'TEXT',
    content: 'docker compose up -d --build',
    language: 'bash',
    isFavorite: false,
    isPinned: false,
    itemType: ITEM_TYPES[2],
    tags: [
      { id: 'tag-docker', name: 'docker' },
      { id: 'tag-devops', name: 'devops' },
    ],
    createdAt: '2025-01-07T08:00:00Z',
    updatedAt: '2025-01-07T08:00:00Z',
  },
  {
    id: 'item-6',
    title: 'React Query Setup Note',
    description: 'Notes on configuring TanStack Query with optimistic updates',
    contentType: 'TEXT',
    content: `## TanStack Query v5 Setup

Install: \`npm i @tanstack/react-query\`

Wrap app in QueryClientProvider. Use \`useMutation\` with \`onMutate\` for optimistic updates — remember to call \`context.previousData\` on error rollback.

Key config: \`staleTime: 60_000\` avoids hammering the server on tab focus.`,
    isFavorite: false,
    isPinned: false,
    itemType: ITEM_TYPES[3],
    tags: [
      { id: 'tag-react-query', name: 'react-query' },
      { id: 'tag-state',       name: 'state-management' },
    ],
    createdAt: '2025-01-05T16:00:00Z',
    updatedAt: '2025-01-05T16:00:00Z',
  },
  {
    id: 'item-7',
    title: 'Tailwind CSS Docs',
    description: 'Official Tailwind CSS v4 documentation',
    contentType: 'URL',
    url: 'https://tailwindcss.com/docs',
    isFavorite: true,
    isPinned: false,
    itemType: ITEM_TYPES[6],
    tags: [
      { id: 'tag-tailwind', name: 'tailwind' },
      { id: 'tag-css',      name: 'css' },
      { id: 'tag-docs',     name: 'docs' },
    ],
    createdAt: '2025-01-03T12:00:00Z',
    updatedAt: '2025-01-03T12:00:00Z',
  },
  {
    id: 'item-8',
    title: 'Prisma Cheat Sheet',
    description: 'Quick reference for Prisma ORM queries and migrations',
    contentType: 'TEXT',
    content: `// Find with relations
const user = await prisma.user.findUnique({
  where: { id },
  include: { posts: true },
});

// Upsert
await prisma.user.upsert({
  where: { email },
  update: { name },
  create: { email, name },
});

// Paginate
const items = await prisma.item.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' },
});`,
    language: 'typescript',
    isFavorite: false,
    isPinned: false,
    itemType: ITEM_TYPES[0],
    tags: [
      { id: 'tag-prisma',   name: 'prisma' },
      { id: 'tag-database', name: 'database' },
    ],
    createdAt: '2025-01-02T10:00:00Z',
    updatedAt: '2025-01-02T10:00:00Z',
  },
  {
    id: 'item-9',
    title: 'System Prompt: Senior Engineer',
    description: 'System message for AI coding sessions',
    contentType: 'TEXT',
    content: `You are a senior software engineer with expertise in TypeScript, React, and Node.js. You write clean, maintainable code following SOLID principles. When reviewing code, you prioritize correctness, security, and readability over cleverness. You always explain the "why" behind architectural decisions.`,
    isFavorite: true,
    isPinned: false,
    itemType: ITEM_TYPES[1],
    tags: [
      { id: 'tag-system-prompt', name: 'system-prompt' },
      { id: 'tag-coding',        name: 'coding' },
    ],
    createdAt: '2024-12-28T09:00:00Z',
    updatedAt: '2024-12-28T09:00:00Z',
  },
  {
    id: 'item-10',
    title: 'Find and Kill Port',
    description: 'Kill whatever process is using a specific port',
    contentType: 'TEXT',
    content: `# macOS / Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F`,
    language: 'bash',
    isFavorite: false,
    isPinned: false,
    itemType: ITEM_TYPES[2],
    tags: [
      { id: 'tag-network', name: 'network' },
      { id: 'tag-process', name: 'process' },
    ],
    createdAt: '2024-12-20T15:00:00Z',
    updatedAt: '2024-12-20T15:00:00Z',
  },
];

// ─── Collections ───────────────────────────────────────────────────────────────

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'React Patterns',
    description: 'Common React patterns and hooks',
    isFavorite: true,
    itemCount: 12,
    items: [MOCK_ITEMS[0], MOCK_ITEMS[1], MOCK_ITEMS[5]],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'col-2',
    name: 'Python Snippets',
    description: 'Useful Python code snippets',
    isFavorite: false,
    itemCount: 8,
    items: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
  },
  {
    id: 'col-3',
    name: 'Context Files',
    description: 'AI context files for projects',
    isFavorite: true,
    itemCount: 5,
    items: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-08T00:00:00Z',
  },
  {
    id: 'col-4',
    name: 'Interview Prep',
    description: 'Technical interview preparation',
    isFavorite: false,
    itemCount: 24,
    items: [MOCK_ITEMS[2], MOCK_ITEMS[7]],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-12T00:00:00Z',
  },
  {
    id: 'col-5',
    name: 'Git Commands',
    description: 'Frequently used git commands',
    isFavorite: true,
    itemCount: 15,
    items: [MOCK_ITEMS[3]],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-07T00:00:00Z',
  },
  {
    id: 'col-6',
    name: 'AI Prompts',
    description: 'Curated AI prompts for coding',
    isFavorite: false,
    itemCount: 18,
    items: [MOCK_ITEMS[2], MOCK_ITEMS[8]],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
  },
];

// ─── Derived helpers ────────────────────────────────────────────────────────────

export const FAVORITE_COLLECTIONS = MOCK_COLLECTIONS.filter((c) => c.isFavorite);
export const ALL_COLLECTIONS = MOCK_COLLECTIONS.filter((c) => !c.isFavorite);

export const PINNED_ITEMS = MOCK_ITEMS.filter((i) => i.isPinned);
export const RECENT_ITEMS = [...MOCK_ITEMS]
  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  .slice(0, 5);

export const TYPE_COUNTS: Record<ItemTypeName, number> = {
  snippet: 24,
  prompt:  18,
  command: 15,
  note:    12,
  file:     5,
  image:    3,
  link:     8,
};
