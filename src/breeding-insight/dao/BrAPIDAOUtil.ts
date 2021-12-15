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

import {Result, ResultGenerator} from "@/breeding-insight/model/Result";
import {BiResponse, Response} from "@/breeding-insight/model/BiResponse";
import * as api from "@/util/api";

export class BrAPIDAOUtil {

  static SEARCH_WAIT_TIME: number = 1000;
  static RESULTS_PER_QUERY: number = 100000;
  static SEARCH_TIMEOUT: number = 10000;

  /**
   * Handle BrAPI searches of both saved search and immediate response types
   */
  static async search(url: string, body: any, full : boolean): Promise<Result<Error, BiResponse>> {
    try {

      body.pageSize = BrAPIDAOUtil.RESULTS_PER_QUERY;

      const { data } = await api.call({
        url: url,
        method: 'post',
        data: body,
        params: { full }
      }) as Response;

      if (data.result && data.result.searchResultsDbId) {
        // saved search response handling
        let searchFinished = false;
        let result: Response = { data: undefined };
        let accruedWait = 0;

        while (!searchFinished) {

          const res = await api.call({
            url: url + '/' + data.result.searchResultsDbId,
            method: 'get',
          }) as Response;

          // got results back
          if (res.data.result && !res.data.result.searchResultsDbId) {
            searchFinished = true;
            result = res;
          } else {
            await BrAPIDAOUtil.delay(BrAPIDAOUtil.SEARCH_WAIT_TIME);
            accruedWait += BrAPIDAOUtil.SEARCH_WAIT_TIME;
            if (accruedWait >= BrAPIDAOUtil.SEARCH_TIMEOUT) {
              return ResultGenerator.err(new Error('search timeout'));
            }
          }
        }

        return ResultGenerator.success(new BiResponse(result.data));

      } else {
        // immediate response handling
        return ResultGenerator.success(new BiResponse(data));
      }

    } catch (error) {
      return ResultGenerator.err(error);
    }
  }

  static delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
