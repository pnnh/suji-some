import { defineConfig } from 'vite'
// import reactRefresh from '@vitejs/plugin-react-refresh'

const config = defineConfig({
  plugins: [
    // reactRefresh()
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
