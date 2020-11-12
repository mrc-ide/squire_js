import { runModel } from "../src/index.js"

import { flattenNested } from '../src/utils.js'

import pars from '../data/pars_1.json'
import { expect } from 'chai'
import sinon from 'sinon'

import stlucia from '../data/LCA.json'

describe('runModel', function() {
  it('processes basic parameters correctly', function() {
    const expected = pars;

    const constructor = sinon.spy();

    class model {
      constructor() {
        constructor.apply(null, arguments);
      }
      run() {}
    }

    global.odin = [ model ];

    const mm = stlucia.contactMatrix;
    const beta = [stlucia.beta, stlucia.beta/2];
    runModel(
      stlucia.population,
      mm,
      [0, 50],
      beta,
      100,
      100,
      0,
      365
    );

    const actual = constructor.getCall(0).args[0];
    Object.keys(expected).forEach(key => {
      expect(actual).to.have.property(key);
      const value = actual[key];
      const expected_value = expected[key];
      if (Array.isArray(value)) {
        if (value.length == 1) {
          expect(value[0]).to.be.closeTo(expected_value[0], 1e-6);
        } else {
          const e_flat = flattenNested(expected[key]);
          flattenNested(value).forEach((v, i) => {
            expect(v).to.be.closeTo(e_flat[i], 1e-6);
          })
        }
      } else {
        expect(value).to.be.closeTo(expected_value, 1e-6);
      }
    })
  });

  it('can translate between beta from R0', function() {
    const beta = [stlucia.beta, stlucia.beta/2];
    const r0 = 3;
    const rt = [r0, r0/2];

    rt.map(r => { return r / stlucia.eigenvalue }).forEach((value, i) => {
      expect(beta[i]).to.be.closeTo(value, 1e-6);
    });

    beta.map(b => { return b * stlucia.eigenvalue }).forEach((value, i) => {
      expect(rt[i]).to.be.closeTo(value, 1e-6);
    });
  });

  it('parameterises beds correctly', function() {
    const expected = pars;

    const constructor = sinon.spy();

    class model {
      constructor() {
        constructor.apply(null, arguments);
      }
      run() {}
    }

    global.odin = [ model ];

    const mm = stlucia.contactMatrix;
    const beta = [stlucia.beta, stlucia.beta/2, stlucia.beta];
    runModel(
      stlucia.population,
      mm,
      [0, 50, 200],
      beta,
      10000,
      100,
      0,
      250
    );

    const actual = constructor.getCall(0).args[0];
    expect(actual.hosp_bed_capacity).to.be.equal(10000);
    expect(actual.ICU_bed_capacity).to.be.equal(100);
  });

  it('Survives bad inputs', function() {
    const mm = stlucia.contact_matrix;
    const beta = [stlucia.beta, stlucia.beta/2, stlucia.beta];
    const badArguments = [
      [
        stlucia.population,
        mm,
        [0, 50, 200],
        [beta, beta/2, beta],
        10000000000,
        10000000000,
        50, //start after end
        10
      ],
      [
        stlucia.population,
        mm,
        [0, 50, 200],
        [beta, beta/2], // missmatched beta
        10000000000,
        10000000000,
        0,
        250
      ],
      [
        stlucia.population.slice(2), //missmatched population
        mm,
        [0, 50, 200],
        [beta, beta/2, beta],
        10000000000,
        10000000000,
        0,
        250
      ],
      [
        stlucia.population,
        mm,
        [0, 50, 200],
        [beta, beta/2, beta],
        -3, // negative beds
        10000000000,
        0,
        250
      ],
      [
        [1, 2],
        [0, 50, 100],
        [[1, 2], [1, 2], [1, 2]], //wrong dimensionality
        [0, 50, 200],
        [beta, beta/2, beta],
        3,
        4,
        0,
        250
      ]
    ];

    badArguments.forEach(args => {
      expect(runModel.bind(...args)).to.throw(Error);
    });
  });
});
