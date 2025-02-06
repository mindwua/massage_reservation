import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use environment variables for backend URL
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': process.env.BACKEND_URL || 'http://localhost:3001',
    },
  },
});
