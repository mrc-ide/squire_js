import { flattenNested, reff } from '../src/utils.js'
import { strict as assert } from 'assert'

import pars from '../data/pars_0.json'
import output from '../data/output_0.json'
import reffOutput from '../data/output_reff_0.json'
import stlucia from '../data/LCA.json'

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

describe('reff', function() {
  it('returns the correct reff for the test run of St. Lucia', function() {
    const R0 = 4;
    const beta0 = R0 / stlucia.eigenvalue;
    const t = [0, 50];
    const Rt = [4, 2];
    const actual = reff(
      output,
      Rt,
      stlucia.contactMatrix, //is this the right shape?
      stlucia.prob_hosp,
      beta0,
      stlucia.eigenvalue
    );
    assert.deepEqual(actual, reffOutput);
  });
});
