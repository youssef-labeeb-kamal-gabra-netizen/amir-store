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
        // 1. Direct OUD SHOP Spec Tokens (color-1 to color-7)
        color: {
          1: "#2E3A24", // Border / Dark Olive Primary
          2: "#696969", // Text Primary
          3: "#56CFE1", // Accent (Cyan)
          4: "#DFDDD4", // Text Light / Surface Subtle
          5: "#DDDDDD", // Border Light
          6: "#EEEBE7", // Surface Background
          7: "#FFFFFF", // Text Light / Pure White
        },
        // 2. Named Semantic OUD SHOP Tokens
        oud: {
          surface: "#EEEBE7",      // color-6 (Surface)
          text: "#696969",         // color-2 (Text Primary)
          accent: {
            DEFAULT: "#56CFE1",    // color-3 (Accent)
            hover: "#3eb8cb",
            subtle: "#f0fcfe",
          },
          heading: "#2E3A24",      // color-1 (Dark Olive Heading)
          border: {
            DEFAULT: "#DFDDD4",    // color-4
            dark: "#2E3A24",       // color-1 (Border)
            light: "#DDDDDD",      // color-5 (Border)
          },
          subtle: "#DFDDD4",       // color-4 (Text Light)
          white: "#FFFFFF",        // color-7 (Text Light / White)
        },
        // 3. Mapped Brand Palette for existing codebase
        brand: {
          green: {
            50: "#f6f8f4",
            100: "#eaf0e6",
            200: "#d5e2cd",
            300: "#b5cda8",
            400: "#8fb27e",
            500: "#6e945c",
            600: "#557646",
            700: "#435d37",
            800: "#2E3A24", // color-1 (#2E3A24)
            900: "#232d1c",
            950: "#13190e",
          },
          gold: {
            50: "#FAF7EE",
            100: "#F5EFD7",
            200: "#EBDDB0",
            300: "#DFC582",
            400: "#D4AF37", // Burnished Gold Primary
            500: "#C5A059",
            600: "#A8833B",
            700: "#876629",
            800: "#694E21",
            900: "#4D381A",
            950: "#2B1E0C",
          },
          neutral: {
            50: "#EEEBE7", // color-6 (#EEEBE7)
            100: "#DFDDD4", // color-4 (#DFDDD4)
            200: "#DDDDDD", // color-5 (#DDDDDD)
            300: "#c7c5bc",
            400: "#999890",
            500: "#696969", // color-2 (#696969)
            600: "#545454",
            700: "#3d3d3d",
            800: "#2b2b2b",
            900: "#1e221b",
            950: "#141712",
          },
        },
      },
      // Exact OUD SHOP Spacing Scale (Base unit: 4px)
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
      // Exact OUD SHOP Shapes & Border Radius
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
      // Exact OUD SHOP Elevation & Shadows
      boxShadow: {
        "shadow-sm": "1px 1px 3px 0px rgba(0, 0, 0, 0.3)",
        "shadow-md": "0px 0px 6px 0px rgb(46, 58, 36)",
        "oud-sm": "1px 1px 3px 0px rgba(0, 0, 0, 0.3)",
        "oud-md": "0px 0px 6px 0px rgb(46, 58, 36)",
      },
      // Exact OUD SHOP Typography Sizes
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
