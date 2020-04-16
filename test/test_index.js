import {
  runModel,
  getPopulation,
  getMixingMatrix,
  getBeta
} from "../src/index.js"

import { flatten_array } from '../src/utils.js'

import pars from '../data/pars.json'
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

    const mm = getMixingMatrix('Nigeria');
    const beta = getBeta('Nigeria');
    runModel(
      getPopulation('Nigeria'),
      [0, 50, 100],
      [mm, mm, mm],
      [0, 50, 200],
      [beta, beta/2, beta],
      10000000000,
      10000000000,
      0,
      250
    );

    const actual = constructor.getCall(0).args[0];
    Object.keys(expected).forEach(key => {
      expect(actual).to.have.property(key);
      const value = actual[key];
      if (Array.isArray(value)) {
        const e_flat = flatten_array(expected[key]);
        flatten_array(value).forEach((v, i) => {
          expect(v).to.be.closeTo(e_flat[i], 1e-6);
        })
      }
    })
  });

  it('Survives bad inputs', function() {
    const mm = getMixingMatrix('Nigeria');
    const beta = getBeta('Nigeria');
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
