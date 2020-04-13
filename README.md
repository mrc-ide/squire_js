# squire.js

You can access the model using ES6 import syntax:

```
import { runModel } from './squire.js'
```

runModel is the only exported function from file. It has the following signature:

You can get some basic model output by running:

```
let results = runModel();
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
