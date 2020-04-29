import {
  runModel,
  getPopulation,
  getMixingMatrix,
  estimateBeta
} from "../src/index.js"

import { flattenNested } from '../src/utils.js'

import pars from '../data/pars_0.json'
import { expect } from 'chai'
import sinon from 'sinon'

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

    const mm = getMixingMatrix('St. Lucia');
    const beta = estimateBeta('St. Lucia', [4, 2]);
    runModel(
      getPopulation('St. Lucia'),
      [0],
      [mm],
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
          expect(value[0]).to.be.closeTo(expected_value, 1e-6);
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

    const mm = getMixingMatrix('Nigeria');
    const beta = estimateBeta('Nigeria', [3, 3/2, 3]);
    runModel(
      getPopulation('Nigeria'),
      [0],
      [mm],
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
    const mm = getMixingMatrix('Nigeria');
    const beta = estimateBeta('Nigeria', 3);
    const badArguments = [
      [
        getPopulation('Nigeria'),
        [0, 50, 100],
        [mm, mm, mm],
        [0, 50, 200],
        [beta, beta/2, beta],
        10000000000,
        10000000000,
        50, //start after end
        10
      ],
      [
        getPopulation('Nigeria'),
        [0, 50, 100],
        [mm, mm, mm],
        [0, 50, 200],
        [beta, beta/2], // missmatched beta
        10000000000,
        10000000000,
        0,
        250
      ],
      [
        getPopulation('Nigeria').slice(2), //missmatched population
        [0, 50, 100],
        [mm, mm, mm],
        [0, 50, 200],
        [beta, beta/2, beta],
        10000000000,
        10000000000,
        0,
        250
      ],
      [
        getPopulation('Nigeria'),
        [0, 50, 100],
        [mm, mm, mm],
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

describe('estimateBeta', function() {

  it('gives expected scalar outputs', function() {
    expect(estimateBeta('Nigeria', 3)).to.be.closeTo(0.1247291, 1e-6);
  });

  it('gives expected array outputs', function() {
    const actual = estimateBeta('Nigeria', [3, 2]);
    expect(actual[0]).to.be.closeTo(0.1247291, 1e-6);
    expect(actual[1]).to.be.closeTo(0.08315272, 1e-6);
  });

  it('errors gracefully when the country cannot be found', function() {
    expect(estimateBeta.bind('Non existent', 3)).to.throw(
      Error,
      'Unknown country'
    );
  });
});
