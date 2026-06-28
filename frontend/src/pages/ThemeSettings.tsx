/**
 * Theme Settings Page
 * Main page for theme customization
 */

import { useState } from 'react';
import { ThemeSelector } from '../components/theme/ThemeSelector';
import { ThemeEditor } from '../components/theme/ThemeEditor';
import { ThemeMarketplace } from '../components/theme/ThemeMarketplace';
import { Settings, Palette, Store } from 'lucide-react';

type Tab = 'select' | 'editor' | 'marketplace';

export function ThemeSettings() {
  const [activeTab, setActiveTab] = useState<Tab>('select');

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Theme Customization</h1>
        <p className="text-muted-foreground">
          Personalize your omni-stellar-omni-stellar-scavenger experience with custom themes
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        <TabButton
          icon={<Palette className="h-4 w-4" />}
          label="Select Theme"
          isActive={activeTab === 'select'}
          onClick={() => setActiveTab('select')}
        />
        <TabButton
          icon={<Settings className="h-4 w-4" />}
          label="Theme Editor"
          isActive={activeTab === 'editor'}
          onClick={() => setActiveTab('editor')}
        />
        <TabButton
          icon={<Store className="h-4 w-4" />}
          label="Marketplace"
          isActive={activeTab === 'marketplace'}
          onClick={() => setActiveTab('marketplace')}
        />
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'select' && <ThemeSelector />}
        {activeTab === 'editor' && <ThemeEditor />}
        {activeTab === 'marketplace' && <ThemeMarketplace />}
      </div>
    </div>
  );
}

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ icon, label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
        isActive
          ? 'border-primary text-primary font-medium'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
