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

import {PromiseRejection, PromiseResolution, PromiseResult} from "promise.allsettled";
import {PromiseResultTuple} from "promise.allsettled/types";

export class PromiseHandler {
  promises: Promise<any>[] = [];
  static fulfilled: String = 'fulfilled';

  constructor(promises: Promise<any>[]) {
    this.promises = promises;
  }

  addPromise(promise: Promise<any>) {
    this.promises.push(promise);
  }

  resolvePromises(): Promise<any> {

    return new Promise<any>((resolve, reject) => {
      Promise.allSettled(this.promises).then( (results: PromiseResult<any, any>[]) => {
        const successResults: PromiseResolution<any>[] = results as PromiseResolution<any>[];
        if (successResults.every((result: PromiseResolution<any>) => result.status === 'fulfilled')) {
          resolve(successResults.map((result: PromiseResolution<any>) => result.value));
        } else {
          reject(results);
        }
      })
    });
  }

}