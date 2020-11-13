export function flattenNested(input) {
  const stack = [...input];
  const res = [];
  while(stack.length) {
    // pop value from stack
    const next = stack.pop();
    if(Array.isArray(next)) {
      // push back array items, won't modify the original input
      stack.push(...next);
    } else {
      res.push(next);
    }
  }
  // reverse to restore input order
  return res.reverse();
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
