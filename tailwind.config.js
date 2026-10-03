/** @type {import('tailwindcss').Config} */

import typography from "@tailwindcss/typography";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        // measured rgba(0,0,0,.6); no alpha modifiers in src (audited at P1)
        muted: "rgb(var(--muted) / 0.6)",
        card: "rgb(var(--card) / <alpha-value>)",
        // measured hairline rgba(0,0,0,.1); no alpha modifiers in src (audited at P1)
        border: "rgb(var(--border) / 0.1)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-2": "rgb(var(--accent-2) / <alpha-value>)",
        "header-bg": "rgb(var(--header-bg) / <alpha-value>)",
        "header-fg": "rgb(var(--header-fg) / <alpha-value>)",
        "header-border": "rgb(var(--header-border) / 0.15)",
        "footer-text": "rgb(var(--footer-text) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / 0.08)",
        "surface-3": "rgb(var(--surface-3) / 0.04)",
        "surface-4": "rgb(var(--surface-4) / 0.02)",
      },
      backgroundImage: {
        spectrum: "var(--accent-spectrum)",
      },
      fontFamily: {
        display: ['"Helvetica Neue"', "Arial", "ui-sans-serif", "system-ui", "sans-serif"],
        accent: ['"Silkscreen"', "ui-monospace", "Menlo", "monospace"],
      },
      maxWidth: {
        site: "1440px",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(0,0,0,0.08)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [typography],
};
