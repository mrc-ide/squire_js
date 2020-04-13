import json from '@rollup/plugin-json';

export default {
  input: 'src/index.js',
  output: {
    file: 'build/interface.js',
    format: 'es'
  },
  plugins: [json()]
};
