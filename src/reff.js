import { wellFormedArray } from './utils.js';

import {
  create,
  dotDivideDependencies,
  eigsDependencies,
  subsetDependencies,
  indexDependencies,
  rangeDependencies,
  multiplyDependencies,
  squeezeDependencies
} from 'mathjs';

//build small version of math.js
const {
  dotDivide,
  eigs,
  subset,
  index,
  range,
  transpose,
  multiply,
  squeeze
} = create({
  dotDivideDependencies,
  eigsDependencies,
  subsetDependencies,
  indexDependencies,
  rangeDependencies,
  squeezeDependencies
}, {})

import pars from '../data/pars_0.json'

const S_INDEX = range(1, 18);

function rowDivide(m, a) {
  return m.map(row => dotDivide(row, a))
}

export function reff(output, rt, beta, population, mixingMatrix) {
  if (!wellFormedArray(mixingMatrix, [population.length, population.length])) {
    throw Error("mixMatSet must have the dimensions nAge x nAge");
  }

  if (population.length !== mixingMatrix.length) {
    throw Error("mismatch between population and mixing matrix size");
  }

  const tNow = rt.length;

  //remove singleton arrays
  output = squeeze(output);
  population = squeeze(population);

  const propSusc = rowDivide(
    subset(output, index(range(0, tNow), S_INDEX)),
    population
  )

  const relativeR0 = multiply(pars.prob_hosp, pars.dur_ICase[0])
    + multiply(subtract(1, pars.prob_hosp), pars.dur_IMild);

  const adjustedEigens = range(0, tNow).map(t => {
    eigs(multiply(multiply(mixingMatrix, propSusc), relativeR0)).values[0]
  });

  const ratios = dotDivide(multiply(beta, adjustedEigens), rt);

  return multiply(rt, ratios);
}
