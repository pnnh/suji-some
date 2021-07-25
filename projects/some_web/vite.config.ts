import { defineConfig } from 'vite'
import path from "path";
import { visualizer } from 'rollup-plugin-visualizer';
import * as fs from "fs";
import {PreRenderedAsset, PreRenderedChunk} from "rollup";
//import reactRefresh from '@vitejs/plugin-react-refresh';  // 加上这个ts会报类型错误，因为是严格模式

function listFile(dir: string): string[] {
  const arr = fs.readdirSync(dir);
  //const list: Map<string, string> = new Map();
  const list: string[] = [];
  arr.forEach(function(item){
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);
    if(!stats.isDirectory()){
      const extName = path.extname(fullPath);
      if ([".scss", ".css", ".tsx", ".ts", ".js"].includes(extName)) {
        list.push(fullPath);
      }
    }
  });
  return list;
}

console.log("listFile", listFile(path.resolve(__dirname, 'src/pages')));

const config = defineConfig({
  plugins:[
    //reactRefresh(),
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
      //input: ["src/pages/main.tsx", "src/pages/main.scss"],
      input: listFile(path.resolve(__dirname, 'src/pages')),
      output: {
        entryFileNames: (chunkInfo: PreRenderedChunk) => {
          console.debug("entryFileNames", chunkInfo);
          return '[name].js';
        },
        assetFileNames: (chunkInfo: PreRenderedAsset) => {
          console.debug("assetFileNames", chunkInfo);
          return '[name].css';
        },
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
