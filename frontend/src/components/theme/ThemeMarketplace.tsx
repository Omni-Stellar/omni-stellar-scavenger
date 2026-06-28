/**
 * Theme Marketplace Component
 * Browse and download community themes
 */

import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import type { Theme } from '../../lib/theme/types';
import { Download, Star, Search, TrendingUp } from 'lucide-react';
import { allPresets } from '../../lib/theme/presets';

export function ThemeMarketplace() {
  const { saveCustomTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock marketplace themes (in real app, fetch from API)
  const marketplaceThemes = allPresets.map(theme => ({
    ...theme,
    downloads: Math.floor(Math.random() * 10000),
    rating: (Math.random() * 2 + 3).toFixed(1),
  }));

  const filteredThemes = marketplaceThemes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || theme.mode === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = (theme: Theme) => {
    saveCustomTheme({
      ...theme,
      id: `installed-${theme.id}-${Date.now()}`,
    });
    alert(`Theme "${theme.name}" installed successfully!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Theme Marketplace</h2>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search themes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'light', 'dark'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Theme grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredThemes.map((theme) => (
          <MarketplaceThemeCard
            key={theme.id}
            theme={theme}
            onInstall={() => handleInstall(theme)}
          />
        ))}
      </div>

      {filteredThemes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No themes found matching your search.
        </div>
      )}
    </div>
  );
}

interface MarketplaceThemeCardProps {
  theme: Theme & { downloads: number; rating: string };
  onInstall: () => void;
}

function MarketplaceThemeCard({ theme, onInstall }: MarketplaceThemeCardProps) {
  return (
    <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
      {/* Color preview */}
      <div className="flex gap-1 mb-3">
        <div
          className="flex-1 h-20 rounded"
          style={{ background: theme.colors.primary }}
        />
        <div
          className="flex-1 h-20 rounded"
          style={{ background: theme.colors.secondary }}
        />
        <div
          className="flex-1 h-20 rounded"
          style={{ background: theme.colors.accent }}
        />
      </div>

      <div>
        <h3 className="font-semibold mb-1">{theme.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {theme.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {theme.downloads.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              {theme.rating}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
            {theme.mode}
          </span>
        </div>

        <button
          onClick={onInstall}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
        >
          <Download className="h-4 w-4" />
          Install
        </button>
      </div>
    </div>
  );
}
