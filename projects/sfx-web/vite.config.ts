import { defineConfig } from 'vite'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import * as fs from 'fs'
import { PreRenderedAsset, PreRenderedChunk } from 'rollup'

function listFile (dir: string): string[] {
  const arr = fs.readdirSync(dir)
  const list: string[] = []
  arr.forEach(function (item) {
    const fullPath = path.join(dir, item)
    const stats = fs.statSync(fullPath)
    if (!stats.isDirectory()) {
      const extName = path.extname(fullPath)
      if (['.scss', '.css', '.tsx', '.ts', '.js'].includes(extName)) {
        list.push(fullPath)
      }
    }
  })
  return list
}

console.log('listFile', listFile(path.resolve(__dirname, 'src/pages')))

const config = defineConfig({
  plugins: [
    visualizer({
      filename: 'dist/status.html'
    })
  ],
  base: '/',
  server: {
    hmr: true
  },
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    manifest: true,
    ssrManifest: true,
    rollupOptions: {
      // input: ['index.html'],
      // input: listFile(path.resolve(__dirname, 'src/pages')),
      input: ['src/index.tsx'],
      output: {
        entryFileNames: (chunkInfo: PreRenderedChunk) => {
          if (!chunkInfo.facadeModuleId) {
            throw new Error('entryFileNames facadeModuleId为空')
          }
          const baseName = path.basename(chunkInfo.facadeModuleId)
          const extName = path.extname(baseName)
          console.debug('entryFileNames', chunkInfo.facadeModuleId, baseName)
          const fileName = baseName.replace(extName, '.js')
          return fileName
        },
        assetFileNames: (chunkInfo: PreRenderedAsset) => {
          if (!chunkInfo.name) {
            throw new Error('assetFileNames name为空')
          }
          const baseName = path.basename(chunkInfo.name)
          const extName = path.extname(baseName)
          console.debug('assetFileNames', chunkInfo.name, baseName, extName)
          return baseName
        },
        dir: path.resolve(__dirname, 'dist'),
        format: 'esm',
        manualChunks (id) {
          // 每个npm包一个chunk
          if (id.includes('node_modules')) {
            const idArray = id.split('/')
            const index = idArray.indexOf('node_modules')
            if (idArray.length > index + 1) {
              return idArray[index + 1]
            }
          }
        }
      }
    }
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '~', replacement: path.resolve(__dirname, 'node_modules') }
    ]
  },
  publicDir: 'public',
  css: {
    preprocessorOptions: {
      sass: {}
    }
  }
})

export default config
