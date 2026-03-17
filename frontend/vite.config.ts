import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Java backend runs on port 3001
const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: BACKEND_URL,
        changeOrigin: true,
      },
      '/health': {
        target: BACKEND_URL,
        changeOrigin: true,
      },
      '/api-docs': {
        target: BACKEND_URL,
        changeOrigin: true,
      },
      '/swagger-ui': {
        target: BACKEND_URL,
        changeOrigin: true,
      },
    },
  },
});
