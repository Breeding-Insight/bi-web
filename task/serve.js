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
const fs = require('fs');

// read from package.json which port to use for the dev server
const port = process.env.PORT || JSON.parse(fs.readFileSync('package.json', 'utf8')).config.devport;

(async () => {
  let spinner = ora({prefixText: ' ', color: 'yellow'});
  try {
    spinner = spinner.start('sort package.json');
    await execa('npx', ['sort-package-json'], {preferLocal: true});
    spinner = spinner.clear()
                     .succeed('package.json sorted');

    console.log(`App running at http://localhost:${port}`);
    await execa.command(`vue-cli-service\ serve --port ${port}`);

  } catch(err) {
    spinner.fail(err.shortMessage);
  } finally {
    spinner.stop();
  }

})();
