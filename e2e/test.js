import {
  runModel,
  getPopulation,
  getMixingMatrix,
  estimateBeta
} from "../build/squire.js"

import {
  approxEqualArray,
  getColumn
} from './utils.js'

import { flattenNested } from '../src/utils.js'

import expected from "../data/output.json"

const mm = getMixingMatrix('Nigeria');
const beta = estimateBeta('Nigeria', [3, 3/2, 3]);
let results = runModel(
  getPopulation('Nigeria'),
  [0, 50, 100],
  [mm, mm, mm],
  [0, 50, 200],
  beta,
  10000000000,
  10000000000,
  0,
  250
);

const passed = approxEqualArray(
  flattenNested(results.y),
  flattenNested(expected),
  1e-6
);

if (passed) {
  console.log('passed');
  process.exit();
}

// Write to file for diagnostics
const out_path = './failure.json'
require('fs').writeFileSync(out_path, JSON.stringify(results.y, null, 4));

console.log('failed, output written to ', out_path);
process.exit(1);
