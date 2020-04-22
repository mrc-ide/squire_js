import {
  approxEqualArray,
  getColumn
} from './utils.js'

import { flattenNested } from '../src/utils.js'

import expected from "../data/output.json"

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const rollup = require('rollup');
const chromedriver = require('chromedriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

let options = new chrome.Options();
options.addArguments("--disable-dev-shm-usage");
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

  let results = await driver.executeScript(
  `var s=window.document.createElement('script');
      s.type = 'module';
      s.textContent = ${bundle};
      window.document.head.appendChild(s);`)
  .then(() => {
    return driver.executeScript(
      `const mm = getMixingMatrix('Nigeria');
      const beta = getBeta('Nigeria');
      return runModel(
        getPopulation('Nigeria'),
        [0, 50, 100],
        [mm, mm, mm],
        [0, 50, 200],
        [beta, beta/2, beta],
        10000000000,
        10000000000,
        0,
        250
      );`
    )
  })
  const passed = approxEqualArray(
    flattenNested(results.y),
    flattenNested(expected),
    1e-6
  );

  if (passed) {
    console.log('passed');
    process.exit();
  }

  // Write to file for diagnostics
  const out_path = './failure.json'
  require('fs').writeFileSync(out_path, JSON.stringify(results.y, null, 4));

  console.log('failed, output written to ', out_path);
  process.exit(1);
}

test();
