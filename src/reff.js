import { wellFormedArray } from './utils.js';
import { leadingEigenvalue } from './eigenvalues.js';

import {
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
} from './math_bundle.js';

import pars from '../data/pars_0.json'

const S_INDEX = range(1, 18);

function rowDivide(m, a) {
  return m.map(row => dotDivide(row, a))
}

function rowMultiply(m, a) {
  return m.map(row => dotMultiply(row, a))
}

export function reff(output, rt, beta, population, mixingMatrix, tSubset = null) {
  if (!wellFormedArray(mixingMatrix, [population.length, population.length])) {
    throw Error("mixMatSet must have the dimensions nAge x nAge");
  }

  if (population.length !== mixingMatrix.length) {
    throw Error("mismatch between population and mixing matrix size");
  }

  if (beta.length !== rt.length) {
    throw Error("mismatch between rt and beta size");
  }

  if (tSubset == null) {
    tSubset = [...Array(rt.length).keys()];
  } else {
    rt = subset(rt, index(tSubset));
    beta = subset(beta, index(tSubset));
  }

  //remove singleton arrays
  output = squeeze(output);
  population = squeeze(population);

  const propSusc = rowDivide(
    subset(output, index(tSubset, S_INDEX)),
    population
  )

  const relativeR0 = add(
    multiply(pars.prob_hosp, pars.dur_ICase),
    multiply(subtract(1, pars.prob_hosp), pars.dur_IMild)
  );

  const adjustedEigens = tSubset.map((_, i) => {
    return leadingEigenvalue(
      rowMultiply(
        rowMultiply(mixingMatrix, propSusc[i]),
        relativeR0
      )
    );
  });

  const ratios = dotDivide(dotMultiply(beta, adjustedEigens), rt);

  return dotMultiply(rt, ratios);
}
