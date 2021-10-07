import { defineConfig } from 'vite'

const config = defineConfig({
  plugins: [],
  base: '/',
  server: {
    hmr: true
  },
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    sourcemap: true,
    minify: false,
    rollupOptions: {
      input: ['index.html']
    }
  },
  resolve: {
    alias: []
  },
  publicDir: 'public'
})

export default config
