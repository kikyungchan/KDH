import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
      },
      "/ws-chat": {
        target: "http://localhost:8080",
        changeOrigin: true,
        ws: true,
      },
    },
  },
  optimizeDeps: {
    include: ["@stomp/stompjs", "sockjs-client"],
  },
  define: { global: "window" },
  esbuild: { define: { global: "window" } },
});
