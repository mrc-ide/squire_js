# squire.js


### Requirements

The required system and R packages are listed in the `Dockerfile`

### Building

You can build the javascript bundle by running:

```
npm install
npm run build
# outputs bundle in build/squire.js
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
import { runModel } from './squire.js'
```

runModel is the only exported function from file. It has the following signature:

```
function runModel(
  population,
  mixingMatrix,
  nBeds, //unused
  nICUBeds, //unused
  timeStart = 1,
  timeEnd = 200
  )
```

The population and mixingMatrix values are provided by the data dump.

You can get some basic model output by running the following example:

```
let results = runModel(
  { data: [ 100000, 1000000 ], dim: [2] },
  { data: [ 5/100000, 2/100000, 2/100000, 5/100000 ], dim: [2, 2] },
  5000,
  1000,
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

