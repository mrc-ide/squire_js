
export const createOdinArray = function(array) {
  let dim = [];
  let current = array;
  while (Array.isArray(current)) {
    dim.push(current.length);
    current = current[0];
  }
  let data = flat(array, dim.length);
  if (data.length != dim.reduce((a, b) => a * b, 1)) {
    throw new Error("Nested array has irregular sizes");
  }
  return { data, dim }
}

const flat = function(input, depth = 1, stack = []) {
  for (let item of input) {
    if (Array.isArray(item) && depth > 0) {
      flat(item, depth - 1, stack);
    } else {
      stack.push(item);
    }
  }
  return stack;
}
