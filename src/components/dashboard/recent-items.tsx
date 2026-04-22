import Link from 'next/link';
import { Clock } from 'lucide-react';
import { MOCK_ITEMS } from '@/lib/mock-data';
import { ItemRow } from './item-row';

const recentItems = [...MOCK_ITEMS]
  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  .slice(0, 10);

export function RecentItems() {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">Recent Items</h2>
        </div>
        <Link href="/items" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          View all
        </Link>
      </div>
      <div className="rounded-lg border border-border bg-card divide-y divide-border overflow-hidden">
        {recentItems.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
