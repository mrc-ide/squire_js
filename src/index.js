
import { createOdinArray } from './utils.js'

export const runModel = function(
  population,
  mixingMatrix,
  nBeds, //unused
  nICUBeds, //unused
  timeStart = 1,
  timeEnd = 200
  ) {

  const model = Object.values(odin)[0];
  const nGroups = population.data.length;
  const user = {
    S0: population,
    E0: createOdinArray(Array(nGroups).fill(0)),
    I_mild0: createOdinArray(Array(nGroups).fill(100)),
    I_hosp0: createOdinArray(Array(nGroups).fill(100)),
    I_ICU0: createOdinArray(Array(nGroups).fill(100)),
    R0: createOdinArray(Array(nGroups).fill(0)),
    D0: createOdinArray(Array(nGroups).fill(0)),
    gamma: 0.3,
    sigma: 0.3,
    mu: 0.01,
    p_mild: createOdinArray(Array(nGroups).fill(0.33)),
    p_hosp: createOdinArray(Array(nGroups).fill(0.33)),
    p_ICU: createOdinArray(Array(nGroups).fill(0.34)),
    beta_1: 0.1,
    beta_2: 0.1,
    m: mixingMatrix
  }

  const mod = new model(user);
  const dt = .1;
  let t = [];
  for (let i = 0; i < (timeEnd - timeStart) / dt; ++i) {
    t.push(timeStart + i * dt);
  }

  return mod.run(t);
}
