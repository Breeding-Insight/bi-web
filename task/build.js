/*
 * See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
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

(async () => {
  let spinner = ora({prefixText: ' ', color: 'yellow'});
  try {
    spinner = spinner.start('checking for node modules vulnerabilities');
    let {exitCode} = await execa('npm', ['audit']);
    if (exitCode === 0) {
      spinner = spinner.clear()
                       .succeed('no known vulnerabilities in node modules');

      // only build if no vulnerabilities found
      spinner.start('building the Vue app');
      let {stdout} = await execa('vue-cli-service', ['build'], {preferLocal: true});
      spinner = spinner.clear()
                       .succeed('Vue app build finished');
      console.log(stdout);
    }

  } catch(err) {

    // check if the npm audit found one or more vulnerabilities
    if(err.exitCode === 1) {
      spinner = spinner.fail(`build aborted because vulnerabilities found in npm modules
     run 'npm audit' for more information`);
    } else {

      // show short message for all other non-audit exceptions
      spinner.fail(err.shortMessage);
    }
  } finally {
    spinner.stop();
  }

})();
