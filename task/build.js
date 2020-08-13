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

// Parse command line arguments
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

(async () => {
  spinner = spinner.start('checking for node modules vulnerabilities');

  try {
    let {exitCode} = await execa('npm', ['audit', '--json']);
  } catch (error) {
    parseAuditErrors(error);
  }
  spinner.clear()
    .succeed('dependencies passed inspection');

  try {
    // Try building the vue code
    spinner.start('building the Vue app');
    let {stdout} = await execa('vue-cli-service', ['build'], {preferLocal: true});
    spinner = spinner.clear()
      .succeed('Vue app build finished');
  } catch (error) {
    console.log(error.stdout);
    spinner.fail(`error building vue-cli-service`);
    process.exit(1);
  }


})();

function parseAuditErrors(err) {

  const stdout = err.stdout;
  const errors = JSON.parse(stdout);
  const actions = errors.actions;
  const advisories = errors.advisories;
  console.log(stdout);

  for (const action of actions){
    const resolves = action.resolves;
    for (const resolve of resolves){
      const error = advisories[resolve.id];

      if (resolve.dev){
        // Dev dependency

        if (severities.indexOf(error.severity) < 0 ||
          severities.indexOf(error.severity) > severities.indexOf(allowableDevLevel) ){
          console.log("Dependencies exceed allowable error level");
          spinner = spinner.fail(`build aborted because vulnerabilities found in npm modules
     run 'npm audit' for more information`);
          process.exit(1);
        }
      } else {
        // Production dependency
        if (severities.indexOf(error.severity) < 0 ||
          severities.indexOf(error.severity) > severities.indexOf(allowableProdLevel) ){
          console.log("Dependencies exceed allowable error level");
          spinner = spinner.fail(`build aborted because vulnerabilities found in npm modules
     run 'npm audit' for more information`);
          process.exit(1);
        }
      }
    }
  }
}
