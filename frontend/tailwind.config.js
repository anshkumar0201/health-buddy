export default {
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
      }
    }
  },
  plugins: [require("@tailwindcss/line-clamp")]
}
