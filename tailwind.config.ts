import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#15130f",
          900: "#15130f",
          800: "#221f19",
          700: "#332d24",
        },
        paper: {
          DEFAULT: "#f7f2e9",
          50: "#fdfbf6",
          100: "#f7f2e9",
          200: "#efe6d4",
          300: "#e4d6bd",
        },
        bronze: {
          DEFAULT: "#a9793f",
          400: "#c79a5c",
          500: "#a9793f",
          600: "#8a6032",
          700: "#6c4a27",
        },
        moss: {
          DEFAULT: "#4c5b45",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(21, 19, 15, 0.35)",
        card: "0 1px 0 rgba(21,19,15,0.05), 0 12px 30px -18px rgba(21,19,15,0.25)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.4s linear infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
