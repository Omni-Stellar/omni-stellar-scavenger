/**
 * Theme Manager Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeManager } from '../../src/lib/theme/themeManager';
import { defaultLightTheme, defaultDarkTheme } from '../../src/lib/theme/presets';

describe('ThemeManager', () => {
  let themeManager: ThemeManager;

  beforeEach(() => {
    themeManager = new ThemeManager();
  });

  describe('Theme Management', () => {
    it('should initialize with default light theme', () => {
      const currentTheme = themeManager.getCurrentTheme();
      expect(currentTheme.id).toBe('default-light');
    });

    it('should set theme by ID', () => {
      themeManager.setTheme('default-dark');
      const currentTheme = themeManager.getCurrentTheme();
      expect(currentTheme.id).toBe('default-dark');
      expect(currentTheme.mode).toBe('dark');
    });

    it('should get all themes', () => {
      const allThemes = themeManager.getAllThemes();
      expect(allThemes.length).toBeGreaterThan(0);
      expect(allThemes).toContainEqual(
        expect.objectContaining({ id: 'default-light' })
      );
    });

    it('should get theme by ID', () => {
      const theme = themeManager.getThemeById('default-dark');
      expect(theme).toBeDefined();
      expect(theme?.name).toBe('Default Dark');
    });

    it('should return undefined for non-existent theme', () => {
      const theme = themeManager.getThemeById('non-existent');
      expect(theme).toBeUndefined();
    });
  });

  describe('Custom Themes', () => {
    it('should save custom theme', () => {
      const customTheme = {
        ...defaultLightTheme,
        id: 'custom-test',
        name: 'Test Theme',
      };

      themeManager.saveCustomTheme(customTheme);
      const saved = themeManager.getThemeById('custom-test');
      expect(saved).toBeDefined();
      expect(saved?.name).toBe('Test Theme');
    });

    it('should delete custom theme', () => {
      const customTheme = {
        ...defaultLightTheme,
        id: 'custom-to-delete',
        name: 'Delete Me',
      };

      themeManager.saveCustomTheme(customTheme);
      expect(themeManager.getThemeById('custom-to-delete')).toBeDefined();

      themeManager.deleteCustomTheme('custom-to-delete');
      expect(themeManager.getThemeById('custom-to-delete')).toBeUndefined();
    });

    it('should get all custom themes', () => {
      const customThemes = themeManager.getCustomThemes();
      expect(Array.isArray(customThemes)).toBe(true);
    });
  });

  describe('Theme Creation', () => {
    it('should create theme from current', () => {
      const newTheme = themeManager.createThemeFromCurrent(
        'My Theme',
        'Custom description'
      );

      expect(newTheme.name).toBe('My Theme');
      expect(newTheme.description).toBe('Custom description');
      expect(newTheme.id).toMatch(/^custom-\d+$/);
      expect(newTheme.author).toBe('User');
    });
  });

  describe('Theme Subscription', () => {
    it('should notify listeners on theme change', () => {
      let notifiedTheme = null;

      const unsubscribe = themeManager.subscribe((theme) => {
        notifiedTheme = theme;
      });

      themeManager.setTheme('default-dark');
      expect(notifiedTheme).toBeTruthy();

      unsubscribe();
    });

    it('should unsubscribe listener', () => {
      let callCount = 0;

      const unsubscribe = themeManager.subscribe(() => {
        callCount++;
      });

      themeManager.setTheme('default-dark');
      expect(callCount).toBe(1);

      unsubscribe();
      themeManager.setTheme('default-light');
      expect(callCount).toBe(1); // Should still be 1
    });
  });

  describe('Default Theme Selection', () => {
    it('should get default light theme', () => {
      const theme = themeManager.getDefaultThemeForMode('light');
      expect(theme.mode).toBe('light');
      expect(theme.id).toBe('default-light');
    });

    it('should get default dark theme', () => {
      const theme = themeManager.getDefaultThemeForMode('dark');
      expect(theme.mode).toBe('dark');
      expect(theme.id).toBe('default-dark');
    });
  });
});
