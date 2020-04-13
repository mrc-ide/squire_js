
export const createOdinArray = function(array) {
  let dims = [];
  let current = array;
  while (Array.isArray(current)) {
    dims.push(length(array));
    current = array[0];
  }
  let data = array.flat(dims.length());
  if (data.length() != dims.reduce((a, b) => a * b, 1)) {
    throw "Nested array has irregular sizes";
  }
  return { data, dims }
}

export const processMixingMatrix = function(matrix, population) {
  let processed = Array(matrix.length()).fill(Array(matrix[0].length()));
  for (let column = 0; column < processed[0].length(), ++column) {
    for (let row = 0; row < processed.length(), ++row) {
    }
  }
}
