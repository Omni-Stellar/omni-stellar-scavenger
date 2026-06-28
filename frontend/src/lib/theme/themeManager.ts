/**
 * Theme Manager - Core theme management logic
 */

import type { Theme } from './types';
import { allPresets, defaultLightTheme, defaultDarkTheme } from './presets';
import { ThemeStorage } from './storage';

export class ThemeManager {
  private currentTheme: Theme;
  private customThemes: Theme[];
  private listeners: Set<(theme: Theme) => void> = new Set();

  constructor() {
    this.customThemes = ThemeStorage.getCustomThemes();
    const savedThemeId = ThemeStorage.getCurrentTheme();
    this.currentTheme = this.getThemeById(savedThemeId || 'default-light') || defaultLightTheme;
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Set current theme
   */
  setTheme(themeId: string): void {
    const theme = this.getThemeById(themeId);
    if (theme) {
      this.currentTheme = theme;
      ThemeStorage.saveCurrentTheme(themeId);
      this.applyTheme(theme);
      this.notifyListeners();
    }
  }

  /**
   * Apply theme to DOM
   */
  applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });

    // Apply typography if provided
    if (theme.typography) {
      if (theme.typography.fontFamily) {
        root.style.setProperty('--font-family', theme.typography.fontFamily);
      }
      // Apply other typography settings...
    }

    // Apply border radius if provided
    if (theme.borderRadius) {
      Object.entries(theme.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--radius-${key}`, value);
      });
    }

    // Apply shadows if provided
    if (theme.shadow) {
      Object.entries(theme.shadow).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value);
      });
    }

    // Apply custom CSS if provided
    if (theme.customCSS) {
      let styleEl = document.getElementById('custom-theme-css');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'custom-theme-css';
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = theme.customCSS;
    }

    // Update data-theme attribute
    root.setAttribute('data-theme', theme.mode);
  }

  /**
   * Get all available themes (presets + custom)
   */
  getAllThemes(): Theme[] {
    return [...allPresets, ...this.customThemes];
  }

  /**
   * Get theme by ID
   */
  getThemeById(id: string): Theme | undefined {
    return this.getAllThemes().find(theme => theme.id === id);
  }

  /**
   * Save custom theme
   */
  saveCustomTheme(theme: Theme): void {
    ThemeStorage.saveCustomTheme(theme);
    this.customThemes = ThemeStorage.getCustomThemes();
    this.notifyListeners();
  }

  /**
   * Delete custom theme
   */
  deleteCustomTheme(themeId: string): void {
    ThemeStorage.deleteCustomTheme(themeId);
    this.customThemes = ThemeStorage.getCustomThemes();
    
    // If deleted theme is current, switch to default
    if (this.currentTheme.id === themeId) {
      this.setTheme('default-light');
    }
    
    this.notifyListeners();
  }

  /**
   * Get custom themes
   */
  getCustomThemes(): Theme[] {
    return this.customThemes;
  }

  /**
   * Import themes
   */
  importThemes(themesJson: string): Theme[] {
    const imported = ThemeStorage.importThemes(themesJson);
    this.customThemes = ThemeStorage.getCustomThemes();
    this.notifyListeners();
    return imported;
  }

  /**
   * Export themes
   */
  exportThemes(themeIds?: string[]): string {
    return ThemeStorage.exportThemes(themeIds);
  }

  /**
   * Subscribe to theme changes
   */
  subscribe(callback: (theme: Theme) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.currentTheme));
  }

  /**
   * Create theme from current colors
   */
  createThemeFromCurrent(name: string, description: string): Theme {
    return {
      ...this.currentTheme,
      id: `custom-${Date.now()}`,
      name,
      description,
      author: 'User',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get theme by mode
   */
  getDefaultThemeForMode(mode: 'light' | 'dark'): Theme {
    return mode === 'dark' ? defaultDarkTheme : defaultLightTheme;
  }
}

// Singleton instance
export const themeManager = new ThemeManager();
