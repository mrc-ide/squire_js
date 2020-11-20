import { flattenNested, reff } from '../src/utils.js'
import { strict as assert } from 'assert'

import pars from '../data/pars_0.json'
import reffModelOutput from '../data/output_reff_squire.json'
import reffOutput from '../data/output_reff.json'
import brazil from '../data/BRA.json'
import inputs from './assets/BRA_inputs.json'

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
  it('Comparison test for Brazil', function() {
    const Rt = inputs.input_params.map(d => d.Rt);
    const beta = inputs.input_params.map(d => d.beta_set);
    const actual = reff(
      reffModelOutput,
      Rt,
      beta,
      brazil.contactMatrixScaledAge,
      brazil.prob_hosp
    );
    assert.deepEqual(actual, reffOutput);
  });
});
