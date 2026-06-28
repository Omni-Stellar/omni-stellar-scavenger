/**
 * Theme Selector Component
 * Allows users to browse and select themes
 */

import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import type { Theme } from '../../lib/theme/types';
import { Check, Palette } from 'lucide-react';

export function ThemeSelector() {
  const { currentTheme, allThemes, setTheme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'light' | 'dark'>('all');

  const filteredThemes = allThemes.filter(theme => {
    if (filter === 'all') return true;
    return theme.mode === filter;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Palette className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Select Theme</h2>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('light')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            filter === 'light'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Light
        </button>
        <button
          onClick={() => setFilter('dark')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            filter === 'dark'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Dark
        </button>
      </div>

      {/* Theme grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredThemes.map(theme => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isActive={currentTheme.id === theme.id}
            onSelect={() => setTheme(theme.id)}
          />
        ))}
      </div>
    </div>
  );
}


interface ThemeCardProps {
  theme: Theme;
  isActive: boolean;
  onSelect: () => void;
}

function ThemeCard({ theme, isActive, onSelect }: ThemeCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`relative p-4 rounded-lg border-2 transition-all text-left ${
        isActive
          ? 'border-primary shadow-lg'
          : 'border-border hover:border-primary/50 hover:shadow-md'
      }`}
    >
      {isActive && (
        <div className="absolute top-2 right-2">
          <Check className="h-5 w-5 text-primary" />
        </div>
      )}

      {/* Color preview */}
      <div className="flex gap-1 mb-3">
        <div
          className="w-8 h-8 rounded"
          style={{ background: theme.colors.primary }}
        />
        <div
          className="w-8 h-8 rounded"
          style={{ background: theme.colors.secondary }}
        />
        <div
          className="w-8 h-8 rounded"
          style={{ background: theme.colors.accent }}
        />
      </div>

      <div>
        <h3 className="font-semibold mb-1">{theme.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {theme.description}
        </p>
        <div className="flex gap-2 mt-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
            {theme.mode}
          </span>
          {theme.author !== 'omni-stellar-omni-stellar-scavenger Team' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent text-accent-foreground">
              Custom
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
