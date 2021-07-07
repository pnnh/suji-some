
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { visualizer } from 'rollup-plugin-visualizer';

export default {
    input: './entry.js',
    output: {
        file: "bundle.js",
        format: "esm"
    },
    external: ['kotlin'],
    plugins: [
        commonjs(),
        nodeResolve(),
        visualizer({
            filename: 'dist/status.html'
        })
    ]
}
