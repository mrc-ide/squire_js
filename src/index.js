
import { createOdinArray, transpose3d, reshape3d } from './utils.js'
import * as probs from './probabilities.js'
import population from '../data/population.json'
import matrices from '../data/matrices.json'
import beta from '../data/betas.json'

export const getCountries = () => Object.keys(population);
export const getPopulation = (country) => { return population[country] };
export const getMixingMatrix = (country) => { return matrices[country] };
export const getBeta = (country) => { return beta[country][0] };

export const runModel = function(
  population,
  ttMatrix,
  mixMatSet,
  ttBeta,
  betaSet,
  nBeds,
  nICUBeds,
  timeStart = 1,
  timeEnd = 250
  ) {

  const model = Object.values(odin)[0];
  const nGroups = population.length;
  const durR = 2.09;
  const durHosp = 5;

  const user = {
    N_age: nGroups,
    S_0: createOdinArray(population),
    E1_0: createOdinArray(Array(nGroups).fill(0)),
    E2_0: createOdinArray(Array(nGroups).fill(0)),
    IMild_0: createOdinArray(Array(nGroups).fill(1)),
    ICase1_0: createOdinArray(Array(nGroups).fill(1)),
    ICase2_0: createOdinArray(Array(nGroups).fill(1)),
    IOxGetLive1_0: createOdinArray(Array(nGroups).fill(0)),
    IOxGetLive2_0: createOdinArray(Array(nGroups).fill(0)),
    IOxGetDie1_0: createOdinArray(Array(nGroups).fill(0)),
    IOxGetDie2_0: createOdinArray(Array(nGroups).fill(0)),
    IOxNotGetLive1_0: createOdinArray(Array(nGroups).fill(0)),
    IOxNotGetLive2_0: createOdinArray(Array(nGroups).fill(0)),
    IOxNotGetDie1_0: createOdinArray(Array(nGroups).fill(0)),
    IOxNotGetDie2_0: createOdinArray(Array(nGroups).fill(0)),
    IMVGetLive1_0: createOdinArray(Array(nGroups).fill(0)),
    IMVGetLive2_0: createOdinArray(Array(nGroups).fill(0)),
    IMVGetDie1_0: createOdinArray(Array(nGroups).fill(0)),
    IMVGetDie2_0: createOdinArray(Array(nGroups).fill(0)),
    IMVNotGetLive1_0: createOdinArray(Array(nGroups).fill(0)),
    IMVNotGetLive2_0: createOdinArray(Array(nGroups).fill(0)),
    IMVNotGetDie1_0: createOdinArray(Array(nGroups).fill(0)),
    IMVNotGetDie2_0: createOdinArray(Array(nGroups).fill(0)),
    IRec1_0: createOdinArray(Array(nGroups).fill(0)),
    IRec2_0: createOdinArray(Array(nGroups).fill(0)),
    R_0: createOdinArray(Array(nGroups).fill(0)),
    D_0: createOdinArray(Array(nGroups).fill(0)),
    gamma_E: (2 * 1/4.58),
    gamma_R: (1/durR),
    gamma_hosp: (2 * 1/durHosp),
    gamma_get_ox_survive: (2 * 1/6),
    gamma_get_ox_die: (2 * 1/3.5),
    gamma_not_get_ox_survive: (2 * 1/9),
    gamma_not_get_ox_die: (0.5 * 2 * 1/9),
    gamma_get_mv_survive: (2 * 1/5.5),
    gamma_get_mv_die: (2 * 1/4),
    gamma_not_get_mv_survive: (2 * 1/12),
    gamma_not_get_mv_die: (2 * 1/1),
    gamma_rec: (2 * 1/6),
    prob_hosp: createOdinArray(probs.probHosp),
    prob_severe: createOdinArray(probs.probSevere),
    prob_non_severe_death_treatment: createOdinArray(probs.probNonSevereDeathTreatment),
    prob_non_severe_death_no_treatment: createOdinArray(probs.probNonSevereDeathNoTreatment),
    prob_severe_death_treatment: createOdinArray(probs.probSevereDeathTreatment),
    prob_severe_death_no_treatment: createOdinArray(probs.probNonSevereDeathNoTreatment),
    p_dist: createOdinArray(Array(nGroups).fill(1)),
    hosp_bed_capacity: nBeds,
    ICU_bed_capacity: nICUBeds,
    tt_matrix: createOdinArray(ttMatrix),
    tt_beta: createOdinArray(ttBeta),
    beta_set: createOdinArray(betaSet),
    mix_mat_set: createOdinArray(
      transpose3d(
        reshape3d(mixMatSet, [nGroups, nGroups, ttMatrix.length]),
        [3, 1, 2]
      )
    )
  }

  const mod = new model(user);
  const dt = .1;
  let t = [];
  for (let i = 0; i < (timeEnd - timeStart) / dt; ++i) {
    t.push(timeStart + i * dt);
  }

  return mod.run(t);
}
