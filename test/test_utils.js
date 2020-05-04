import { flattenNested } from '../src/utils.js'
import { strict as assert } from 'assert'

describe('flattenNested', function() {
  it('flattenNesteds a 3d array in the correct order', function() {
    assert.deepEqual(
      flattenNested([
        [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12]
        ],
        [
          [13, 14, 15, 16],
          [17, 18, 19, 20],
          [21, 22, 23, 24]
        ]
      ]),
      Array.from(Array(24).keys()).map(x => x + 1)
    );
  });
});
