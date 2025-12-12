import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bitcoin: "#F7931A",
        gold: "#FFD700",
        background: "#0A0A0A",
        card: "#1A1A1A",
        textSecondary: "#A0A0A0",
      },
    },
  },
  plugins: [],
};

export default config;
