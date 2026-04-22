'use client';

import { Search, Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TopBarProps {
  onMenuToggle?: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  return (
    <header className="h-14 border-b border-border flex items-center gap-4 px-4 shrink-0">
      <button
        onClick={onMenuToggle}
        className="lg:hidden flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2 font-semibold text-lg">
        <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
          DS
        </span>
        <span>DevStash</span>
      </div>

      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 bg-muted/50"
          />
        </div>
      </div>

      <div className="ml-auto">
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Item
        </Button>
      </div>
    </header>
  );
}
