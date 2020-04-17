import { reshape3d, transpose312, flattenNested } from '../src/utils.js'
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

describe('reshape3d', function() {
  it('reshapes (2,3,4) to (4,3,2) correctly', function() {
    const expected = [
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
    ];

    const input = [
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

    const actual = reshape3d(input, [4, 3, 2]);
    assert.deepEqual(actual, expected)
  })
})

describe('transpose312', function() {
  it('transposes a (2,3,4) correctly', function() {
    const expected = [
      [
        [1, 7, 13, 19],
        [2, 8, 14, 20]
      ],
      [
        [3, 9, 15, 21],
        [4, 10, 16, 22]
      ],
      [
        [5, 11, 17, 23],
        [6, 12, 18, 24]
      ]
    ];
    const input = [
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
    const actual = transpose312(input);
    assert.deepEqual(actual, expected)
  })
})
