/**
 * Centralized Design System Tokens for Amir Store
 * Royal Obsidian Noir & Liquid Gold Luxury Specification
 */

export const tokens = {
  // Raw Royal Obsidian Noir & Liquid Gold Tokens
  raw: {
    color1: "#D4AF37", // Role: Royal Gold Primary
    color2: "#E2E8F0", // Role: Platinum Text Primary
    color3: "#F5E296", // Role: Champagne Accent
    color4: "#94A3B8", // Role: Muted Text
    color5: "rgba(212, 175, 55, 0.2)", // Role: Gold Border
    color6: "#08090C", // Role: Deep Obsidian Base
    color7: "#F8F9FA", // Role: Crisp Ivory
  },

  // Semantic Mappings
  colors: {
    primary: {
      default: "#D4AF37", // Metallic Champagne Gold
      hover: "#F5E296",
      subtle: "rgba(212, 175, 55, 0.12)",
      border: "rgba(212, 175, 55, 0.3)",
    },
    accent: {
      default: "#F5E296",
      hover: "#FAF5E8",
      subtle: "rgba(245, 226, 150, 0.15)",
      border: "#F5E296",
    },
    surface: {
      canvas: "#08090C", // Deep Obsidian Onyx
      card: "#13161F",   // Obsidian Glass
      muted: "#0D0F14",  // Dark Slate
      elevated: "#1A1F2C",
    },
    text: {
      primary: "#F8F9FA", // Crisp Ivory
      heading: "#F8F9FA",
      secondary: "#E2E8F0", // Platinum
      light: "#94A3B8",
      inverted: "#08090C",
    },
    border: {
      subtle: "rgba(255, 255, 255, 0.08)",
      default: "rgba(212, 175, 55, 0.2)",
      dark: "rgba(212, 175, 55, 0.4)",
      focus: "#D4AF37",
    },
    status: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#D4AF37",
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
    sm: "rounded-[4px]",
    md: "rounded-[50px]",
    lg: "rounded-[80px]",
    xl: "rounded-full",
    full: "rounded-full",
  },

  // Elevation
  shadows: {
    sm: "shadow-[0_2px_8px_rgba(0,0,0,0.5)]",
    md: "shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]",
    goldSm: "shadow-[0_0_15px_rgba(212,175,55,0.2)]",
    goldMd: "shadow-[0_0_30px_rgba(212,175,55,0.35)]",
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
      black: 900,
    },
  },

  containers: {
    standard: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    narrow: "max-w-4xl mx-auto px-4 sm:px-6",
    wide: "max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8",
  },
};
