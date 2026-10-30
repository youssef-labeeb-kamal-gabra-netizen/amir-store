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
        // Dedicated OUD SHOP Tokens
        oud: {
          surface: "#EEEBE7", // Surface (color-6)
          surfaceLight: "#DFDDD4", // Surface subtle (color-4)
          text: "#696969", // Text primary (color-2)
          heading: "#2E3A24", // Headings & brand border (color-1)
          accent: {
            DEFAULT: "#56CFE1", // Accent (color-3)
            hover: "#3eb8cb",
            subtle: "#f0fcfe",
          },
          border: {
            DEFAULT: "#DFDDD4",
            light: "#DDDDDD", // Border light (color-5)
            dark: "#2E3A24", // Border dark (color-1)
          },
        },
        // Mapped Brand system for smooth migration of existing components
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
            800: "#2E3A24", // Exact OUD SHOP Dark Olive
            900: "#232d1c",
            950: "#13190e",
          },
          gold: {
            50: "#f0fcfe",
            100: "#daf6fc",
            200: "#b9eff9",
            300: "#87e2f4",
            400: "#56CFE1", // Exact OUD SHOP Accent
            500: "#2abed5",
            600: "#1c99b0",
            700: "#1b7a8d",
            800: "#1d6473",
            900: "#1d535f",
            950: "#0e343d",
          },
          neutral: {
            50: "#EEEBE7", // Exact OUD SHOP Surface
            100: "#DFDDD4", // Exact OUD SHOP Text Light / Surface 2
            200: "#DDDDDD", // Exact OUD SHOP Border
            300: "#c7c5bc",
            400: "#999890",
            500: "#696969", // Exact OUD SHOP Text Primary
            600: "#545454",
            700: "#3d3d3d",
            800: "#2b2b2b",
            900: "#1e221b",
            950: "#141712",
          },
        },
      },
      borderRadius: {
        "oud-sm": "3px",
        "oud-md": "50px",
        "oud-lg": "80px",
        "oud-full": "9999px",
      },
      boxShadow: {
        "oud-sm": "1px 1px 3px 0px rgba(0, 0, 0, 0.3)",
        "oud-md": "0px 0px 6px 0px rgb(46, 58, 36)",
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "system-ui", "-apple-system", "sans-serif"],
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
