import {
  runModel,
  getPopulation,
  getMixingMatrix,
  getBeta
} from "../build/squire.js"

import expected from "../data/output.json"

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
  0,
  250
);

function approxEqualArray(x, y, tolerance) {
  if (y.length !== x.length) {
    throw Error("Incompatible arrays");
  }
  let scale = 0;
  let xy = 0;
  let n = 0;
  for (let i = 0; i < x.length; ++i) {
    if (x[i] !== y[i]) {
      scale += Math.abs(x[i]);
      xy += Math.abs(x[i] - y[i]);
      n++;
    }
  }
  if (n === 0) {
    return true;
  }

  scale /= n;
  xy /= n;

  if (scale > tolerance) {
    xy /= scale;
  }
  return xy < tolerance;
}

function getColumn(y, i) { return y.map(row => row[i]); }

const passed = results.y[0].every((col, i) => {
  return approxEqualArray(getColumn(results.y, i), getColumn(expected, i));
});

if (passed) {
  console.log('passed');
  process.exit();
}

// Print diagnostics
function relativeError(actual, expected) {
  const diff = actual.map((a, i) => {
    let e = expected[i] + .00001
    return Math.abs(a - e) / e;
  });
  return diff.reduce((a, b) => a + b, 0) / diff.length;
}

function absoluteError(actual, expected) {
  const diff = actual.map((a, i) => {
    return Math.abs(a - expected[i]);
  });
  return diff.reduce((a, b) => a + b, 0) / diff.length;
}


const actual = results.y
const rerrors = results.y[0].map((c, i) => {
  return relativeError(getColumn(actual, i), getColumn(expected, i));
});

const aerrors = results.y[0].map((c, i) => {
  return absoluteError(getColumn(actual, i), getColumn(expected, i));
});

console.log('Min relative e', Math.min(...rerrors));
console.log('Max relative e', Math.max(...rerrors));

console.log('Min absolute e', Math.min(...aerrors));
console.log('Max absolute e', Math.max(...aerrors));

fs.writeFileSync('./data/output_js.json', JSON.stringify(results.y, null, 4));

console.log('failed');
process.exit(1);
