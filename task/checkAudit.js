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
const parseArgs = require('minimist');


(async () => {

  var argv = parseArgs(process.argv.slice(2), {
      default: {
        'dev-audit-level': 'high',
        'prod-audit-level': 'low'
      }
    }
  );

  let allowableDevLevel = argv['dev-audit-level'];
  let allowableProdLevel = argv['prod-audit-level'];
  let severities = ['low', 'moderate', 'high', 'critical'];
  console.log(`Flagging audit errors with severity higher than ${allowableDevLevel} for dev packages`);
  console.log(`Flagging audit errors with severity higher than ${allowableProdLevel} for prod packages`);

  let spinner = ora({prefixText: ' ', color: 'yellow'});
  try {
    spinner = spinner.start('checking for node modules vulnerabilities');
    let {exitCode} = await execa('npm', ['audit', '--json']);
    if (exitCode === 0) {
      spinner = spinner.clear()
        .succeed('no known vulnerabilities in node modules');
      spinner.stop();
    }

  } catch(err) {
    // check if the npm audit found one or more vulnerabilities
    if(err.exitCode === 1) {

      // Parse errors
      const stdout = err.stdout;
      const errors = JSON.parse(stdout);
      const actions = errors.actions;
      const advisories = errors.advisories;
      console.log(stdout);

      for (const action of actions){
        const resolves = action.resolves;
        for (const resolve of resolves){
          if (resolve.dev){
            // Dev dependency
            const error = advisories[resolve.id];
            if (severities.indexOf(error.severity) < 0 ||
              severities.indexOf(error.severity) > severities.indexOf(allowableDevLevel) ){
              console.log("Dependencies exceed allowable error level");
              spinner.fail("Dependencies exceed allowable error level");
              process.exit(1);
            }
          } else {
            // Production dependency
            const error = advisories[resolve.id];
            if (severities.indexOf(error.severity) < 0 ||
              severities.indexOf(error.severity) > severities.indexOf(allowableProdLevel) ){
              console.log("Dependencies exceed allowable error level");
              spinner.fail("Dependencies exceed allowable error level");
              process.exit(1);
            }
          }
        }
      }

      spinner = spinner.clear()
        .succeed('No vulnerabilities with exploitabilities levels higher than thresholds.');
      spinner.stop();
      process.exit(0);
    } else {
      // show short message for all other non-audit exceptions
      spinner.fail(err.shortMessage);
    }
  } finally {
    spinner.stop();
  }

})();
