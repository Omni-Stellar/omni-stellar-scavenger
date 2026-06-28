/**
 * Theme Provider Component
 * Wraps the application with theme context
 */

import { useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { currentTheme } = useTheme();

  useEffect(() => {
    // Apply theme on mount and when it changes
    const root = document.documentElement;
    
    // Set data-theme attribute
    root.setAttribute('data-theme', currentTheme.mode);
    
    // Apply CSS variables
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });
  }, [currentTheme]);

  return <>{children}</>;
}
