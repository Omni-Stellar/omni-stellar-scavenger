/**
 * Theme Storage - Persistence layer for themes
 */

import type { Theme } from './types';

const THEME_STORAGE_KEY = 'omni-stellar-scavenger-theme';
const CUSTOM_THEMES_KEY = 'omni-stellar-scavenger-custom-themes';

export class ThemeStorage {
  /**
   * Save current theme ID
   */
  static saveCurrentTheme(themeId: string): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }

  /**
   * Get current theme ID
   */
  static getCurrentTheme(): string | null {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to get theme:', error);
      return null;
    }
  }

  /**
   * Save custom theme
   */
  static saveCustomTheme(theme: Theme): void {
    try {
      const themes = this.getCustomThemes();
      const existingIndex = themes.findIndex(t => t.id === theme.id);
      
      if (existingIndex >= 0) {
        themes[existingIndex] = { ...theme, updatedAt: new Date().toISOString() };
      } else {
        themes.push(theme);
      }
      
      localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(themes));
    } catch (error) {
      console.error('Failed to save custom theme:', error);
    }
  }

  /**
   * Get all custom themes
   */
  static getCustomThemes(): Theme[] {
    try {
      const data = localStorage.getItem(CUSTOM_THEMES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get custom themes:', error);
      return [];
    }
  }

  /**
   * Delete custom theme
   */
  static deleteCustomTheme(themeId: string): void {
    try {
      const themes = this.getCustomThemes();
      const filtered = themes.filter(t => t.id !== themeId);
      localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete custom theme:', error);
    }
  }

  /**
   * Import themes from JSON
   */
  static importThemes(themesJson: string): Theme[] {
    try {
      const themes: Theme[] = JSON.parse(themesJson);
      const existing = this.getCustomThemes();
      
      themes.forEach(theme => {
        const index = existing.findIndex(t => t.id === theme.id);
        if (index >= 0) {
          existing[index] = theme;
        } else {
          existing.push(theme);
        }
      });
      
      localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(existing));
      return themes;
    } catch (error) {
      console.error('Failed to import themes:', error);
      throw new Error('Invalid theme JSON format');
    }
  }

  /**
   * Export themes to JSON
   */
  static exportThemes(themeIds?: string[]): string {
    const themes = this.getCustomThemes();
    const toExport = themeIds 
      ? themes.filter(t => themeIds.includes(t.id))
      : themes;
    return JSON.stringify(toExport, null, 2);
  }

  /**
   * Clear all custom themes
   */
  static clearCustomThemes(): void {
    try {
      localStorage.removeItem(CUSTOM_THEMES_KEY);
    } catch (error) {
      console.error('Failed to clear custom themes:', error);
    }
  }
}
