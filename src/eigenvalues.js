import {
  random,
  multiply,
  dotMultiply,
  divide,
  norm,
  max,
  abs,
  sum,
  dot,
  subtract
} from './math_bundle.js'

function raleighQuotient(m, x) {
  return dot(multiply(m, x), x) / dot(x, x)
}

function powerIteration(m, n = 100, error = 1e-6) {
  const max_m = max(m)
  // Pick a random vector x (we don't want it to be orthogonal)
  // This is unlikely with large matrices m
  let x = Array(m[0].length).fill(0).map(() => { return random(1, max_m) });
  let i = 0;
  let new_x;
  while (i < n) {
    new_x = multiply(m, x)
    new_x = divide(new_x, norm(new_x))
    if (sum(abs(subtract(x, new_x))) < error) {
      return new_x;
    }
    x = new_x
    i++;
  }
  throw Error("Power iteration did not converge");
}

export function leadingEigenvalue(mat) {
  return raleighQuotient(mat, powerIteration(mat));
}
