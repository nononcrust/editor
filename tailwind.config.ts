import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  fontFamily: {
    sans: ["var(--font-pretendard)", ...defaultTheme.fontFamily.sans],
  },
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--background)",
          100: "var(--background-100)",
          200: "var(--background-200)",
          hover: "var(--background-hover)",
        },
        main: "var(--main)",
        sub: "var(--sub)",
        subtle: "var(--subtle)",
        placeholder: "var(--placeholder)",
        border: "var(--border)",
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          lighter: "var(--primary-lighter)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          dark: "var(--secondary-dark)",
        },
        error: {
          DEFAULT: "var(--error)",
          dark: "var(--error-dark)",
          lighter: "var(--error-lighter)",
        },
        ring: {
          DEFAULT: "var(--ring)",
          error: "var(--ring-error)",
        },
      },
      keyframes: {
        "dropdown-open": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "dialog-open": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "dropdown-open": "dropdown-open 0.15s ease-out",
        "dialog-open": "dialog-open 0.15s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config;
