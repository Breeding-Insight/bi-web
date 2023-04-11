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

// DateTime format strings based on the BrAPI spec,
// see https://plant-breeding-api.readthedocs.io/en/latest/docs/best_practices/Dates_and_Times.html
// for more information.

// The Java BI API interpretable format for displayed Date values, e.g. 2023-03-31.
export const JAVA_BRAPI_DATE_FORMAT = 'yyyy-MM-dd';
// The moment.js interpretable format for displayed Date values, e.g. 2023-03-31.
export const MOMENT_BRAPI_DATE_FORMAT = 'YYYY-MM-DD';
