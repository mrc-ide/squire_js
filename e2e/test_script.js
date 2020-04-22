import {
  getPopulation,
  getMixingMatrix,
  estimateBeta,
  runModel
} from '../build/squire.js'

window.getPopulation = getPopulation;
window.getMixingMatrix = getMixingMatrix;
window.estimateBeta = estimateBeta;
window.runModel = runModel;
