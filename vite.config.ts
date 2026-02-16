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

      // Use return value to set up middleware AFTER Vite's default middleware
      return () => {
        // For API and uploads routes, use Express app directly as middleware
        server.middlewares.use((req, res, next) => {
          // Intercept /api and /uploads requests
          if (req.url.startsWith("/api") || req.url.startsWith("/uploads")) {
            // Use the Express app as middleware
            return app(req, res, next);
          }
          // For other requests, continue with Vite's default handling
          next();
        });
      };
    },
  };
}
