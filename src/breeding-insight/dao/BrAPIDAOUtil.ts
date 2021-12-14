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

import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {Result, ResultGenerator} from "@/breeding-insight/model/Result";
import {BiResponse, Response} from "@/breeding-insight/model/BiResponse";
import * as api from "@/util/api";

export class BrAPIDAOUtil {

  static SEARCH_WAIT_TIME: number = 1000;
  static RESULTS_PER_QUERY: number = 100000;

  /**
   * Handle BrAPI searches of both saved search and immediate response types
   *
   * @param url
   * @param body
   * @param paginationQuery
   * @param full
   * @param timeoutMs
   */

  static async search(url: string, body: any, full : boolean, timeoutMs: number): Promise<Result<Error, BiResponse>> {
    try {

      body.pageSize = BrAPIDAOUtil.RESULTS_PER_QUERY;

      const { data } = await api.call({
        url: url,
        method: 'post',
        data: body,
        params: { full }
      }) as Response;

      console.log(data);

      if (data.result && data.result.searchResultsDbId) {
        //const searchId = data.result.searchResultsDbId;
        console.log('## searchResultsDbId ##');

        console.log(url + '/' + data.result.searchResultsDbId);

        // setTimeout(() => this.getDataUpload(includeMapping), 1000);

        const res = await api.call({
          url: url + '/' + data.result.searchResultsDbId,
          method: 'get',
        }) as Response;

        console.log(res.data);

        return ResultGenerator.success(new BiResponse(res.data));

      } else {
        return ResultGenerator.success(new BiResponse(data));
      }



    } catch (error) {
      return ResultGenerator.err(error);
    }
  }

}
