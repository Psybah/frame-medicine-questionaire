import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const scriptUrl = env.VITE_GOOGLE_SCRIPT_URL || "";
  let proxyConfig = undefined as any;
  try {
    if (scriptUrl) {
      const u = new URL(scriptUrl);
      const target = `${u.protocol}//${u.host}`;
      const pathRewrite = u.pathname + (u.search || "");
      proxyConfig = {
        "/api/sheets": {
          target,
          changeOrigin: true,
          secure: true,
          rewrite: () => pathRewrite,
        },
      };
    }
  } catch {}

  return ({
  server: {
    host: "::",
    port: 8080,
    proxy: proxyConfig,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  });
});
