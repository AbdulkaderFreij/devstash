import {
  Code, Sparkles, Terminal, StickyNote, File, Image,
  Link as LinkIcon, Star, Pin,
} from 'lucide-react';
import type { ItemWithType } from '@/lib/db/items';

const ICON_MAP: Record<string, React.ElementType> = {
  Code, Sparkles, Terminal, StickyNote, File, Image, Link: LinkIcon,
};

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface ItemRowProps {
  item: ItemWithType;
  showPin?: boolean;
}

export function ItemRow({ item, showPin }: ItemRowProps) {
  const Icon = ICON_MAP[item.itemType.icon];

  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-sidebar-accent/50 transition-colors rounded-md group">
      <div
        className="h-8 w-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: `${item.itemType.color}1a` }}
      >
        {Icon && <Icon className="h-4 w-4" style={{ color: item.itemType.color }} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{item.title}</p>
          {item.isFavorite && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" />}
          {showPin && item.isPinned && <Pin className="h-3 w-3 text-muted-foreground shrink-0" />}
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
        )}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {item.tags.slice(0, 4).map((tag) => (
              <span
                key={tag.id}
                className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <span className="text-xs text-muted-foreground shrink-0 pt-0.5">{formatDate(item.createdAt)}</span>
    </div>
  );
}
