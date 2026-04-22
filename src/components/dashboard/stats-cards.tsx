import { LayoutGrid, BookOpen, Star, Bookmark } from 'lucide-react';
import {
  MOCK_ITEMS,
  MOCK_COLLECTIONS,
  FAVORITE_COLLECTIONS,
  TYPE_COUNTS,
} from '@/lib/mock-data';

const totalItems = Object.values(TYPE_COUNTS).reduce((a, b) => a + b, 0);
const totalCollections = MOCK_COLLECTIONS.length;
const favoriteItems = MOCK_ITEMS.filter((i) => i.isFavorite).length;
const favoriteCollections = FAVORITE_COLLECTIONS.length;

const stats = [
  { label: 'Total Items', value: totalItems, icon: LayoutGrid, color: '#3b82f6' },
  { label: 'Collections', value: totalCollections, icon: BookOpen, color: '#8b5cf6' },
  { label: 'Favorite Items', value: favoriteItems, icon: Star, color: '#f97316' },
  { label: 'Favorite Collections', value: favoriteCollections, icon: Bookmark, color: '#10b981' },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="rounded-lg border border-border bg-card p-4 flex items-center gap-4"
        >
          <div
            className="h-10 w-10 rounded-md flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color}1a` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground truncate">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
