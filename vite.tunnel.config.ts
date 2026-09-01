import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Config aparte solo para exponer el sitio por Cloudflare Tunnel cuando Nico
// no está en casa. No tocar vite.config.ts (lo usan otras sesiones en
// paralelo) — este archivo es un helper local, no forma parte del sitio.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 5210,
    strictPort: true,
    allowedHosts: ['.trycloudflare.com'],
  },
});
