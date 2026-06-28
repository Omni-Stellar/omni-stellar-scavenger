/**
 * Theme Editor Component
 * Advanced theme customization interface
 */

import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import type { Theme, ThemeColors } from '../../lib/theme/types';
import { Save, Download, Upload, Palette, Eye } from 'lucide-react';

export function ThemeEditor() {
  const { currentTheme, saveCustomTheme, createThemeFromCurrent } = useTheme();
  const [editingTheme, setEditingTheme] = useState<Theme>(currentTheme);
  const [themeName, setThemeName] = useState('');
  const [themeDescription, setThemeDescription] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setEditingTheme({
      ...editingTheme,
      colors: {
        ...editingTheme.colors,
        [key]: value,
      },
    });
  };

  const handleSave = () => {
    if (!themeName) {
      alert('Please enter a theme name');
      return;
    }

    const newTheme = {
      ...editingTheme,
      id: `custom-${Date.now()}`,
      name: themeName,
      description: themeDescription,
      author: 'User',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveCustomTheme(newTheme);
    alert('Theme saved successfully!');
  };

  const handleExport = () => {
    const themeJson = JSON.stringify(editingTheme, null, 2);
    const blob = new Blob([themeJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${themeName || 'theme'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const colorCategories = [
    {
      name: 'Primary Colors',
      colors: [
        { key: 'primary', label: 'Primary' },
        { key: 'primaryForeground', label: 'Primary Foreground' },
      ],
    },
    {
      name: 'Secondary Colors',
      colors: [
        { key: 'secondary', label: 'Secondary' },
        { key: 'secondaryForeground', label: 'Secondary Foreground' },
      ],
    },
    {
      name: 'Background',
      colors: [
        { key: 'background', label: 'Background' },
        { key: 'foreground', label: 'Foreground' },
      ],
    },
    {
      name: 'Accent Colors',
      colors: [
        { key: 'accent', label: 'Accent' },
        { key: 'accentForeground', label: 'Accent Foreground' },
      ],
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Theme Editor</h2>
        </div>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm"
        >
          <Eye className="h-4 w-4" />
          {previewMode ? 'Edit' : 'Preview'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Theme Name</label>
          <input
            type="text"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            placeholder="My Custom Theme"
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={themeDescription}
            onChange={(e) => setThemeDescription(e.target.value)}
            placeholder="A beautiful theme I created..."
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground resize-none"
          />
        </div>
      </div>

      {!previewMode && (
        <div className="space-y-4">
          {colorCategories.map((category) => (
            <div key={category.name}>
              <h3 className="font-medium mb-2">{category.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {category.colors.map(({ key, label }) => (
                  <ColorInput
                    key={key}
                    label={label}
                    value={editingTheme.colors[key]}
                    onChange={(value) => handleColorChange(key, value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {previewMode && (
        <div className="p-6 rounded-lg border border-border space-y-4">
          <h3 className="text-lg font-semibold">Preview</h3>
          <ThemePreview theme={editingTheme} />
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Save className="h-4 w-4" />
          Save Theme
        </button>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
    </div>
  );
}

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <label className="block text-sm mb-1">{label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-1.5 border border-input rounded-md bg-background text-foreground text-sm font-mono"
        />
      </div>
      <div
        className="w-10 h-10 rounded border border-border"
        style={{ background: value }}
      />
    </div>
  );
}

function ThemePreview({ theme }: { theme: Theme }) {
  return (
    <div className="space-y-3" style={{ color: theme.colors.foreground }}>
      <div className="p-4 rounded" style={{ background: theme.colors.primary, color: theme.colors.primaryForeground }}>
        Primary Button
      </div>
      <div className="p-4 rounded" style={{ background: theme.colors.secondary, color: theme.colors.secondaryForeground }}>
        Secondary Button
      </div>
      <div className="p-4 rounded" style={{ background: theme.colors.accent, color: theme.colors.accentForeground }}>
        Accent Button
      </div>
      <div className="p-4 rounded border" style={{ borderColor: theme.colors.border, background: theme.colors.card, color: theme.colors.cardForeground }}>
        Card Component
      </div>
    </div>
  );
}
