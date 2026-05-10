/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // MatriPrime Brand Colors - Neon Lime on Black
        primary: {
          DEFAULT: "#84cc16",
          light: "#a3e635",
          dark: "#65a30d",
          glow: "rgba(132, 204, 22, 0.5)",
        },
        secondary: {
          DEFAULT: "#22c55e",
          light: "#4ade80",
          dark: "#16a34a",
        },
        accent: {
          DEFAULT: "#84cc16",
          light: "#a3e635",
          dark: "#65a30d",
        },
        danger: {
          DEFAULT: "#ef4444",
          light: "#f87171",
          dark: "#dc2626",
        },
        warning: {
          DEFAULT: "#f59e0b",
          light: "#fbbf24",
          dark: "#d97706",
        },
        background: {
          DEFAULT: "#0a0a0a",
          card: "#141414",
          surface: "#1f1f1f",
          elevated: "#2a2a2a",
        },
        text: {
          primary: "#ffffff",
          muted: "#737373",
          secondary: "#a3a3a3",
        },
        border: {
          DEFAULT: "#262626",
          light: "#404040",
        },
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "gradient": "gradient 8s ease infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "tilt": "tilt 10s infinite linear",
        "float": "float 6s ease-in-out infinite",
        "shake": "shake 0.5s ease-in-out",
        "confetti": "confetti 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "scroll": "scroll 30s linear infinite",
        "scroll-reverse": "scroll-reverse 30s linear infinite",
        "fade-up": "fade-up 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
      },
      keyframes: {
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        tilt: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(2deg)" },
          "75%": { transform: "rotate(-2deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-10px)" },
          "75%": { transform: "translateX(10px)" },
        },
        confetti: {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(-100px) rotate(360deg)", opacity: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(132, 204, 22, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(132, 204, 22, 0.6)" },
        },
        "scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      boxShadow: {
        "glow": "0 0 20px rgba(132, 204, 22, 0.3)",
        "glow-lg": "0 0 40px rgba(132, 204, 22, 0.4)",
        "glow-success": "0 0 20px rgba(34, 197, 94, 0.3)",
        "glow-danger": "0 0 20px rgba(239, 68, 68, 0.3)",
        "glow-warning": "0 0 20px rgba(245, 158, 11, 0.3)",
        "card": "0 4px 20px rgba(0, 0, 0, 0.5)",
        "card-hover": "0 8px 40px rgba(0, 0, 0, 0.7)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #84cc16 0%, #22c55e 100%)",
        "gradient-dark": "linear-gradient(180deg, #0a0a0a 0%, #141414 100%)",
        "gradient-card": "linear-gradient(145deg, #1f1f1f 0%, #141414 100%)",
        "gradient-glow": "radial-gradient(circle at center, rgba(132, 204, 22, 0.15) 0%, transparent 70%)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 1, 1)',
      }
    },
  },
  plugins: [],
}
