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

import {Observation, Season} from "@/breeding-insight/model/Observation";
import {BiResponse, Response} from "@/breeding-insight/model/BiResponse";
import * as api from "@/util/api";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import { Result, Err, Success, ResultGenerator } from "@/breeding-insight/model/Result";

export class ObservationUnitDAO {

  static async getOuById(programId: string, ouId: string): Promise<Result<Error, BiResponse>> {
    try {
      const { data } = await api.call({
        url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/brapi/v2/observationunits`,
        method: 'get',
        params: { observationUnitDbId: ouId }
      }) as Response;

      return ResultGenerator.success(new BiResponse(data));
        
    } catch (error) {
      return ResultGenerator.err(error);
    }  
  }
}
