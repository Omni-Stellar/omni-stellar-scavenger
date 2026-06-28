# Theme Customization System Documentation

## Overview

The theme customization system provides a comprehensive solution for personalizing the appearance of the omni-stellar-omni-stellar-scavenger application. It supports custom color schemes, theme persistence, import/export functionality, and a marketplace for community themes.

## Features

- ✨ **Multiple Built-in Themes**: 7 professionally designed presets
- 🎨 **Custom Theme Editor**: Create themes with visual editor
- 💾 **Theme Persistence**: Automatic save to localStorage
- 📦 **Import/Export**: Share themes as JSON files
- 🏪 **Theme Marketplace**: Browse and install community themes
- 🌓 **Light/Dark Modes**: Support for both modes
- ♿ **Accessibility**: High contrast theme included
- 🔄 **Real-time Preview**: See changes instantly

## Architecture

### Core Components

1. **ThemeManager** (`lib/theme/themeManager.ts`)
   - Central theme management
   - Theme switching and application
   - Custom theme CRUD operations
   - Event subscription system

2. **ThemeStorage** (`lib/theme/storage.ts`)
   - LocalStorage persistence
   - Import/export functionality
   - Data serialization

3. **Theme Types** (`lib/theme/types.ts`)
   - TypeScript type definitions
   - Color palette structure
   - Typography and spacing types

4. **Theme Presets** (`lib/theme/presets.ts`)
   - Built-in theme definitions
   - Theme categories

### UI Components

1. **ThemeProvider** - Context wrapper for the application
2. **ThemeSelector** - Browse and select themes
3. **ThemeEditor** - Create and customize themes
4. **ThemeMarketplace** - Discover community themes

## Built-in Themes

### Default Light
- Clean and modern light theme
- High readability
- Professional appearance

### Default Dark
- Elegant dark theme
- Reduced eye strain
- Perfect for night mode

### Ocean Breeze
- Blue and teal color scheme
- Refreshing appearance
- Light mode

### Forest
- Natural green tones
- Nature-inspired
- Dark mode

### Sunset
- Warm orange and purple
- Vibrant colors
- Light mode

### Midnight
- Deep dark purple
- Night owl friendly
- Dark mode

### High Contrast
- Maximum contrast
- Accessibility-focused
- WCAG AAA compliant

## Usage

### Basic Theme Selection

```typescript
import { useTheme } from './hooks/useTheme';

function MyComponent() {
  const { currentTheme, allThemes, setTheme } = useTheme();

  return (
    <div>
      <h2>Current: {currentTheme.name}</h2>
      <select onChange={(e) => setTheme(e.target.value)}>
        {allThemes.map(theme => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Creating Custom Themes

```typescript
import { useTheme } from './hooks/useTheme';
import type { Theme } from './lib/theme/types';

