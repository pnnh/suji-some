import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import scss from 'rollup-plugin-scss'
import { visualizer } from 'rollup-plugin-visualizer'

export default {
  input: 'src/index.tsx',
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true
  },
  external: ['react'],
  plugins: rollupPlugins()
}

function rollupPlugins () {
  return [
    typescript({ tsconfig: './tsconfig.json' }),
    commonjs(),
    nodeResolve(),
    scss(),
    visualizer({
      filename: 'dist/status.html'
    })
  ]
}
