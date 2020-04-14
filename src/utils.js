
export const createOdinArray = function(array) {
  const dim = getDimensions(array);
  let data = flat(array, dim);
  if (data.length != dim.reduce((a, b) => a * b, 1)) {
    throw new Error("Nested array has irregular sizes");
  }
  return { data, dim }
}

export const transpose3d = function(array, order) {
  if (!(order || order.length != 3)) {
    throw new Error("Order array incorrect");
  }
  let dim = order.map(d => getDimSize(array, d));
  let transposed = Array(dim[0]).fill(0).map(
    () => Array(dim[1]).fill(0).map(
      () => Array(dim[2]).fill(0)
    )
  );
  const data = flat(array, getDimensions(array));
  let counter = 0;
  for (let first = 0; first < dim[0]; ++first) {
    for (let second = 0; second < dim[1]; ++second) {
      for (let third = 0; third < dim[2]; ++third) {
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
  let reshaped = Array(dims[0]).fill(0).map(
    () => Array(dims[1]).fill(0).map(
      () => Array(dims[2]).fill(0)
    )
  );
  const data = flat(array, getDimensions(array));
  let counter = 0;
  for (let third = 0; third < dims[2]; ++third) {
    for (let second = 0; second < dims[1]; ++second) {
      for (let first = 0; first < dims[0]; ++first) {
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

const flat = function(array, dim) {
  if (!dim || dim.length > 3) {
    throw Error("Unsupported dimensions");
  }

  if (dim.length == 1) {
    return array;
  }

  let data = Array(dim.reduce((a, b) => a * b, 1)).fill(0);
  let counter = 0;
  if (dim.length == 2) {
    for (let i = 0; i < dim[0]; ++i) {
      for (let j = 0; j < dim[1]; ++j) {
        data[counter] = array[i][j];
        counter++;
      }
    }
    return data;
  }

  if (dim.length == 3) {
    for (let k = 0; k < dim[2]; ++k) {
      for (let j = 0; j < dim[1]; ++j) {
        for (let i = 0; i < dim[0]; ++i) {
          data[counter] = array[i][j][k];
          counter++;
        }
      }
    }
    return data;
  }
}

const getDimensions = function(array) {
  let dim = [];
  let current = array;
  while (Array.isArray(current)) {
    dim.push(current.length);
    current = current[0];
  }
  return dim;
}
