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
               '/ddg-suggestions': {
                    target: 'https://duckduckgo.com',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/ddg-suggestions/, '/ac/'),
               },
               '/google-suggestions': {
                    target: 'https://www.google.com',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/google-suggestions/, '/complete/search'),
               },
               "/suggest": {
                    target: 'http://suggestqueries.google.com',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/suggest/, '/complete/search'),
               },
               '/yandex-suggestions': {
                    target: 'https://suggest.yandex.com',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/yandex-suggestions/, '/suggest-ff.cgi'),
               }
          }

     }

})
