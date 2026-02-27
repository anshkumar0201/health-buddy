/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // <--- THE KEY CHANGE: Enables manual toggling
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#22C55E",
        danger: "#EF4444",
        muted: "#6B7280",
        surface: "#F8FAFC"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)"
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  },
  plugins: [require("@tailwindcss/line-clamp")]
}