
import { wellFormedArray } from './utils.js'
import pars from '../data/pars_0.json'

export const runModel = function(
  population,
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

  if (!wellFormedArray(mixMatSet, [population.length, population.length, 1])) {
    throw Error("mixMatSet must have the dimensions nAge x nAge x 1");
  }

  if (population.length !== mixMatSet[0].length) {
    throw Error("mismatch between population and mixing matrix size");
  }

  if (ttBeta.length !== betaSet.length) {
    throw Error("mismatch between ttBeta and betaSet size");
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
    tt_matrix: [0],
    mix_mat_set: mixMatSet,
    tt_beta: ttBeta,
    beta_set: betaSet,
    hosp_beds: [nBeds],
    ICU_beds: [nICUBeds]
  };

  const mod = new model(user);
  const dt = 1;
  let t = [];
  for (let i = 0; i < (timeEnd - timeStart) / dt; ++i) {
    t.push(timeStart + i * dt);
  }

  return mod.run(t);
}
