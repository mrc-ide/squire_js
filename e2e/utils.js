export function approxEqualArray(x, y, tolerance) {
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
