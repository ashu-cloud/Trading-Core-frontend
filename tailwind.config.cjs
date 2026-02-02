/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5f5",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#020617",
          950: "#020617"
        },
        emerald: {
          500: "#22c55e"
        },
        rose: {
          500: "#f43f5e"
        },
        indigo: {
          500: "#6366f1",
          600: "#4f46e5"
        },
        amber: {
          500: "#f59e0b"
        },
        blue: {
          500: "#3b82f6"
        }
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"]
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" }
        }
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".tabular-nums": {
          fontVariantNumeric: "tabular-nums"
        }
      });
    }
  ]
};

