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
  let app: any;

  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)

    configureServer(server) {
      app = createServer();

      // Return post-middleware hook to add Express as the final handler
      return () => {
        // Add Express at the very end, after all Vite middleware
        server.middlewares.use((req, res, next) => {
          // Pass all requests to Express
          app(req, res, next);
        });
      };
    },
  };
}
