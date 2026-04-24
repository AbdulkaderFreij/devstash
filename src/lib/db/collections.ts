import { prisma } from '@/lib/prisma';

export interface SidebarCollection {
  id: string;
  name: string;
  isFavorite: boolean;
  itemCount: number;
  dominantColor: string | null;
}

export interface CollectionWithTypes {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  updatedAt: Date;
  itemCount: number;
  dominantColor: string | null;
  typeIcons: { icon: string; color: string }[];
}

export async function getRecentCollections(limit = 6): Promise<CollectionWithTypes[]> {
  const collections = await prisma.collection.findMany({
    take: limit,
    orderBy: { updatedAt: 'desc' },
    include: {
      items: {
        include: {
          item: {
            include: { itemType: true },
          },
        },
      },
    },
  });

  return collections.map((col) => {
    const typeCounts = new Map<string, { icon: string; color: string; count: number }>();

    for (const ic of col.items) {
      const { icon, color, name } = ic.item.itemType;
      const existing = typeCounts.get(name);
      if (existing) {
        existing.count++;
      } else {
        typeCounts.set(name, { icon, color, count: 1 });
      }
    }

    const sorted = [...typeCounts.values()].sort((a, b) => b.count - a.count);
    const dominantColor = sorted[0]?.color ?? null;
    const typeIcons = sorted.map(({ icon, color }) => ({ icon, color }));

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      updatedAt: col.updatedAt,
      itemCount: col.items.length,
      dominantColor,
      typeIcons,
    };
  });
}

export async function getSidebarCollections(): Promise<SidebarCollection[]> {
  const collections = await prisma.collection.findMany({
    orderBy: [{ isFavorite: 'desc' }, { updatedAt: 'desc' }],
    include: {
      items: {
        include: {
          item: {
            include: { itemType: { select: { name: true, color: true } } },
          },
        },
      },
    },
  });

  return collections.map((col) => {
    const typeCounts = new Map<string, { color: string; count: number }>();

    for (const ic of col.items) {
      const { name, color } = ic.item.itemType;
      const existing = typeCounts.get(name);
      if (existing) {
        existing.count++;
      } else {
        typeCounts.set(name, { color, count: 1 });
      }
    }

    const dominantColor =
      [...typeCounts.values()].sort((a, b) => b.count - a.count)[0]?.color ?? null;

    return {
      id: col.id,
      name: col.name,
      isFavorite: col.isFavorite,
      itemCount: col.items.length,
      dominantColor,
    };
  });
}
