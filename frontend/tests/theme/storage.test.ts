/**
 * Theme Storage Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeStorage } from '../../src/lib/theme/storage';
import { defaultLightTheme } from '../../src/lib/theme/presets';

describe('ThemeStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Current Theme', () => {
    it('should save and retrieve current theme ID', () => {
      ThemeStorage.saveCurrentTheme('default-dark');
      const themeId = ThemeStorage.getCurrentTheme();
      expect(themeId).toBe('default-dark');
    });

    it('should return null when no theme is saved', () => {
      const themeId = ThemeStorage.getCurrentTheme();
      expect(themeId).toBeNull();
    });
  });

  describe('Custom Themes', () => {
    it('should save custom theme', () => {
      const customTheme = {
        ...defaultLightTheme,
        id: 'custom-1',
        name: 'Custom Theme',
      };

      ThemeStorage.saveCustomTheme(customTheme);
      const themes = ThemeStorage.getCustomThemes();
      
      expect(themes).toHaveLength(1);
      expect(themes[0].id).toBe('custom-1');
      expect(themes[0].name).toBe('Custom Theme');
    });

    it('should update existing custom theme', () => {
      const customTheme = {
        ...defaultLightTheme,
        id: 'custom-1',
        name: 'Original Name',
      };

      ThemeStorage.saveCustomTheme(customTheme);
      
      const updatedTheme = {
        ...customTheme,
        name: 'Updated Name',
      };
      
      ThemeStorage.saveCustomTheme(updatedTheme);
      const themes = ThemeStorage.getCustomThemes();
      
      expect(themes).toHaveLength(1);
      expect(themes[0].name).toBe('Updated Name');
    });

    it('should delete custom theme', () => {
      const customTheme = {
        ...defaultLightTheme,
        id: 'custom-1',
        name: 'To Delete',
      };

      ThemeStorage.saveCustomTheme(customTheme);
      expect(ThemeStorage.getCustomThemes()).toHaveLength(1);

      ThemeStorage.deleteCustomTheme('custom-1');
      expect(ThemeStorage.getCustomThemes()).toHaveLength(0);
    });

    it('should return empty array when no custom themes', () => {
      const themes = ThemeStorage.getCustomThemes();
      expect(themes).toEqual([]);
    });
  });

  describe('Import/Export', () => {
    it('should export themes to JSON', () => {
      const theme1 = { ...defaultLightTheme, id: 'custom-1' };
      const theme2 = { ...defaultLightTheme, id: 'custom-2' };

      ThemeStorage.saveCustomTheme(theme1);
      ThemeStorage.saveCustomTheme(theme2);

      const exported = ThemeStorage.exportThemes();
      const parsed = JSON.parse(exported);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(2);
    });

    it('should export specific themes', () => {
      const theme1 = { ...defaultLightTheme, id: 'custom-1' };
      const theme2 = { ...defaultLightTheme, id: 'custom-2' };

      ThemeStorage.saveCustomTheme(theme1);
      ThemeStorage.saveCustomTheme(theme2);

      const exported = ThemeStorage.exportThemes(['custom-1']);
      const parsed = JSON.parse(exported);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].id).toBe('custom-1');
    });

    it('should import themes from JSON', () => {
      const themes = [
        { ...defaultLightTheme, id: 'imported-1', name: 'Imported 1' },
        { ...defaultLightTheme, id: 'imported-2', name: 'Imported 2' },
      ];

      const themesJson = JSON.stringify(themes);
      const imported = ThemeStorage.importThemes(themesJson);

      expect(imported).toHaveLength(2);
      
      const stored = ThemeStorage.getCustomThemes();
      expect(stored).toHaveLength(2);
    });

    it('should throw error on invalid JSON', () => {
      expect(() => {
        ThemeStorage.importThemes('invalid json');
      }).toThrow('Invalid theme JSON format');
    });
  });

  describe('Clear Data', () => {
    it('should clear all custom themes', () => {
      ThemeStorage.saveCustomTheme({ ...defaultLightTheme, id: 'custom-1' });
      ThemeStorage.saveCustomTheme({ ...defaultLightTheme, id: 'custom-2' });

      ThemeStorage.clearCustomThemes();
      expect(ThemeStorage.getCustomThemes()).toHaveLength(0);
    });
  });
});
