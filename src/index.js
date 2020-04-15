
import { transpose312, reshape3d } from './utils.js'
import population from '../data/population.json'
import matrices from '../data/matrices.json'
import beta from '../data/betas.json'
import pars from '../data/pars.json'

export const getCountries = () => Object.keys(population);
export const getPopulation = (country) => { return population[country] };
export const getMixingMatrix = (country) => { return matrices[country] };
export const getBeta = (country) => { return beta[country] };

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

  const model = Object.values(odin)[0];
  const nGroups = population.length;

  const user = {
    ...pars,
    //S_0: population,
    //tt_matrix: ttMatrix,
    //mix_mat_set: transpose312(
      //reshape3d(mixMatSet, [nGroups, nGroups, ttMatrix.length])
    //),
    //tt_beta: ttBeta,
    //beta_set: betaSet
  };

  const mod = new model(user);
  const dt = 1;
  let t = [];
  for (let i = 0; i < (timeEnd - timeStart) / dt; ++i) {
    t.push(timeStart + i * dt);
  }

  return mod.run(t);
}
