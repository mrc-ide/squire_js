import {
  runModel,
  getPopulation,
  getMixingMatrix,
  getBeta
} from "../build/squire.js"

let fs = require('fs');

const mm = getMixingMatrix('Nigeria');
const beta = getBeta('Nigeria');
let results = runModel(
  getPopulation('Nigeria'),
  [0, 50, 100],
  [mm, mm, mm],
  [0, 50, 200],
  [beta, beta/2, beta],
  10000000000,
  10000000000,
  1,
  250
);

fs.writeFileSync('./data/output_js.json', JSON.stringify(results.y, null, 4));
if (results.y.length == 1990 && results.y[0].length == 443 && results.names.length == 443) {
  console.log('passed');
  process.exit();
}
console.log('failed');
process.exit(1);
