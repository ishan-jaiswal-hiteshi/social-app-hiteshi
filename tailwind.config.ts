import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF0000",
          light: "#F70D1A",
          dark: "#E41B17",
        },
        secondary: {
          DEFAULT: "#0020C2",
          light: "#1F45FC",
          dark: "#000080",
        },
      },
      fontFamily: {
        spaceGrotesk: ["Space Grotesk", "sans-serif"],
      },
      screens: {
        'above-1148': '1148px', 
        'above-1450': '1450px', 
      },
    },
  },
  plugins: [],
} satisfies Config;
