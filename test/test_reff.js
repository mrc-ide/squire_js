import { reff } from '../src/reff.js';
import { approxEqualArray } from './utils.js';
import { strict as assert } from 'assert';

import pars from '../data/pars_0.json';
import reffModelOutput from '../data/output_reff_squire.json';
import reffOutput from '../data/output_reff.json';
import brazil from '../data/BRA.json';
import inputs from './assets/BRA_inputs.json';

describe('reff', function() {
  it('compares well with R runs for Brazil', function() {
    this.timeout(10000);
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

  it('can compute reff for every 10 values of t', function() {
    const Rt = inputs.input_params.map(d => d.Rt);
    const beta = inputs.input_params.map(d => d.beta_set);
    const t = [...Array(Rt.length).keys()].filter(i => i % 10 === 0);
    const expected = reffOutput.filter((_, i) => i % 10 === 0);
    const actual = reff(
      reffModelOutput,
      Rt,
      beta,
      brazil.population,
      brazil.contactMatrixScaledAge,
      t
    );
    assert(approxEqualArray(actual, expected, 1e-2));
  });
});
