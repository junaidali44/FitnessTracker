/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Base blacks
        black: {
          DEFAULT: "#0a0a0a",
          soft: "#0f0f0f",
          elevated: "#141414",
          card: "#1a1a1a",
          border: "#262626",
        },
        // Crimson red system
        crimson: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626", // PRIMARY
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        // Accent rose-red (for gradients)
        accent: {
          DEFAULT: "#e11d48",
          light: "#f43f5e",
          dark: "#be123c",
        },
        // Text
        text: {
          primary: "#fafafa",
          secondary: "#a1a1aa",
          muted: "#71717a",
          disabled: "#52525b",
        },
        // Status
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#dc2626",
        info: "#3b82f6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"Clash Display"', '"Satoshi"', "Inter", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      backgroundImage: {
        "crimson-gradient": "linear-gradient(135deg, #dc2626 0%, #e11d48 100%)",
        "crimson-soft":
          "linear-gradient(135deg, rgba(220,38,38,0.15) 0%, rgba(225,29,72,0.15) 100%)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(26,26,26,0.8) 0%, rgba(20,20,20,0.6) 100%)",
        "hero-radial":
          "radial-gradient(ellipse at top, rgba(220,38,38,0.15) 0%, transparent 50%)",
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "50px 50px",
      },
      boxShadow: {
        "glow-sm": "0 0 20px rgba(220,38,38,0.15)",
        glow: "0 0 30px rgba(220,38,38,0.25)",
        "glow-lg": "0 0 60px rgba(220,38,38,0.3)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.6)",
        "inner-glow": "inset 0 1px 0 0 rgba(255,255,255,0.05)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "fade-up": "fadeUp 0.4s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "-1000px 0" },
          to: { backgroundPosition: "1000px 0" },
        },
      },
      transitionDuration: {
        250: "250ms",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
