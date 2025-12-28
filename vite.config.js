import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve("/Users/anshkumar/Downloads/health-buddy2/healthbuddy", "src"),
    },
  },
})
