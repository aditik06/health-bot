import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Assets are served from /landing/ by Express even though the page itself is
  // mounted at '/', so emitted URLs have to be prefixed to match.
  base: '/landing/',

  // Build straight into the directory Express serves, so there's no copy step
  // and no second static host to keep in sync.
  build: {
    outDir: '../client/landing',
    emptyOutDir: true
  },

  server: {
    port: 5173,
    // During `npm run dev` the API still lives on the Express server, so proxy
    // it rather than running the frontend against a different origin.
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
