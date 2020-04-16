export const transpose312 = function(array) {
  let dim = [3, 1, 2].map(d => getDimSize(array, d));
  let transposed = Array(dim[2]).fill(0).map(
    () => Array(dim[0]).fill(0).map(
      () => Array(dim[1]).fill(0)
    )
  );
  const data = flattenArray(array);
  let counter = 0;
  for (let third = 0; third < dim[1]; ++third) {
    for (let first = 0; first < dim[2]; ++first) {
      for (let second = 0; second < dim[0]; ++second) {
        transposed[first][second][third] = data[counter];
        counter++;
      }
    }
  }
  return transposed;
}

export const reshape3d = function(array, dims) {
  if (!(dims || dims.length != 3)) {
    throw new Error("Dims array is incorrect");
  }
  let reshaped = Array(dims[2]).fill(0).map(
    () => Array(dims[1]).fill(0).map(
      () => Array(dims[0]).fill(0)
    )
  );
  const data = flattenArray(array);
  let counter = 0;
  for (let first = 0; first < dims[2]; ++first) {
    for (let second = 0; second < dims[1]; ++second) {
      for (let third = 0; third < dims[0]; ++third) {
        reshaped[first][second][third] = data[counter];
        counter++;
      }
    }
  }
  return reshaped;
}

const getDimSize = function(array, dim) {
  if (dim == 1) {
    return array.length;
  }
  return getDimSize(array[0], dim - 1);
}

export const flattenArray = function(array) {
  const flat = [].concat(...array);
  return flat.some(Array.isArray) ? flattenArray(flat) : flat;
}

export const wellFormedArray = function(array, dims) {
  if (dims.length > 1) {
    if (!Array.isArray(array)) {
      return false;
    }
    return (array.length === dims[0]) &&
      array.every(subarray => {
        return wellFormedArray(subarray, dims.slice(1))
      });
  }
  return array.length === dims[0];
}
