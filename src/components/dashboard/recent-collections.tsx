import Link from 'next/link';
import {
  Code, Sparkles, Terminal, StickyNote, File, Image,
  Link as LinkIcon, Star, MoreHorizontal,
} from 'lucide-react';
import { MOCK_COLLECTIONS, type Collection } from '@/lib/mock-data';

const ICON_MAP: Record<string, React.ElementType> = {
  Code, Sparkles, Terminal, StickyNote, File, Image, Link: LinkIcon,
};

function CollectionCard({ collection }: { collection: Collection }) {
  const typeIcons = Array.from(
    new Set(collection.items.map((i) => i.itemType.icon))
  ).slice(0, 4);

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3 hover:border-border/80 hover:bg-card/80 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {collection.isFavorite && (
              <Star className="h-3.5 w-3.5 shrink-0 text-yellow-500 fill-yellow-500" />
            )}
            <h3 className="font-medium text-sm truncate">{collection.name}</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{collection.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground tabular-nums">{collection.itemCount} items</span>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {typeIcons.length > 0 && (
        <div className="flex items-center gap-1.5">
          {typeIcons.map((iconName) => {
            const Icon = ICON_MAP[iconName];
            const item = collection.items.find((i) => i.itemType.icon === iconName);
            return Icon && item ? (
              <Icon
                key={iconName}
                className="h-3.5 w-3.5"
                style={{ color: item.itemType.color }}
              />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

export function RecentCollections() {
  const recent = [...MOCK_COLLECTIONS]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold">Collections</h2>
        <Link href="/collections" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {recent.map((col) => (
          <CollectionCard key={col.id} collection={col} />
        ))}
      </div>
    </section>
  );
}
