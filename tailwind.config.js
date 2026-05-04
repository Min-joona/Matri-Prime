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
        primary: {
          DEFAULT: "#6366F1",
          light: "#818CF8",
          dark: "#4F46E5",
        },
        secondary: {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
          dark: "#D97706",
        },
        accent: {
          DEFAULT: "#10B981",
          light: "#34D399",
          dark: "#059669",
        },
        danger: {
          DEFAULT: "#EF4444",
          light: "#F87171",
          dark: "#DC2626",
        },
        background: {
          DEFAULT: "#0F172A",
          card: "#1E293B",
          surface: "#334155",
        },
        text: {
          primary: "#F8FAFC",
          muted: "#94A3B8",
          secondary: "#CBD5E1",
        },
        slate: {
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
          600: "#475569",
          500: "#64748B",
          400: "#94A3B8",
          300: "#CBD5E1",
          200: "#E2E8F0",
          100: "#F1F5F9",
          50: "#F8FAFC",
        }
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "Geist", "system-ui", "sans-serif"],
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
      },
      boxShadow: {
        "glow": "0 0 20px rgba(99, 102, 241, 0.3)",
        "glow-success": "0 0 20px rgba(16, 185, 129, 0.3)",
        "glow-danger": "0 0 20px rgba(239, 68, 68, 0.3)",
        "glow-amber": "0 0 20px rgba(245, 158, 11, 0.3)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)",
        "gradient-hero": "linear-gradient(135deg, #6366F1 0%, #3B82F6 30%, #8B5CF6 60%, #EC4899 100%)",
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 1, 1)',
      }
    },
  },
  plugins: [],
}