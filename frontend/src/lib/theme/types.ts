/**
 * Theme System Types
 * Defines the structure of themes in the application
 */

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryForeground: string;
  
  // Secondary colors
  secondary: string;
  secondaryForeground: string;
  
  // Background colors
  background: string;
  foreground: string;
  
  // Muted colors
  muted: string;
  mutedForeground: string;
  
  // Accent colors
  accent: string;
  accentForeground: string;
  
  // Destructive colors
  destructive: string;
  destructiveForeground: string;
  
  // Border and input
  border: string;
  input: string;
  ring: string;
  
  // Card colors
  card: string;
  cardForeground: string;
  
  // Popover colors
  popover: string;
  popoverForeground: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
}

export interface ThemeSpacing {
  unit: number; // Base spacing unit in pixels
  scale: number[]; // Spacing scale multipliers
}

export interface ThemeBorderRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ThemeShadow {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  mode: 'light' | 'dark';
  colors: ThemeColors;
  typography?: Partial<ThemeTypography>;
  spacing?: Partial<ThemeSpacing>;
  borderRadius?: Partial<ThemeBorderRadius>;
  shadow?: Partial<ThemeShadow>;
  customCSS?: string;
  preview?: string; // Preview image URL
  tags?: string[];
  downloads?: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  theme: Theme;
  category: string;
  featured?: boolean;
}
