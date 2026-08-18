import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        // Giữ các shared chunk dưới ngưỡng cảnh báo và tận dụng cache tốt hơn
        // sau khi các màn hình đã được lazy-load theo route.
        codeSplitting: {
          groups: [
            {
              name: 'vendor',
              test: /node_modules[\\/]/,
              minSize: 20_000,
              maxSize: 450_000,
            },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@apps": path.resolve(__dirname, "./src/apps"),
      "@shared": path.resolve(__dirname, "./src/shared"),
    },
  },
});
