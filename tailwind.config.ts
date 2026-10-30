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
        // 1. Royal Obsidian Noir (Base & Surface)
        obsidian: {
          DEFAULT: "#08090C",
          950: "#08090C", // Deepest Onyx Black base
          900: "#0D0F14", // Surface Dark
          850: "#10131A", // Dark Slate Surface
          800: "#13161F", // Card Glass Surface
          700: "#1A1F2C", // Elevated Surface
          600: "#242A3B", // Border Dark
        },
        // 2. Royal Liquid Gold & Metallic Champagne
        gold: {
          DEFAULT: "#D4AF37",
          50: "#FDFBF7",
          100: "#FAF5E8",
          200: "#F5E296", // Champagne Light
          300: "#E6CA65", // Liquid Gold
          400: "#D4AF37", // Metallic Champagne Gold Primary
          500: "#C5A059", // Rich Antique Gold
          600: "#B8860B", // Burnished Gold
          700: "#8C6527",
          800: "#5C4318",
          900: "#38280E",
          950: "#1F1505",
        },
        // 3. Purged OUD SHOP spec tokens mapped to Royal Obsidian & Gold
        color: {
          1: "#D4AF37", // Royal Gold Primary
          2: "#E2E8F0", // Platinum Body Text
          3: "#F5E296", // Accent Champagne
          4: "#94A3B8", // Platinum Muted
          5: "rgba(212, 175, 55, 0.2)", // Gold Border
          6: "#08090C", // Deep Obsidian Background
          7: "#F8F9FA", // Crisp Ivory
        },
        // 4. Named Semantic Tokens
        oud: {
          surface: "#08090C",
          surfaceLight: "#13161F",
          text: "#E2E8F0",
          accent: {
            DEFAULT: "#D4AF37",
            hover: "#F5E296",
            subtle: "rgba(212, 175, 55, 0.12)",
          },
          heading: "#F8F9FA",
          border: {
            DEFAULT: "rgba(212, 175, 55, 0.2)",
            dark: "#13161F",
            light: "rgba(255, 255, 255, 0.08)",
          },
          subtle: "#94A3B8",
          white: "#F8F9FA",
        },
        // 5. Mapped Brand Palette (Replaced muddy green with Gold / Obsidian)
        brand: {
          green: {
            50: "rgba(212, 175, 55, 0.08)",
            100: "rgba(212, 175, 55, 0.15)",
            200: "rgba(212, 175, 55, 0.25)",
            300: "#E6CA65",
            400: "#D4AF37",
            500: "#C5A059",
            600: "#B8860B",
            700: "#D4AF37",
            800: "#D4AF37",
            900: "#0D0F14",
            950: "#08090C",
          },
          gold: {
            50: "#FDFBF7",
            100: "#FAF5E8",
            200: "#F5E296",
            300: "#E6CA65",
            400: "#D4AF37",
            500: "#C5A059",
            600: "#B8860B",
            700: "#8C6527",
            800: "#5C4318",
            900: "#38280E",
            950: "#1F1505",
          },
          neutral: {
            50: "#08090C",
            100: "#0D0F14",
            200: "rgba(255, 255, 255, 0.08)",
            300: "rgba(255, 255, 255, 0.15)",
            400: "#94A3B8",
            500: "#CBD5E1",
            600: "#E2E8F0",
            700: "#F1F5F9",
            800: "#F8F9FA",
            900: "#FFFFFF",
            950: "#FFFFFF",
          },
        },
      },
      // Spacing Scale
      spacing: {
        "space-1": "2px",
        "space-2": "3px",
        "space-3": "5px",
        "space-4": "7px",
        "space-5": "8px",
        "space-6": "10px",
        "space-7": "12px",
        "space-8": "13px",
        "space-9": "15px",
        "space-10": "16px",
        "space-11": "23px",
        "space-12": "25px",
        "space-13": "26px",
        "space-14": "30px",
        "space-15": "38px",
      },
      borderRadius: {
        "radius-sm": "3px",
        "radius-md": "50px",
        "radius-lg": "80px",
        "radius-xl": "100%",
        "radius-full": "9999px",
        "oud-sm": "3px",
        "oud-md": "50px",
        "oud-lg": "80px",
        "oud-full": "9999px",
      },
      boxShadow: {
        "gold-sm": "0 0 15px rgba(212, 175, 55, 0.15)",
        "gold-md": "0 0 30px rgba(212, 175, 55, 0.25)",
        "gold-lg": "0 0 50px rgba(212, 175, 55, 0.35)",
        "obsidian-card": "0 8px 32px 0 rgba(0, 0, 0, 0.6)",
        "shadow-sm": "0 2px 8px rgba(0, 0, 0, 0.4)",
        "shadow-md": "0 4px 20px rgba(212, 175, 55, 0.15)",
        "oud-sm": "0 4px 20px rgba(0, 0, 0, 0.4)",
        "oud-md": "0 8px 32px rgba(212, 175, 55, 0.2)",
      },
      fontSize: {
        "text-xs": ["10px", { lineHeight: "14.4px" }],
        "text-sm": ["12px", { lineHeight: "16.8px" }],
        "text-base": ["14px", { lineHeight: "21px" }],
        "text-lg": ["16px", { lineHeight: "22.4px" }],
        "text-xl": ["18px", { lineHeight: "25.6px" }],
        "text-2xl": ["25px", { lineHeight: "35.06px" }],
        "text-3xl": ["27px", { lineHeight: "45.9px" }],
        "text-4xl": ["35px", { lineHeight: "53.73px" }],
        "text-9": ["45px", { lineHeight: "56.1px" }],
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "Jost", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-cinzel)", "Cinzel", "Playfair Display", "serif"],
        arabic: ["var(--font-amiri)", "Amiri", "Traditional Arabic", "serif"],
      },
      screens: {
        xs: "360px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
export default config;
