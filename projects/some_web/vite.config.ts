import { defineConfig } from 'vite'
import path from "path";
import { visualizer } from 'rollup-plugin-visualizer';
import strip from '@rollup/plugin-strip';

const config = defineConfig({
  plugins:[
    strip({debugger: true, sourceMap: true}),
    visualizer({
      filename: 'dist/status.html'
    })
  ],
  base: "/",
  server: {
    hmr: true,
  },
  build: {
    emptyOutDir: true,
    outDir: "dist",
    rollupOptions: {
      input: ["src/main.tsx", "src/main.scss"],
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].css',
        dir: path.resolve(__dirname, 'dist'),
        format: 'esm',
        manualChunks(id) {
          // 每个npm包一个chunk
          if (id.includes('node_modules')) {
            const idArray = id.split('/');
            const index = idArray.indexOf('node_modules');
            if(idArray.length > index + 1) {
              return idArray[index + 1];
            }
          }
        }
      }
      //input: listFile(path.resolve(__dirname, 'src/pages')),
      //input: ["index.html"],
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '~', replacement: path.resolve(__dirname, 'node_modules') }
    ]
  },
  publicDir: "public"
})

export default config;
