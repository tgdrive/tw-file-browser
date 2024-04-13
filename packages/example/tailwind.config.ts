import type { Config } from "tailwindcss";
import { material3 } from "@tw-material/theme";

export default {
  content: ["./**/*.{js,ts,jsx,tsx,mdx,html}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        xl: "2rem",
        "2xl": "3rem",
      },
    },
  },
  plugins: [
    material3({
      sourceColor: "#8B4E4B",
      customColors: [],
    }),
  ],
} satisfies Config;
