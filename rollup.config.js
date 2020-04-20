import json from '@rollup/plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    format: 'es'
  },
  plugins: [json(), babel()]
};
