import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port:5173
  },
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('src/features')) {
            return 'features';
          }
          if (id.includes('src/utils')) {
            return 'utils';
          }
          if (id.includes('src/hooks')) {
            return 'hooks';
          }
        }
      }
    },
    chunkSizeWarningLimit: 2000
  }
})
