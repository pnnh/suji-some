import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { visualizer } from 'rollup-plugin-visualizer';
import strip from '@rollup/plugin-strip';
import typescript from '@rollup/plugin-typescript';

export default {
    input: './entry.ts',
    output: {
        file: "bundle.js",
        format: "esm"
    },
    external: [],
    plugins: [
        commonjs(),
        nodeResolve(),
        typescript(),
        visualizer({
            filename: 'dist/status.html'
        }),
        strip({}),
    ]
}
