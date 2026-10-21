import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FF6B1A",
          50:  "#FFF4E5", 100: "#FFE8D1", 200: "#FFD0A3", 300: "#FFB370",
          400: "#FF8A3D", 500: "#FF6B1A", 600: "#E85A0C", 700: "#C24908",
          800: "#9A3A06", 900: "#7A2F05",
        },
        ink:  { DEFAULT: "#171717", 2: "#222222" },
        soft: "#F7F7F5", line: "#E7E7E4", mut: "#6B6B6B",
        ok: "#16A34A", warn: "#F59E0B",
      },
      fontFamily: { sans: ["var(--font-jakarta)", "system-ui", "sans-serif"] },
      maxWidth: { wrap: "1160px" },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;