# squire.js

This package is currently under development and testing. Please do not use in
production.

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

```
import { runModel, getPopulation, getMixingMatrix, getBeta } from './squire.js'
```

#### getPopulation

Returns the population for each age group in a country.

The age groups are fixed to the following 17:

0-4 5-9 10-14 15-19 20-24 25-29 30-34 35-39
40-44 45-49 50-54 55-59 60-64 65-69 70-74 75-79 80+ 

```
getPopulation('Nigeria');
# Outputs array of length 17
```

#### getMixingMatrix

Returns the matrix representing the mixing between age groups in a country.

```
getMixingMatrix('Nigeria');
# Outputs a 17 x 17 nested array
```

#### getBeta

Returns the transmissibility parameter for the country.

```
getBeta('Nigeria');
# returns value for beta
```

#### runModel

This function is used to run the model and collect the output. It has the
signature:

```
function runModel(
  population,
  ttMatrix,
  mixMatSet,
  ttBeta,
  betaSet,
  nBeds,
  nICUBeds,
  timeStart = 1,
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
 * timeStart - is the timestep to end the simulation

You can get some basic model output by running the following example:

```
const mm = getMixingMatrix('Nigeria')
const beta = getBeta('Nigeria')
let results = runModel(
  getPopulation('Nigeria'),
  [0, 50, 100],
  [mm, mm, mm],
  [0, 50, 200],
  [beta, beta/2, beta],
  10000000000,
  10000000000,
  1,
  200
);
```

Results will be an object representing a table of data. It will have the following keys:

Names: The names of the columns of the table. The first name will be t, identifying the time step column. The following names will identify the state and the age group being counted in that column. The states in the model are:

* S = Susceptibles
* E = Exposed (Latent Infection)
* I_Mild = Mild Infections (Not Requiring Hospitalisation)
* I_Case = Infections Requiring Hospitalisation
* I_Hospital = Hospitalised (Requires Hospital Bed)
* I_ICU = ICU (Requires ICU Bed)
* I_Rec = Recovering from ICU Stay (Requires Hospital Bed)
* R = Recovered
* D = Dead

The age group will be identified in square brackets. E.g. the "S[1]" column represents the count for susceptables in the first age group.

Y: A 2D array representing the rows of the table. The first dimension will depend on the time steps and resolution of the model. The second dimension will be the same size as "Names".

The "runModel" function has several parameters that are not yet passed to the model. We will add these incrementally.

