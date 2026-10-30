/**
 * Centralized Design System Tokens for Ameer Store (OUD SHOP Model)
 * Pure luxury oriental fragrance aesthetic.
 */

export const tokens = {
  colors: {
    primary: {
      default: "#2E3A24", // Deep Olive / Oud Dark (color-1)
      hover: "#242e1d",
      subtle: "#EEEBE7", // Surface cream (color-6)
      border: "#2E3A24",
    },
    accent: {
      default: "#56CFE1", // Electric Cyan Accent (color-3)
      hover: "#2abed5",
      subtle: "#f0fcfe",
      border: "#56CFE1",
    },
    secondary: {
      default: "#56CFE1", // Accent
      hover: "#2abed5",
      subtle: "#f0fcfe",
      border: "#87e2f4",
    },
    surface: {
      canvas: "#EEEBE7", // Main background (color-6)
      card: "#FFFFFF",   // Card surface (color-7)
      muted: "#DFDDD4",  // Subtle light beige (color-4)
      elevated: "#FFFFFF",
    },
    text: {
      primary: "#2E3A24", // Headings & Strong identity
      body: "#696969",    // Body text (color-2)
      secondary: "#696969",
      muted: "#9e9d96",
      light: "#DFDDD4",   // Light text (color-4)
      inverted: "#FFFFFF",
    },
    border: {
      subtle: "#DDDDDD", // Light Border (color-5)
      default: "#DFDDD4",
      dark: "#2E3A24",   // Strong Border (color-1)
      focus: "#56CFE1",
    },
    status: {
      success: "#2E3A24",
      warning: "#d97706",
      error: "#dc2626",
      info: "#56CFE1",
    },
  },
  typography: {
    fontFamily: "var(--font-cairo), system-ui, sans-serif",
    sizes: {
      display: "text-3xl md:text-5xl font-extrabold leading-tight",
      h1: "text-2xl md:text-4xl font-bold leading-snug",
      h2: "text-xl md:text-3xl font-bold leading-snug",
      h3: "text-lg md:text-2xl font-semibold leading-normal",
      h4: "text-base md:text-xl font-semibold leading-normal",
      bodyLarge: "text-base md:text-lg leading-relaxed",
      body: "text-sm md:text-base leading-relaxed",
      bodySmall: "text-xs md:text-sm leading-normal",
      caption: "text-xs leading-normal",
    },
  },
  radius: {
    sm: "rounded-[3px]",
    md: "rounded-[50px]",
    lg: "rounded-[80px]",
    full: "rounded-full",
  },
  shadows: {
    sm: "shadow-[1px_1px_3px_0px_rgba(0,0,0,0.3)]",
    md: "shadow-[0px_0px_6px_0px_rgb(46,58,36)]",
    lg: "shadow-lg",
  },
  containers: {
    standard: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    narrow: "max-w-4xl mx-auto px-4 sm:px-6",
    wide: "max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8",
  },
};
