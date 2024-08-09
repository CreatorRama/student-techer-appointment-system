import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Load environment variables from .env files
import { config } from 'dotenv';
config();

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL ||'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Optionally remove /api prefix
      },
    },
  },
  optimizeDeps: {
    include: [
      '@mui/x-date-pickers',
      'date-fns',
    ],
  },
});
