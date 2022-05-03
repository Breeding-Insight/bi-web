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

const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || 0
const versionInfo = JSON.parse(packageJson).versionInfo || "https://github.com/Breeding-Insight/bi-web"

process.env.VUE_APP_VERSION = version;
process.env.VUE_APP_VERSION_INFO = versionInfo;
process.env.VUE_APP_BI_API_ROOT = process.env.VUE_APP_BI_API_ROOT || "http://localhost";
process.env.VUE_APP_OPENID_LOGOUT_URL = process.env.VUE_APP_OPENID_LOGOUT_URL || "https://sandbox.orcid.org/userStatus.json?logUserOut=true";
process.env.VUE_APP_BI_API_V1_PATH = process.env.VUE_APP_BI_API_ROOT + "/v1";
process.env.VUE_APP_LOG_LEVEL = process.env.VUE_APP_LOG_LEVEL || 'error';
process.env.VUE_APP_BI_REFERENCE_SOURCE = process.env.VUE_APP_BI_REFERENCE_SOURCE || 'breedinginsight.org';

module.exports = {
  devServer: {
    disableHostCheck: true
  }
};
