export const flattenNested = function(array) {
  const flat = [].concat(...array);
  return flat.some(Array.isArray) ? flattenNested(flat) : flat;
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
