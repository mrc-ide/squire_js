import { approxEqualArray } from './utils.js';
import { flattenNested } from '../src/utils.js';
import json from '@rollup/plugin-json';

const fs = require('fs');
const Browser = require('zombie');
const browser = new Browser();
const rollup = require('rollup');
const tolerance = 1e-4;
const request = require('request');

async function load() {
  let bundle = await rollup.rollup({
    input: './e2e/test_script.js',
    plugins: json()
  });
  bundle = await bundle.generate({ format: 'es' });
  bundle = bundle.output[0].code;
  browser.evaluate(
  `var s=window.document.createElement('script');
      s.type = 'module';
      s.textContent = ${bundle};
      window.document.head.appendChild(s);`
  )
}

async function test() {
  let scenario = 0;
  let failed = false;
  browser.evaluate("let p; let r; let output;");
  for (const country of [ 'LCA', 'NGA', 'IND' ]) {
    for (const bed of [ 100, 100000, 100000000 ]) {
      for (const R0 of [ 4, 3, 2, 1 ]) {

        let beta = JSON.parse(
          fs.readFileSync(`./data/pars_${scenario}.json`)
        ).beta_set;
        
        let prob_non_severe_death_treatment = JSON.parse(
          fs.readFileSync(`./data/pars_${scenario}.json`)
        ).prob_non_severe_death_treatment;

        let prob_severe_death_treatment = JSON.parse(
          fs.readFileSync(`./data/pars_${scenario}.json`)
        ).prob_severe_death_treatment;

        let actual = browser.evaluate(
          `output = runModel(
            ${country}.population,
            ${country}.contactMatrix,
            [0, 50],
            [${beta}],
            ${bed},
            ${bed},
            [${prob_non_severe_death_treatment}],
            [${prob_severe_death_treatment}],
            1,
            366
          )
          `
        )

        const expected = JSON.parse(fs.readFileSync(
          `./data/output_${scenario}.json`,
          'utf8')
        );

        let passed = approxEqualArray(
          flattenNested(actual.y),
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
          const outPath = `data/failure_${scenario}.json`;
          fs.writeFileSync(
            outPath,
            JSON.stringify(actual.y, null, 4)
          );
        } else {
          console.log('passed');
        }


        /*
         * Basic test of Reff
        */
        const reff = browser.evaluate(
          `reff(
            output.y,
            [${4}],
            [${beta[0]}],
            ${country}.population,
            ${country}.contactMatrixScaledAge
          )
          `
        )
        if (!reff[0] == 4) {
          failed = true;
          console.log(`Expected ${reff[0]} == 4 for t = 0`)
        }

        scenario++;
      }
    }
  }
  return failed;
}


async function test_from_online_json() {

  let failed = false;
  for (const country of [ 'GBR' ]) {

        let beta = JSON.parse(
          fs.readFileSync(`./data/${country}_test_fit.json`)
        ).beta_set;

        let tt_beta = JSON.parse(
          fs.readFileSync(`./data/${country}_test_fit.json`)
        ).tt_beta;
        
        let prob_non_severe_death_treatment = JSON.parse(
          fs.readFileSync(`./data/${country}.json`)
        ).prob_non_severe_death_treatment;

        let prob_severe_death_treatment = JSON.parse(
          fs.readFileSync(`./data/${country}.json`)
        ).prob_severe_death_treatment;

        let hosp_beds = JSON.parse(
          fs.readFileSync(`./data/${country}_test_fit.json`)
        ).hosp_beds;

        let ICU_beds = JSON.parse(
          fs.readFileSync(`./data/${country}_test_fit.json`)
        ).ICU_beds;

        let actual = browser.evaluate(
          `runModel(
            ${country}.population,
            ${country}.contactMatrix,
            [${tt_beta}],
            [${beta}],
            ${hosp_beds},
            ${ICU_beds},
            [${prob_non_severe_death_treatment}],
            [${prob_severe_death_treatment}],
            0,
            365
          )
          `
        )

        const expected = JSON.parse(fs.readFileSync(
          `./data/output_${country}_fit.json`,
          'utf8')
        );

        let passed = approxEqualArray(
          flattenNested(actual.y),
          flattenNested(expected),
          tolerance
        );

        console.log(`
        --------------------
        scenario: ${country} fit test
        tolerance: ${tolerance}
        `);
        if (!passed) {
          failed = true;
          console.log('failed. Writing diagnostics');
          // Write to file for diagnostics
          const outPath = `data/failure_fit_test_${country}.json`;
          fs.writeFileSync(
            outPath,
            JSON.stringify(actual.y, null, 4)
          );
        } else {
          console.log('passed');
          // Write to file for diagnostics
          const outPath = `data/success_fit_test_${country}.json`;
                    fs.writeFileSync(
            outPath,
            JSON.stringify(actual.y, null, 4)
          );
        }
      }
  return failed;
}


async function run() {
  await browser.visit(
    `file://${__dirname}/test_site.html`
  );
  await load();
  const failed = await test();
  const failed_online = await test_from_online_json();
  process.exit(failed_online && failed);
}

run()
  .catch(e => {
    console.log(e);
    process.exit(1)
  });
