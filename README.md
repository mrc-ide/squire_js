![Tests](https://github.com/mrc-ide/squire_js/workflows/test/badge.svg?branch=master)
[![DOI](https://zenodo.org/badge/255333455.svg)](https://zenodo.org/badge/latestdoi/255333455)

# squire.js

### Requirements

The required system and R packages are listed in the `Dockerfile`

### Building

You can build the javascript bundle by running:

```
npm install
npm run build
# outputs a bundle in build/squire.js
```

### Tests

You can run the end-to-end test with:

```
npm run e2e
```

You can run the interface unit tests with:

```
npm test
```

### Usage

You can access the model using ES6 import syntax:

```js
import { runModel } from './squire.js'
```

#### runModel

This function is used to run the model and collect the output. In the newest release, we now provide an array for the probabilities for death in hospital dependening on treatmnet. It has the signature:

```js
function runModel(
  population,
  contactMatrix,
  ttBeta,
  betaSet,
  nBeds,
  nICUBeds,
  probNonSevereDeathTreatment,
  probSevereDeathTreatment,
  timeStart = 0,
  timeEnd = 250
)
```

Parameters:

 * population - is an array of populations for each age group
 * contactMatrix - is the contact matrix to use for the simulation
 * ttBeta - is an array of timesteps at which the transmissibility will change
 * betaSet - is an array of beta values that will change in line with `ttBeta`
 * nBeds - is the country's capacity for hospital beds
 * nICUBeds - is the country's capacity in Intensive Care
 * probNonSevereDeathTreatment - is the probability of death given you require general hospital bed
 * probSevereDeathTreatment - is the probability of death given you require ICU bed
 * timeStart - is the timestep to begin the simulation
 * timeEnd - is the timestep to end the simulation

You can get some basic model output by running the following example:

```js
import nigeriaData from './data/NGA.json';
const beta = [nigeriaData.beta, nigeriaData.beta/2, nigeriaData.beta];
const probNonSevereDeathTreatment = [nigeriaData.prob_non_severe_death_treatment];
const probSevereDeathTreatment = [nigeriaData.prob_severe_death_treatment];
let results = runModel(
  nigeriaData.population,
  nigeriaData.contactMatrix,
  [0, 50, 200],
  beta,
  10000000000,
  10000000000,
  probNonSevereDeathTreatment,
  probSevereDeathTreatment,
  1,
  200
);
```

Results will be an object representing a table of data. It will have the following keys:

Names: The names of the columns of the table. The first name will be t, identifying the time step column. The following names will identify the state and the age group being counted in that column. The age group will be identified in square brackets. E.g. the "S[1]" column represents the count for susceptables in the first age group.

Y: A 2D array representing the rows of the table. The first dimension will depend on the time steps and resolution of the model. The second dimension will be the same size as "Names".

#### beta and Rt

The model is parameterised with a country specific `beta` value.

To translate Rt values into beta values, you can divide them by the country
specific eigenvalue, e.g:

```js
import nigeriaData from './data/NGA.json';
const r0 = 3;
const rt = [r0, r0/2];
const beta = rt.map(r => { return r / nigeriaData.eigenvalue });
```

You can translate back to Rt by multiplying by the eigenvalue:

```js
import nigeriaData from './data/NGA.json';
const beta = [nigeriaData.beta, nigeriaData.beta/2];
const rt = beta.map(r => { return r * nigeriaData.eigenvalue });
```

#### Reff

We provide function to estimate Reff from model outputs:

```js
function reff(
  output,
  rt,
  beta,
  population,
  mixingMatrix,
  tSubset = null
)
```

Parameters:

 * output - the `y` component of the model output returned from runModel
 * rt - an array containing Rt for the first timesteps of the output
 * beta - an array with corresponding beta values for rt
 * population - an array with population counts for each age group (called
   `population` in the country json files)
 * mixingMatrix - a 2D array representing an age scaled mixing matrix (called `contactMatrixScaledAge` in the country json files)
 * tSubset - an array of timesteps to calculate Reff for

This returns an array of Reff values for the output at the timesteps in `tSubset`.
If `tSubset` is null, it will return Reff values for all the rt and beta values
given.
