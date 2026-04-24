import { DashboardShell } from '@/components/layout/dashboard-shell';
import { getSystemItemTypes } from '@/lib/db/items';
import { getSidebarCollections } from '@/lib/db/collections';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [itemTypes, collections] = await Promise.all([
    getSystemItemTypes(),
    getSidebarCollections(),
  ]);

  return (
    <DashboardShell itemTypes={itemTypes} collections={collections}>
      {children}
    </DashboardShell>
  );
}
