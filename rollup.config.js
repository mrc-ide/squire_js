import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    format: 'es'
  },
  plugins: [
    json(),
    nodeResolve({ browser: true, preferBuiltins: true }),
    commonjs(),
    babel({ babelHelpers: 'bundled' })
  ]
};
