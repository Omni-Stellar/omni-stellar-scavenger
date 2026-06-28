/**
 * useTheme Hook
 * React hook for theme management
 */

import { useState, useEffect } from 'react';
import type { Theme } from '../lib/theme/types';
import { themeManager } from '../lib/theme/themeManager';

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    themeManager.getCurrentTheme()
  );
  const [allThemes, setAllThemes] = useState<Theme[]>(
    themeManager.getAllThemes()
  );

  useEffect(() => {
    // Subscribe to theme changes
    const unsubscribe = themeManager.subscribe((theme) => {
      setCurrentTheme(theme);
      setAllThemes(themeManager.getAllThemes());
    });

    // Apply current theme on mount
    themeManager.applyTheme(themeManager.getCurrentTheme());

    return unsubscribe;
  }, []);

  const setTheme = (themeId: string) => {
    themeManager.setTheme(themeId);
  };

  const saveCustomTheme = (theme: Theme) => {
    themeManager.saveCustomTheme(theme);
  };

  const deleteCustomTheme = (themeId: string) => {
    themeManager.deleteCustomTheme(themeId);
  };

  const importThemes = (themesJson: string): Theme[] => {
    return themeManager.importThemes(themesJson);
  };

  const exportThemes = (themeIds?: string[]): string => {
    return themeManager.exportThemes(themeIds);
  };

  const getCustomThemes = (): Theme[] => {
    return themeManager.getCustomThemes();
  };

  const createThemeFromCurrent = (name: string, description: string): Theme => {
    return themeManager.createThemeFromCurrent(name, description);
  };

  return {
    currentTheme,
    allThemes,
    setTheme,
    saveCustomTheme,
    deleteCustomTheme,
    importThemes,
    exportThemes,
    getCustomThemes,
    createThemeFromCurrent,
  };
}
