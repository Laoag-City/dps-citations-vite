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
    // Increase the chunk size limit to 1000 kB
    // chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
          // Create a separate chunk for dependencies in node_modules
            return 'vendor';
          }
          // You can add more chunking logic here, for example:
          // Split by feature folders
          if (id.includes('src/features')) {
            return 'features';
          }
        }
      }
    },
    chunkSizeWarningLimit: 2000 // Optional: Adjust this limit
  }
})
