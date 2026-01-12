# Centralized Theme System Guide

## Overview
This portfolio uses a centralized theming system where **all colors are controlled from a single file**. You can change the entire site's color scheme by editing just 4 hex values in one location.

## How It Works

### 1. Single Source of Truth
**File:** `/styles/globals.css`

All site colors are defined as CSS variables in the `:root` selector:

```css
:root {
  --color-primary: #0C2B4E;    /* Dark navy blue - main dark backgrounds */
  --color-secondary: #1A3D64;  /* Medium navy blue - secondary dark backgrounds */
  --color-accent: #1D546C;     /* Teal - borders, highlights, accents */
  --color-light: #F4F4F4;      /* Light gray - light mode backgrounds */
}
```

**To change the entire site's color scheme**, simply edit these 4 hex values in `globals.css`. That's it!

### 2. Semantic Color Names
The Tailwind config maps these CSS variables to semantic names:

**File:** `/tailwind.config.js`

```javascript
colors: {
  primary: 'var(--color-primary)',      // Main dark background
  secondary: 'var(--color-secondary)',  // Secondary dark background
  accent: 'var(--color-accent)',        // Accents, borders, highlights
  light: 'var(--color-light)',          // Light mode background
}
```

### 3. Usage in Components

Use semantic color names in your Tailwind classes:

```tsx
// CORRECT - Uses semantic colors
<div className="bg-white dark:bg-primary">
<div className="bg-light dark:bg-secondary">
<div className="border border-gray-200 dark:border-accent">
<div className="text-accent dark:text-accent">
<div className="bg-accent/30">  // 30% opacity

// WRONG - Hardcoded colors
<div className="dark:bg-blue-900">
<div className="bg-teal-500">
<div className="text-navy-dark">
```

## Color Usage Pattern

### Light Mode
- Background: `bg-white` or `bg-light` (very light gray)
- Text: Standard gray scales (`text-gray-900`, `text-gray-600`, etc.)

### Dark Mode
- **Primary Background**: `dark:bg-primary` (#0C2B4E) - Darkest navy
- **Secondary Background**: `dark:bg-secondary` (#1A3D64) - Medium navy
- **Accent/Borders**: `dark:border-accent` (#1D546C) - Teal
- **Accent Elements**: `dark:bg-accent/30`, `dark:text-accent`
- **Text**: `dark:text-white`, `dark:text-gray-300`

### Section Alternation
Pages typically alternate backgrounds for visual hierarchy:

```tsx
<section className="bg-white dark:bg-primary">...</section>
<section className="bg-light dark:bg-secondary">...</section>
<section className="bg-white dark:bg-primary">...</section>
```

## Examples

### Card Component
```tsx
<div className="bg-white dark:bg-secondary border border-gray-200 dark:border-accent">
  <h3 className="text-gray-900 dark:text-white">Card Title</h3>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

### Button with Accent Color
```tsx
<button className="bg-accent hover:bg-accent/90 text-white">
  Click Me
</button>
```

### Icon Container
```tsx
<div className="bg-accent/30 text-accent dark:bg-accent/30 dark:text-accent">
  <IconComponent />
</div>
```

### Navbar/Footer
```tsx
<nav className="bg-white dark:bg-primary border-b border-gray-200 dark:border-accent">
  ...
</nav>
```

## Changing the Color Scheme

### Example: Change to Purple Theme

Edit `/styles/globals.css`:

```css
:root {
  --color-primary: #2D1B69;    /* Dark purple */
  --color-secondary: #3F2A8B;  /* Medium purple */
  --color-accent: #9B51E0;     /* Bright purple */
  --color-light: #F8F7FF;      /* Very light purple */
}
```

**That's it!** The entire site will update automatically.

### Example: Change to Green Theme

```css
:root {
  --color-primary: #0F2E1C;    /* Dark forest green */
  --color-secondary: #1A4D2E;  /* Medium green */
  --color-accent: #4ADE80;     /* Bright green */
  --color-light: #F0FDF4;      /* Very light green */
}
```

## Current Theme
Your site currently uses a **Navy & Teal** color scheme:
- Primary: #0C2B4E (Dark navy)
- Secondary: #1A3D64 (Medium navy)
- Accent: #1D546C (Teal)
- Light: #F4F4F4 (Light gray)

## Rules
1. **NEVER** hardcode color values in component files
2. **ALWAYS** use semantic names: `primary`, `secondary`, `accent`, `light`
3. **ALL** color changes must be made in `/styles/globals.css` only
4. Use standard Tailwind gray scales for text and subtle elements
5. Reserve `accent` color for highlights, borders, and interactive elements

## Files Affected by Theme
- `/styles/globals.css` - Color definitions (EDIT HERE ONLY)
- `/tailwind.config.js` - Color mapping (DO NOT EDIT unless adding new colors)
- All page and component files use semantic color names

## Benefits
✅ Change entire site color scheme in seconds  
✅ Consistent theming across all pages  
✅ Easy maintenance  
✅ No need to edit multiple files  
✅ Theme changes are centralized and predictable
