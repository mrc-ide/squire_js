![unit tests](https://github.com/mrc-ide/squire_js/workflows/test/badge.svg?branch=master)

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
import { runModel, getPopulation, getMixingMatrix, getBeta } from './squire.js'
```

#### getPopulation

Returns the population for each age group in a country.

The age groups are fixed to the following 17:

0-4, 5-9, 10-14, 15-19, 20-24, 25-29, 30-34, 35-39,
40-44, 45-49, 50-54, 55-59, 60-64, 65-69, 70-74, 75-79, 80+ 

```js
getPopulation('Nigeria');
// Outputs array of length 17
```

#### getMixingMatrix

Returns the matrix representing the mixing between age groups in a country.

```js
getMixingMatrix('Nigeria');
// Outputs a 17 x 17 nested array
```

#### estimateBeta

Estimates the transmissibility parameter (beta) for a country, given R0. If an
array of R0 is given, a corresponding array of beta estimates will be returned.

```js
estimateBeta('Nigeria', 3);
// returns an estimate for beta in Nigeria given an R0 of 3

estimateBeta('Nigeria', [3, 3*.5, 3*.3, 3*.25]);
// returns 4 estimates for beta in Nigeria given 4 different R0s
```

#### runModel

This function is used to run the model and collect the output. It has the
signature:

```js
function runModel(
  population,
  ttMatrix,
  mixMatSet,
  ttBeta,
  betaSet,
  nBeds,
  nICUBeds,
  timeStart = 0,
  timeEnd = 250
)
```

Parameters:

 * population - is an array of populations for each age group
 * ttMatrix - is an array of timesteps at which the mixing matrix will change
 * ttMatSet - is an array of mixing matrices to change to in line with
   `ttMatrix`
 * ttBeta - is an array of timsteps at which the transmissibility will change
 * betaSet - is an array of beta values that will change in line with `ttBeta`
 * nBeds - is the country's capacity for hosiptal beds
 * nICUBeds - is the country's capacity in Intensive Care
 * timeStart - is the timestep to begin the simulation
 * timeEnd - is the timestep to end the simulation

You can get some basic model output by running the following example:

```js
const mm = getMixingMatrix('Nigeria')
const beta = estimateBeta('Nigeria', [3, 3/2, 3])
let results = runModel(
  getPopulation('Nigeria'),
  [0],
  [mm],
  [0, 50, 200],
  beta,
  10000000000,
  10000000000,
  1,
  200
);
```

Results will be an object representing a table of data. It will have the following keys:

Names: The names of the columns of the table. The first name will be t, identifying the time step column. The following names will identify the state and the age group being counted in that column. The age group will be identified in square brackets. E.g. the "S[1]" column represents the count for susceptables in the first age group.

Y: A 2D array representing the rows of the table. The first dimension will depend on the time steps and resolution of the model. The second dimension will be the same size as "Names".
