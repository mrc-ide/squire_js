import { createOdinArray } from '../utils.js'
import { strict as assert } from 'assert'

describe('createOdinArray', function() {
  it('can deal with a 1d array', function() {
    assert.deepEqual(
      createOdinArray([5, 2]),
      { data: [ 5, 2 ], dim: [2] }
    );
  });

  it('can deal with a square matrix', function() {
    assert.deepEqual(
      createOdinArray([[5, 2], [2, 5]]),
      { data: [ 5, 2, 2, 5 ], dim: [2, 2] }
    );
  });

  it('errors on irregular matrices', function() {
    assert.throws(
      createOdinArray.bind([[5, 2], [2, 5, 3]]),
      Error,
      "Nested array has irregular sizes"
    );
  });
});
