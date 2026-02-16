import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import express from "express";
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
  let expressApp: any;

  return {
    name: "express-plugin",
    apply: "serve",

    configureServer(server) {
      // Create Express app ONCE
      expressApp = createServer();

      // Add body parser middleware to Vite's middleware FIRST
      server.middlewares.use(express.json({ limit: "50mb" }));
      server.middlewares.use(express.urlencoded({ extended: true, limit: "50mb" }));

      // Then add middleware to route API/uploads to Express
      server.middlewares.use((req, res, next) => {
        if (req.url.startsWith("/api") || req.url.startsWith("/uploads")) {
          return expressApp(req, res, next);
        }
        next();
      });
    },
  };
}
