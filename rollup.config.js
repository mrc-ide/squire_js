import json from '@rollup/plugin-json';

export default {
  input: 'src/index.js',
  output: {
    format: 'es'
  },
  plugins: [json()]
};
