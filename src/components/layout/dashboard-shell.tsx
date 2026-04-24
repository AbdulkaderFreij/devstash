'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/top-bar';
import { Sidebar } from '@/components/layout/sidebar';
import type { SidebarItemType } from '@/lib/db/items';
import type { SidebarCollection } from '@/lib/db/collections';

interface DashboardShellProps {
  children: React.ReactNode;
  itemTypes: SidebarItemType[];
  collections: SidebarCollection[];
}

export function DashboardShell({ children, itemTypes, collections }: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <TopBar onMenuToggle={() => setIsMobileOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isCollapsed={isCollapsed}
          isMobileOpen={isMobileOpen}
          onToggleCollapse={() => setIsCollapsed((c) => !c)}
          onMobileClose={() => setIsMobileOpen(false)}
          itemTypes={itemTypes}
          collections={collections}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
