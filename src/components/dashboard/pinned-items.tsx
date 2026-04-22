import { Pin } from 'lucide-react';
import { PINNED_ITEMS } from '@/lib/mock-data';
import { ItemRow } from './item-row';

export function PinnedItems() {
  if (PINNED_ITEMS.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Pin className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-base font-semibold">Pinned</h2>
      </div>
      <div className="rounded-lg border border-border bg-card divide-y divide-border overflow-hidden">
        {PINNED_ITEMS.map((item) => (
          <ItemRow key={item.id} item={item} showPin />
        ))}
      </div>
    </section>
  );
}
