/*
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const execa = require('execa');
const ora = require('ora');
const ArgumentParser = require('argparse').ArgumentParser;
const parser = new ArgumentParser({
  addHelp: true
});
const pa11y = require('pa11y');
const json = require('pa11y-reporter-json');
const fs = require('fs');
const jsonBeautify = require('json-beautify');

// the format used by npm to pass command line args is
// >$ npm run test:accessibility -- --<option1> --<option2>
// the -h flag will list all options
parser.addArgument(
  ['-d', '--domain'],
  {help: 'the accessibility test target domain (default: localhost)'}
);
parser.addArgument(
  ['-p', '--port'],
  {help: 'the accessibility test target port (default: 8080)'}
);
parser.addArgument(
  ['--protocol'],
  {help: 'the accessibility test target protocol (default: http)'}
);
parser.addArgument(
  ['-o', '--outfile'],
  {help: 'the path to save results to (default: .pa11yResults.json)'}
);
parser.addArgument(
  ['-c', '--config'],
  {help: 'the path to the file of target pages (default: .pa11yTargets.json)'}
);

// default protocol and host used with each path
const args = parser.parseArgs();
const domain = args.domain || 'localhost';
const port = args.port || '8080';
const protocol = args.protocol || 'http';

// default path for loading targets and saving test results
const config = args.config || './task/.pa11yTargets.json';
const out = args.out || './task/log/pa11yResults.json';

(async () => {
  let spinner = ora({prefixText: ' ', color: 'yellow'});
  try {

    // store relative paths of pages to test in .pa11yTargets
    const targets = JSON.parse(fs.readFileSync(`${config}`, 'utf8'));

    // pa11y options used in each test
    const options = {
      log: {
        debug: console.log,
        error: console.error,
        info: console.log
      }

    };

    // Run the test against multiple URLs
    const tests = targets
      .map(path => pa11y(`${protocol}://${domain}:${port}/${path}`, options));
    spinner = spinner.start('accessibility test');

    // collect the results of all tests
    const results = await Promise.all(tests);

    // save the results
    fs.writeFileSync(`${out}`, jsonBeautify(results, null, 2, 80), 'utf8');

    // check for accessibility exceptions
    if (!results[0].issues.find(result => result.typeCode === 1)) {
      spinner = spinner.clear()
        .succeed('accessibility tests done');
    } else {
      spinner = spinner.clear()
        .fail(`accessibility test failed: see ${out} for details`);
    }

  } catch(err) {
    spinner.fail('accessibility testing failed');
    console.log(err.message);
  } finally {
    spinner.stop();
  }

})();
