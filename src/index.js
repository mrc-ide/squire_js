
import { transpose312, reshape3d, wellFormedArray } from './utils.js'
import population from '../data/population.json'
import matrices from '../data/matrices.json'
import eigens from '../data/eigens.json'
import pars from '../data/pars_0.json'

export const getCountries = () => Object.keys(population);
export const getPopulation = (country) => { return population[country] };
export const getMixingMatrix = (country) => { return matrices[country] };
export const estimateBeta = (country, R0) => {
  const lambda = eigens[country];
  if (lambda == null) {
    throw Error("Unknown country");
  }
  if (Array.isArray(R0)) {
    return R0.map(r => { return r / lambda })
  }
  return R0 / lambda;
};

export const runModel = function(
  population,
  ttMatrix,
  mixMatSet,
  ttBeta,
  betaSet,
  nBeds,
  nICUBeds,
  timeStart = 0,
  timeEnd = 250
  ) {

  if (timeStart > timeEnd) {
    throw Error("timeStart is greater than timeEnd");
  }

  if (!wellFormedArray(mixMatSet, [mixMatSet.length, population.length, population.length])) {
    throw Error("mixMatSet must have the dimensions t * nAge * nAge");
  }

  if (population.length !== mixMatSet[0].length) {
    throw Error("mismatch between population and mixing matrix size");
  }

  if (ttBeta.length !== betaSet.length) {
    throw Error("mismatch between ttBeta and betaSet size");
  }

  if (ttMatrix.length !== mixMatSet.length) {
    throw Error("mismatch between ttMatrix and mixMatSet size");
  }

  if (nBeds < 0 || nICUBeds < 0) {
    throw Error("Bed counts must be greater than or equal to 0");
  }

  const model = Object.values(odin)[0];
  const nGroups = population.length;

  // Remove the seed exposed population
  const true_pop = population.map((p, i) => { return p - pars.E1_0[i] });

  const user = {
    ...pars,
    S_0: true_pop,
    tt_matrix: ttMatrix,
    mix_mat_set: transpose312(
      reshape3d(mixMatSet, [nGroups, nGroups, ttMatrix.length])
    ),
    tt_beta: ttBeta,
    beta_set: betaSet
  };

  const mod = new model(user);
  const dt = 1;
  let t = [];
  for (let i = 0; i < (timeEnd - timeStart) / dt; ++i) {
    t.push(timeStart + i * dt);
  }

  return mod.run(t);
}
