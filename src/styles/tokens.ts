/**
 * Centralized Design System Tokens for Ameer Store (Strict OUD SHOP Specification)
 * Matches https://oud-shop.com design tokens 100%.
 */

export const tokens = {
  // Raw OUD SHOP Tokens
  raw: {
    color1: "#2E3A24", // Role: Border
    color2: "#696969", // Role: Text Primary
    color3: "#56CFE1", // Role: Accent
    color4: "#DFDDD4", // Role: Text Light
    color5: "#DDDDDD", // Role: Border
    color6: "#EEEBE7", // Role: Surface
    color7: "#FFFFFF", // Role: Text Light
  },

  // Semantic Mappings
  colors: {
    primary: {
      default: "#2E3A24", // color-1
      hover: "#242e1d",
      subtle: "#EEEBE7", // color-6
      border: "#2E3A24", // color-1
    },
    accent: {
      default: "#56CFE1", // color-3
      hover: "#3eb8cb",
      subtle: "#f0fcfe",
      border: "#56CFE1",
    },
    surface: {
      canvas: "#EEEBE7", // color-6
      card: "#FFFFFF",   // color-7
      muted: "#DFDDD4",  // color-4
      elevated: "#FFFFFF",
    },
    text: {
      primary: "#696969", // color-2
      heading: "#2E3A24", // color-1
      secondary: "#696969",
      light: "#DFDDD4",   // color-4
      inverted: "#FFFFFF",// color-7
    },
    border: {
      subtle: "#DDDDDD", // color-5
      default: "#DFDDD4",// color-4
      dark: "#2E3A24",   // color-1
      focus: "#56CFE1",  // color-3
    },
    status: {
      success: "#2E3A24",
      warning: "#d97706",
      error: "#dc2626",
      info: "#56CFE1",
    },
  },

  // Spacing (Base unit: 4px)
  spacing: {
    base: "4px",
    space1: "2px",
    space2: "3px",
    space3: "5px",
    space4: "7px",
    space5: "8px",
    space6: "10px",
    space7: "12px",
    space8: "13px",
    space9: "15px",
    space10: "16px",
    space11: "23px",
    space12: "25px",
    space13: "26px",
    space14: "30px",
    space15: "38px",
  },

  // Shapes & Border Radius
  radius: {
    sm: "rounded-[3px]",
    md: "rounded-[50px]",
    lg: "rounded-[80px]",
    xl: "rounded-full",
    full: "rounded-full",
  },

  // Elevation
  shadows: {
    sm: "shadow-[1px_1px_3px_0px_rgba(0,0,0,0.3)]",
    md: "shadow-[0px_0px_6px_0px_rgb(46,58,36)]",
  },

  // Motion
  motion: {
    fast: "all 0.15s ease",
    base: "0.3s ease-in-out",
    slow: "0.35s cubic-bezier(0.25, 0.1, 0.25, 1)",
  },

  typography: {
    fontFamily: "var(--font-cairo), Jost, sans-serif",
    sizes: {
      textXs: "text-[10px] leading-[14.4px]",
      textSm: "text-[12px] leading-[16.8px]",
      textBase: "text-[14px] leading-[21px]",
      textLg: "text-[16px] leading-[22.4px]",
      textXl: "text-[18px] leading-[25.6px]",
      text2xl: "text-[25px] leading-[35.06px]",
      text3xl: "text-[27px] leading-[45.9px]",
      text4xl: "text-[35px] leading-[53.73px]",
      text9: "text-[45px] leading-[56.1px]",
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  containers: {
    standard: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    narrow: "max-w-4xl mx-auto px-4 sm:px-6",
    wide: "max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8",
  },
};
