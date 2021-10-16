import { defineConfig } from 'vite'

const config = defineConfig({
  plugins: [
  ],
  base: '/',
  server: {
    hmr: true
  },
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      input: ['index.html']
    }
  },
  publicDir: 'public'
})

export default config
