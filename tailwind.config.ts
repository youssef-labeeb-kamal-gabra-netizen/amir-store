import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Master Blend: Alabaster & Royal Parchment (Design 1 & 2)
        surface: {
          DEFAULT: "#FFF9EE",
          dim: "#E0D9CD",
          bright: "#FFF9EE",
          lowest: "#FFFFFF",
          low: "#FAF3E6",
          container: "#F4EDE0",
          high: "#EEE7DB",
          highest: "#E8E2D5",
        },

        // Master Blend: Imperial 24k Liquid Gold & Metallic Champagne
        gold: {
          DEFAULT: "#D4AF37",
          50: "#FDFBF7",
          100: "#FAF5E8",
          200: "#F5E296",
          300: "#E6CA65",
          400: "#D4AF37", // Primary Liquid Gold
          500: "#C8A24A", // Antique Warm Gold
          600: "#B89630",
          700: "#775A04", // Deep Imperial Accent
          800: "#594200",
          900: "#3D2D00",
        },

        // Master Blend: Royal Obsidian & Deep Noir Base
        obsidian: {
          DEFAULT: "#08090C",
          950: "#08090C", // Deepest Onyx base
          900: "#0D0F14", // Surface Dark
          850: "#110802", // Black Amber Noir
          800: "#1E1B14", // Deep Espresso
          700: "#2A1F14", // Cabinet Bronze
          600: "#3A2A1A",
        },

        // Master Blend: Haute Velvet Rose (Design 2)
        velvet: {
          DEFAULT: "#8D4A5C",
          light: "#EE9CB0",
          dark: "#6F3143",
        },

        // Master Blend: Admin Command Center Onyx & Gold (Design 3)
        admin: {
          bg: "#1D100B",
          surface: "#2B1C17",
          card: "#3A2A1A",
          gold: "#C8A24A",
          goldDark: "#785A00",
          sand: "#DAC2B0",
          border: "#4A3525",
        },

        // Backward Compatible Brand Tokens
        brand: {
          primary: "#D4AF37",
          accent: "#F5E296",
          dark: "#08090C",
          darkSurface: "#0D0F14",
          light: "#FFF9EE",
          cream: "#FAF3E6",
          text: "#110802",
        },
      },
      fontFamily: {
        serif: ["'Amiri'", "'Playfair Display'", "'Bodoni Moda'", "Georgia", "serif"],
        display: ["'Playfair Display'", "'Bodoni Moda'", "serif"],
        arabic: ["'Amiri'", "'Tajawal'", "'Cairo'", "serif"],
        sans: ["'Hanken Grotesk'", "'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "gold-glow": "0 0 35px -5px rgba(212, 175, 55, 0.28)",
        "gold-glow-lg": "0 0 60px -10px rgba(212, 175, 55, 0.35)",
        "gold-hairline": "0 0 0 1px rgba(212, 175, 55, 0.35)",
        "flacon-vitrine": "0 24px 64px -12px rgba(17, 8, 2, 0.15)",
        "admin-card": "0 4px 20px -2px rgba(29, 16, 11, 0.25)",
      },
      transitionTimingFunction: {
        sovereign: "cubic-bezier(0.22, 1, 0.36, 1)",
        curtain: "cubic-bezier(0.65, 0, 0.35, 1)",
        snap: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
