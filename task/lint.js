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

(async () => {
  let spinner = ora({prefixText: ' ', color: 'yellow'});
  try {
    spinner = spinner.start('linting');
    // Get build success
    let {exitCode, stdout} = await execa('vue-cli-service', ['lint', '--no-fix', '--max-errors=0', '--max-warnings=Infinity']);
    if (exitCode === 0) {
      spinner = spinner.clear()
                       .succeed('linting finished');
      console.log(stdout);
    }

  } catch(err) {
    // Get full message
    let {exitCode, stdout} = await execa('vue-cli-service', ['lint', '--no-fix', '--max-errors=Infinity', '--max-warnings=Infinity']);
    console.log(stdout);
    spinner = spinner.fail('linting found errors');
    process.exit(err.exitCode);
  } finally {
    spinner.stop();
  }

})();
