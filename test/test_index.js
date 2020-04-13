import { runModel } from '../src/index.js'
import { strict as assert } from 'assert'

var sinon = require('sinon');

describe('runModel', function() {
  it('processes basic parameters correctly', function() {
    const expected = {
      S0: { data: [ 100000, 1000000 ], dim: [2] },
      E0: { data: [ 0, 0 ], dim: [2] },
      I_mild0: { data: [ 100, 100 ], dim: [2] },
      I_hosp0: { data: [ 100, 100 ], dim: [2] },
      I_ICU0: { data: [ 100, 100 ], dim: [2] },
      R0: { data: [0, 0], dim: [2] },
      D0: { data: [0, 0], dim: [2] },
      gamma: 0.3,
      sigma: 0.3,
      mu: 0.01,
      p_mild: { data: [0.33, 0.33], dim: [2] },
      p_hosp: { data: [0.33, 0.33], dim: [2] },
      p_ICU: { data: [0.34, 0.34], dim: [2] },
      beta_1: 0.1,
      beta_2: 0.1,
      m: { data: [ 5/100000, 2/100000, 2/100000, 5/100000 ], dim: [2, 2] }
    };

    const constructor = sinon.spy();

    class model {
      constructor() {
        constructor.apply(null, arguments);
      }
      run() {}
    }

    global.odin = [ model ];

    runModel(
      { data: [ 100000, 1000000 ], dim: [2] },
      { data: [ 5/100000, 2/100000, 2/100000, 5/100000 ], dim: [2, 2] },
      5000,
      1000,
      1,
      200
    );

    assert.deepEqual(constructor.getCall(0).args[0], expected);
  });
});
