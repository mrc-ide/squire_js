import { runModel } from "../build/squire.js"

let results = runModel(
  { data: [ 100000, 1000000 ], dim: [2] },
  { data: [ 5/100000, 2/100000, 2/100000, 5/100000 ], dim: [2, 2] },
  5000,
  1000,
  1,
  200
);

if (results.y.length == 1990 && results.y[0].length == 15 && results.names.length == 15) {
  console.log('passed');
  process.exit();
}
console.log('failed');
process.exit(1);
