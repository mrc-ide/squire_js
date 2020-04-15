import {
  runModel,
  getPopulation,
  getMixingMatrix,
  getBeta
} from "../src/index.js"
import pars from '../data/pars.json'
import { expect } from 'chai'

const sinon = require('sinon');

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

    expect(constructor.getCall(0).args[0]).to.deep.equal(expected);
  });
});
