import { wellFormedArray } from './utils.js';
import { eig } from 'numericjs';

import {
  create,
  addDependencies,
  dotDivideDependencies,
  dotMultiplyDependencies,
  eigsDependencies,
  subsetDependencies,
  indexDependencies,
  rangeDependencies,
  multiplyDependencies,
  subtractDependencies,
  transposeDependencies,
  squeezeDependencies
} from 'mathjs';

//build small version of math.js
const {
  add,
  dotDivide,
  dotMultiply,
  subset,
  index,
  range,
  transpose,
  multiply,
  subtract,
  squeeze
} = create({
  addDependencies,
  dotDivideDependencies,
  dotMultiplyDependencies,
  eigsDependencies,
  subsetDependencies,
  indexDependencies,
  rangeDependencies,
  subtractDependencies,
  squeezeDependencies,
  transposeDependencies
}, {})

import pars from '../data/pars_0.json'

const S_INDEX = range(1, 18);

function rowDivide(m, a) {
  return m.map(row => dotDivide(row, a))
}

function colMultiply(m, a) {
  return m.map(row => dotMultiply(row, a))
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

  const relativeR0 = add(
    multiply(pars.prob_hosp, pars.dur_ICase),
    multiply(subtract(1, pars.prob_hosp), pars.dur_IMild)
  );

  const adjustedEigens = range(0, tNow).map(t => {
    return eig(
      colMultiply(
        colMultiply(mixingMatrix, propSusc[t]),
        relativeR0
      )
    ).lambda.x[0]
  });

  const ratios = dotDivide(dotMultiply(beta, adjustedEigens), rt);

  return dotMultiply(rt, ratios)._data;
}
