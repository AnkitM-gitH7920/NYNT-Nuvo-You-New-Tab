import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
     plugins: [react()],
     build: {
          rollupOptions: {
               input: {
                    main: 'index.html',
               }
          }
     },
     server: {
          proxy: {
               '/suggestions': {
                    target: 'https://duckduckgo.com',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/suggestions/, '/ac'),
               },
               '/google-suggestions': {
                    target: 'https://www.google.com',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/google-suggestions/, '/complete/search'),
               }
          }

     }

})
