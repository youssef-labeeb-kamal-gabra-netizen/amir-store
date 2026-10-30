/**
 * Amir Store - Master Blend Design Tokens
 * Harmonized from Haute Parfumerie Editorial (Design 1),
 * Haute Parfumerie Royale (Design 2), and Luminous Haute-Couture (Design 3).
 */

export const MASTER_TOKENS = {
  colors: {
    // Alabaster & Parchment Surfaces (Design 1 & 2)
    surface: "#FFF9EE",
    surfaceDim: "#E0D9CD",
    surfaceBright: "#FFF9EE",
    surfaceContainerLowest: "#FFFFFF",
    surfaceContainerLow: "#FAF3E6",
    surfaceContainer: "#F4EDE0",
    surfaceContainerHigh: "#EEE7DB",
    surfaceContainerHighest: "#E8E2D5",

    // Deep Noir & Obsidian Bases (Design 1 & 2)
    noirObsidian: "#110802",
    noirEspresso: "#1E1B14",
    noirMidnight: "#08090C",
    noirCabinet: "#2A1F14",

    // Imperial 24k Liquid Gold (Design 1 & 2)
    goldFoil: "#D4AF37",
    goldImperial: "#D4AF57",
    goldAntique: "#775A04",
    goldShimmer: "#F5E296",
    goldContainer: "#FDD579",

    // Haute Velvet Accents (Design 2)
    velvetRose: "#8D4A5C",
    velvetRoseLight: "#EE9CB0",

    // Admin Command Center Onyx & Gold (Design 3)
    adminBg: "#1D100B",
    adminSurface: "#2B1C17",
    adminSurfaceHigh: "#3A2A1A",
    adminGold: "#C8A24A",
    adminGoldDark: "#785A00",
    adminSand: "#DAC2B0",
    adminBorder: "#4A3525",

    // Neutral Text Tokens
    textPrimary: "#110802",
    textMuted: "#4D453E",
    textLight: "#FFF9EE",
    textWhite: "#FFFFFF",
    textGold: "#D4AF37",
  },

  motion: {
    ease: {
      sovereignOut: [0.22, 1, 0.36, 1],
      curtainReveal: [0.65, 0, 0.35, 1],
      softSnap: [0.16, 1, 0.3, 1],
    },
    duration: {
      micro: 0.25,
      standard: 0.75,
      cinematic: 1.4,
      ceremonial: 2.2,
    },
    stagger: {
      fast: 0.06,
      editorial: 0.12,
      cards: 0.15,
    },
  },

  fonts: {
    display: "'Playfair Display', 'Bodoni Moda', Georgia, serif",
    arabic: "'Amiri', 'Tajawal', 'Cairo', serif",
    sans: "'Hanken Grotesk', 'Inter', system-ui, sans-serif",
  },
} as const;

export default MASTER_TOKENS;
