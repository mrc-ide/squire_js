import { reshape3d, transpose3d, createOdinArray } from '../src/utils.js'
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

  it('can deal with a 3d array', function() {
    assert.deepEqual(
      createOdinArray([
        [
          [1, 13],
          [5, 17],
          [9, 21]
        ],
        [
          [2, 14],
          [6, 18],
          [10, 22]
        ],
        [
          [3, 15],
          [7, 19],
          [11, 23]
        ],
        [
          [4, 16],
          [8, 20],
          [12, 24]
        ]
      ]),
      { data: Array.from(Array(24).keys()).map(x => x + 1), dim: [4, 3, 2] }
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

describe('reshape3d', function() {
  it('reshapes (2,3,4) to (4,3,2) correctly', function() {
    const expected = [
      [
        [1, 13],
        [5, 17],
        [9, 21]
      ],
      [
        [2, 14],
        [6, 18],
        [10, 22]
      ],
      [
        [3, 15],
        [7, 19],
        [11, 23]
      ],
      [
        [4, 16],
        [8, 20],
        [12, 24]
      ]
    ];

    const actual = reshape3d(
      [
        [
          [1, 7, 13, 19],
          [3, 9, 15, 21],
          [5, 11, 17, 23]
        ],
        [
          [2, 8, 14, 20],
          [4, 10, 16, 22],
          [6, 12, 18, 24]
        ]
      ],
      [4, 3, 2]
    );
    assert.deepEqual(actual, expected)
  })
})

describe('transpose3d', function() {
  it('transposes a (2,3,4) with order (3,1,2) correctly', function() {
    const expected = [
      [
        [1, 2],
        [3, 4],
        [5, 6]
      ],
      [
        [7, 8],
        [9, 10],
        [11, 12]
      ],
      [
        [13, 14],
        [15, 16],
        [17, 18]
      ],
      [
        [19, 20],
        [21, 22],
        [23, 24]
      ]
    ];
    const actual = transpose3d(
      [
        [
          [1, 7, 13, 19],
          [3, 9, 15, 21],
          [5, 11, 17, 23]
        ],
        [
          [2, 8, 14, 20],
          [4, 10, 16, 22],
          [6, 12, 18, 24]
        ]
      ],
      [3, 2, 1]
    );
    assert.deepEqual(actual, expected)
  })
})
