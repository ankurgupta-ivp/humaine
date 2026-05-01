import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Using "./" makes it work on GitHub Pages no matter what the repo is named
export default defineConfig({
  plugins: [react()],
  base: "./",
});
