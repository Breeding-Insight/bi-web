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

import {BiResponse, Response} from "@/breeding-insight/model/BiResponse";
import * as api from "@/util/api";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import { Result, Err, Success, ResultGenerator } from "@/breeding-insight/model/Result";
import {BrAPIDAOUtil} from "@/breeding-insight/dao/BrAPIDAOUtil";

export class StudyDAO {

  static async getAllForTrial(programId: string, trialDbId: string): Promise<Result<Error, BiResponse>> {

    // Use GET endpoint rather than search endpoint, as we only ever have a single trialDbId.
    const { data } = await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/brapi/v2/studies`,
      method: 'get',
      params: { trialDbId: trialDbId, pageSize: 1000000 }
    }) as Response;

    return ResultGenerator.success(new BiResponse(data));
  }

  static async getAll(programId: string, paginationQuery: PaginationQuery, full : boolean): Promise<Result<Error, BiResponse>> {
    try {
      // TODO: update pageSize setting when we can do backend brapi sorting
      const { data } = await api.call({
        url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/brapi/v2/studies`,
        method: 'get',
        params: { full, pageSize: 1000000 }
      }) as Response;

      return ResultGenerator.success(new BiResponse(data));
        
    } catch (error) {
      return ResultGenerator.err(error);
    }  
  }

  static async getById(programId: string, studyId: string): Promise<Result<Error, BiResponse>> {
    try {
      const { data } = await api.call({
        url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/brapi/v2/studies`,
        method: 'get',
        params: { studyDbId: studyId }
      }) as Response;

      return ResultGenerator.success(new BiResponse(data));
        
    } catch (error) {
      return ResultGenerator.err(error);
    }
  }
}
