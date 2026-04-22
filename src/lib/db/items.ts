import { prisma } from '@/lib/prisma';

export interface ItemWithType {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  itemType: {
    icon: string;
    color: string;
  };
  tags: { id: string; name: string }[];
}

export interface DashboardStats {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

const itemInclude = {
  itemType: { select: { icon: true, color: true } },
  tags: { select: { id: true, name: true } },
} as const;

export async function getPinnedItems(limit = 10): Promise<ItemWithType[]> {
  return prisma.item.findMany({
    where: { isPinned: true },
    take: limit,
    orderBy: { updatedAt: 'desc' },
    include: itemInclude,
  });
}

export async function getRecentItems(limit = 10): Promise<ItemWithType[]> {
  return prisma.item.findMany({
    take: limit,
    orderBy: { updatedAt: 'desc' },
    include: itemInclude,
  });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalItems, totalCollections, favoriteItems, favoriteCollections] = await Promise.all([
    prisma.item.count(),
    prisma.collection.count(),
    prisma.item.count({ where: { isFavorite: true } }),
    prisma.collection.count({ where: { isFavorite: true } }),
  ]);

  return { totalItems, totalCollections, favoriteItems, favoriteCollections };
}