function CreateTheme() {
  const { saveCustomTheme } = useTheme();

  const createMyTheme = () => {
    const customTheme: Theme = {
      id: `custom-${Date.now()}`,
      name: 'My Custom Theme',
      description: 'A theme I created',
      author: 'User',
      version: '1.0.0',
      mode: 'light',
      colors: {
        primary: 'hsl(200, 98%, 39%)',
        primaryForeground: 'hsl(0, 0%, 100%)',
        // ... other colors
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveCustomTheme(customTheme);
  };

  return <button onClick={createMyTheme}>Create Theme</button>;
}
```

### Using ThemeProvider

Wrap your application with the ThemeProvider:

```typescript
import { ThemeProvider } from './components/theme/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Subscribing to Theme Changes

```typescript
import { useEffect } from 'react';
import { themeManager } from './lib/theme/themeManager';

function MyComponent() {
  useEffect(() => {
    const unsubscribe = themeManager.subscribe((theme) => {
      console.log('Theme changed to:', theme.name);
      // Perform actions on theme change
    });

    return unsubscribe;
  }, []);

  return <div>My Component</div>;
}
```

## Theme Structure

### Complete Theme Object

```typescript
interface Theme {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description: string;           // Description
  author: string;                // Creator name
  version: string;               // Version number
  mode: 'light' | 'dark';       // Theme mode
  colors: ThemeColors;          // Color palette
  typography?: ThemeTypography;  // Font settings
  spacing?: ThemeSpacing;        // Spacing scale
  borderRadius?: ThemeBorderRadius; // Border radius
  shadow?: ThemeShadow;          // Shadow definitions
  customCSS?: string;            // Custom CSS
  preview?: string;              // Preview image URL
  tags?: string[];               // Search tags
  downloads?: number;            // Download count
  rating?: number;               // User rating
  createdAt: string;             // Creation timestamp
  updatedAt: string;             // Update timestamp
}
```

### Color Palette

```typescript
interface ThemeColors {
  // Primary
  primary: string;
  primaryForeground: string;
  
  // Secondary
  secondary: string;
  secondaryForeground: string;
  
  // Background
  background: string;
  foreground: string;
  
  // Muted
  muted: string;
  mutedForeground: string;
  
  // Accent
  accent: string;
  accentForeground: string;
  
  // Destructive
  destructive: string;
  destructiveForeground: string;
  
  // UI Elements
  border: string;
  input: string;
  ring: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
}
```

## API Reference

### useTheme Hook

```typescript
const {
  currentTheme,              // Current active theme
  allThemes,                // All available themes
  setTheme,                 // Switch theme
  saveCustomTheme,          // Save custom theme
  deleteCustomTheme,        // Delete custom theme
  importThemes,             // Import themes from JSON
  exportThemes,             // Export themes to JSON
  getCustomThemes,          // Get custom themes
  createThemeFromCurrent,   // Create theme from current
} = useTheme();
```

### ThemeManager Methods

```typescript
// Get current theme
const currentTheme = themeManager.getCurrentTheme();

// Set theme
themeManager.setTheme('theme-id');

// Get all themes
const allThemes = themeManager.getAllThemes();

// Get theme by ID
const theme = themeManager.getThemeById('theme-id');

// Save custom theme
themeManager.saveCustomTheme(theme);

// Delete custom theme
themeManager.deleteCustomTheme('theme-id');

// Subscribe to changes
const unsubscribe = themeManager.subscribe((theme) => {
  console.log('Theme changed:', theme);
});

// Create from current
const newTheme = themeManager.createThemeFromCurrent(
  'My Theme',
  'Description'
);
```

### ThemeStorage Methods

```typescript
// Save current theme ID
ThemeStorage.saveCurrentTheme('theme-id');

// Get current theme ID
const themeId = ThemeStorage.getCurrentTheme();

// Save custom theme
ThemeStorage.saveCustomTheme(theme);

// Get custom themes
const customThemes = ThemeStorage.getCustomThemes();

// Delete custom theme
ThemeStorage.deleteCustomTheme('theme-id');

// Import themes
const imported = ThemeStorage.importThemes(jsonString);

// Export themes
const json = ThemeStorage.exportThemes(['theme-id']);

// Clear all custom themes
ThemeStorage.clearCustomThemes();
```

## Theme Import/Export

### Export Themes

```typescript
const { exportThemes } = useTheme();

// Export all custom themes
const allThemesJson = exportThemes();

// Export specific themes
const selectedThemesJson = exportThemes(['theme-1', 'theme-2']);

// Download as file
const blob = new Blob([allThemesJson], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'my-themes.json';
a.click();
```

### Import Themes

```typescript
const { importThemes } = useTheme();

// From file upload
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target?.result as string;
      const imported = importThemes(json);
      console.log(`Imported ${imported.length} themes`);
    };
    reader.readAsText(file);
  }
};
```

## Best Practices

### Color Selection

1. **Use HSL Format**: Easier to adjust lightness and saturation
   ```typescript
   // Good
   primary: 'hsl(200, 98%, 39%)'
   
   // Avoid
   primary: '#0284C7'
   ```

2. **Maintain Contrast**: Ensure sufficient contrast for accessibility
   - Text on background: minimum 4.5:1 ratio
   - Large text: minimum 3:1 ratio

3. **Consistent Color Usage**:
   - Primary: Main brand color, CTAs
   - Secondary: Supporting actions
   - Accent: Highlights and special elements
   - Destructive: Warnings and errors

### Theme Naming

```typescript
// Good names
'ocean-breeze', 'forest-dark', 'sunset-warm'

// Avoid generic names
'theme-1', 'custom', 'new-theme'
```

### Theme Organization

Group themes by:
- Mode (light/dark)
- Category (nature, tech, minimal)
- Purpose (accessibility, branding)

## Accessibility

### High Contrast Theme

The built-in high contrast theme provides:
- Maximum contrast ratios
- Clear borders
- High visibility for all elements
- WCAG AAA compliance

### Testing Themes

Test your themes for:
1. Color contrast (use tools like WebAIM)
2. Keyboard navigation visibility
3. Focus indicators
4. Screen reader compatibility

## Performance

### Optimization Tips

1. **Lazy Load Themes**: Load theme data on demand
2. **Cache Themes**: Use localStorage for persistence
3. **Minimize Repaints**: Apply all color changes at once
4. **Use CSS Variables**: Efficient DOM updates

### Storage Limits

- LocalStorage: ~5-10MB per domain
- Average theme size: ~2KB
- Recommended max custom themes: 50-100

## Troubleshooting

### Theme Not Applying

```typescript
// Check if theme exists
const theme = themeManager.getThemeById('theme-id');
if (!theme) {
  console.error('Theme not found');
}

// Manually apply theme
themeManager.applyTheme(theme);
```

### Import Fails

```typescript
try {
  const imported = importThemes(jsonString);
} catch (error) {
  console.error('Invalid theme format:', error);
  // Show user-friendly error message
}
```

### Storage Full

```typescript
try {
  ThemeStorage.saveCustomTheme(theme);
} catch (error) {
  console.error('Storage quota exceeded');
  // Prompt user to delete old themes
}
```

## Future Enhancements

Planned features:
1. Theme animations and transitions
2. Gradient support
3. Custom font integration
4. Theme scheduling (auto-switch)
5. AI-powered theme generation
6. Collaborative theme editing
7. Theme versioning
8. Social features (likes, comments)
9. Theme analytics
10. Cloud sync

## References

- Source code: `frontend/src/lib/theme/`
- Components: `frontend/src/components/theme/`
- Tests: `frontend/tests/theme/`
- Hook: `frontend/src/hooks/useTheme.ts`
- Types: `frontend/src/lib/theme/types.ts`

## Contributing

To add a new built-in theme:

1. Create theme object in `presets.ts`
2. Add to `allPresets` array
3. Test with theme tests
4. Add preview screenshot
5. Update documentation

## License

The theme system is part of the omni-stellar-omni-stellar-scavenger project and follows the same license.
