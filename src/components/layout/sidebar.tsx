'use client';

import Link from 'next/link';
import {
  Code, Sparkles, Terminal, StickyNote, File, Image,
  Link as LinkIcon, ChevronDown, Star, Settings,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ITEM_TYPES,
  FAVORITE_COLLECTIONS,
  ALL_COLLECTIONS,
  TYPE_COUNTS,
} from '@/lib/mock-data';

const ICON_MAP: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onMobileClose: () => void;
}

export function Sidebar({ isCollapsed, isMobileOpen, onToggleCollapse, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-200',
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onMobileClose}
      />

      {/* Sidebar panel */}
      <aside
        className={cn(
          'flex flex-col bg-sidebar border-r border-sidebar-border shrink-0',
          'transition-[width,transform] duration-200 ease-in-out',
          // Mobile: fixed drawer, hidden off-screen by default
          'fixed inset-y-0 left-0 z-50 w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: reset to normal flow
          'lg:relative lg:inset-auto lg:z-auto lg:translate-x-0',
          isCollapsed ? 'lg:w-16' : 'lg:w-64',
        )}
      >
        {/* Sidebar header (collapse toggle for desktop) */}
        <div
          className={cn(
            'h-14 flex items-center border-b border-sidebar-border shrink-0',
            isCollapsed ? 'justify-center' : 'justify-end px-3',
          )}
        >
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">

          {/* Types section */}
          <div className="px-3">
            {!isCollapsed && (
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Types
              </p>
            )}
            <nav className="space-y-0.5">
              {ITEM_TYPES.map((type) => {
                const Icon = ICON_MAP[type.icon];
                const count = TYPE_COUNTS[type.name];
                return (
                  <Link
                    key={type.id}
                    href={`/items/${type.name}s`}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-foreground/80',
                      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors',
                      isCollapsed && 'justify-center px-0 py-2',
                    )}
                    title={isCollapsed ? `${type.name}s` : undefined}
                  >
                    {Icon && (
                      <Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />
                    )}
                    {!isCollapsed && (
                      <>
                        <span className="capitalize flex-1">{type.name}s</span>
                        <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
                      </>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Collections section */}
          {!isCollapsed && (
            <div className="px-3">
              <div className="flex items-center gap-1 px-2 mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex-1">
                  Collections
                </p>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </div>

              {/* Favorites */}
              {FAVORITE_COLLECTIONS.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-2 mb-1">
                    Favorites
                  </p>
                  <nav className="space-y-0.5">
                    {FAVORITE_COLLECTIONS.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.id}`}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      >
                        <Star className="h-3.5 w-3.5 shrink-0 text-yellow-500 fill-yellow-500" />
                        <span className="flex-1 truncate">{col.name}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">{col.itemCount}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
              )}

              {/* All Collections */}
              {ALL_COLLECTIONS.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-2 mb-1">
                    All Collections
                  </p>
                  <nav className="space-y-0.5">
                    {ALL_COLLECTIONS.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.id}`}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      >
                        <span className="h-3.5 w-3.5 shrink-0" />
                        <span className="flex-1 truncate">{col.name}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">{col.itemCount}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User avatar area */}
        <div
          className={cn(
            'border-t border-sidebar-border p-3 shrink-0',
            isCollapsed && 'flex justify-center',
          )}
        >
          {isCollapsed ? (
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              JD
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">john@example.com</p>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
