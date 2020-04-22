import {
  approxEqualArray,
  getColumn
} from './utils.js'

import { flattenNested } from '../src/utils.js'

const fs = require('fs')
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const rollup = require('rollup');
const chromedriver = require('chromedriver');
const tolerance = 1e-1;

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

let options = new chrome.Options();
options.addArguments("--disable-dev-shm-usage");
options.addArguments("--disable-gpu");
options.addArguments("--disable-extensions");
options.addArguments("--no-sandbox");
options.addArguments("--headless");

let driver = new webdriver.Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

async function test() {
  let bundle = await rollup.rollup({ input: './e2e/test_script.js' });
  bundle = await bundle.generate({ format: 'es' });
  bundle = bundle.output[0].code;
  await driver.executeScript(
  `var s=window.document.createElement('script');
      s.type = 'module';
      s.textContent = ${bundle};
      window.document.head.appendChild(s);`
  )

  let scenario = 0;
  let failed = false;
  for (const country of [ 'St. Lucia', 'Nigeria', 'India' ]) {
    for (const bed of [ 100, 100000, 100000000 ]) {
      for (const R0 of [ 4, 3, 2, 1 ]) {
        let results = await driver.executeScript(
          `const mm = getMixingMatrix('${country}');
          const beta = estimateBeta('${country}', [${R0}, ${R0/2}]);
          return runModel(
            getPopulation('${country}'),
            [0],
            [mm],
            [0, 50],
            beta,
            ${bed},
            ${bed},
            0,
            365
          );`
        )

        const expected = JSON.parse(fs.readFileSync(
          `./data/output_${scenario}.json`,
          'utf8')
        );

        let passed = approxEqualArray(
          flattenNested(results.y),
          flattenNested(expected),
          tolerance
        );

        console.log(`
        --------------------
        scenario: ${scenario}
        country: ${country}
        capacity: ${bed}
        r0: ${R0}
        tolerance: ${tolerance}
        `);
        if (!passed) {
          failed = true;
          console.log('failed. Writing diagnostics');
          // Write to file for diagnostics
          const outPath = `./failure_${scenario}.json`
          fs.writeFileSync(
            outPath,
            JSON.stringify(results.y, null, 4)
          );
        } else {
          console.log('passed');
        }
        scenario++;
      }
    }
  }
  return failed;
}

test()
  .then(failed => { process.exit(failed) })
  .catch(e => {
    console.log(e);
    process.exit(1)
  });
