import { reff } from '../src/reff.js';
import { approxEqualArray } from './utils.js';
import { strict as assert } from 'assert';

import pars from '../data/pars_0.json';
import reffModelOutput from '../data/output_reff_squire.json';
import reffOutput from '../data/output_reff.json';
import brazil from '../data/BRA.json';
import inputs from './assets/BRA_inputs.json';

describe('reff', function() {
  this.timeout(10000);
  it('Comparison test for Brazil', function() {
    const Rt = inputs.input_params.map(d => d.Rt);
    const beta = inputs.input_params.map(d => d.beta_set);
    const actual = reff(
      reffModelOutput,
      Rt,
      beta,
      brazil.population,
      brazil.contactMatrixScaledAge
    );
    assert(approxEqualArray(actual, reffOutput, 1e-2));
  });
});
