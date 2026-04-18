import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    watch: {
      ignored: [
        '**/src/Maxine Glams/**',
        '**/src/Digibyte/**',
        '**/src/Clothing Business/**',
      ],
    },
  },
});
