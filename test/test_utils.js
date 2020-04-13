import { createOdinArray, processMixingMatrix } from '../utils.js'
import { strict as assert } from 'assert'

describe('createOdinArray', function() {
  it('can deal with a 1d array', function() {
    assert.equal(createOdinArray(
      [5, 2],
      { data: [ 5, 2 ], dim: [2] }
    ));
  });

  it('can deal with a square matrix', function() {
    assert.equal(createOdinArray(
      [[5, 2], [2, 5]],
      { data: [ 5, 2, 2, 5 ], dim: [2, 2] }
    ));
  });
});

describe('processMixingMatrix', function() {
  it('processes 2 age groups correctly', function() {
    assert.equal(
      processMixingMatrix(
        [[5, 2], [2, 5]],
        [500, 1000]
      ),
      [[0.010, 0.002], [0.004 0.005]]
    );
  });
});
