import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentCollections } from '@/components/dashboard/recent-collections';
import { PinnedItems } from '@/components/dashboard/pinned-items';
import { RecentItems } from '@/components/dashboard/recent-items';
import { getRecentCollections } from '@/lib/db/collections';
import { getPinnedItems, getRecentItems, getDashboardStats } from '@/lib/db/items';

export default async function DashboardPage() {
  const [collections, pinnedItems, recentItems, stats] = await Promise.all([
    getRecentCollections(),
    getPinnedItems(),
    getRecentItems(),
    getDashboardStats(),
  ]);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your developer knowledge hub</p>
      </div>

      <StatsCards stats={stats} />
      <RecentCollections collections={collections} />
      <PinnedItems items={pinnedItems} />
      <RecentItems items={recentItems} />
    </div>
  );
}
