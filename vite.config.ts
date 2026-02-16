import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",

    configureServer(server) {
      // Create Express app
      const app = createServer();

      // Add middleware DIRECTLY (not in return) to run BEFORE Vite's default handlers
      server.middlewares.use((req, res, next) => {
        // Check if this is an API or uploads request
        if (req.url.startsWith("/api") || req.url.startsWith("/uploads")) {
          console.log(`[Express] ${req.method} ${req.url}`);
          // Intercept and handle with Express
          return app(req, res, next);
        }
        // Let Vite handle other requests
        next();
      });
    },
  };
}
