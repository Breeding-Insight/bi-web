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

import {TrialDAO} from "@/breeding-insight/dao/TrialDAO";
import {Trial} from "@/breeding-insight/model/Trial";
import {BiResponse, Metadata} from "@/breeding-insight/model/BiResponse";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {PaginationUtilities} from "@/breeding-insight/model/view_models/PaginationUtilities";
import {Result, Err, Success, ResultGenerator } from "@/breeding-insight/model/Result";

export class TrialService {

  static async getAll(programId: string, paginationQuery?: PaginationQuery, full?: boolean, metadata?:boolean): Promise<Result<Error, [Trial[], Metadata]>> {

    if (paginationQuery === undefined){
      paginationQuery = new PaginationQuery(0, 0, true);
    }

    if (full === undefined) {
      full = false;
    }

    if (metadata === undefined) {
      metadata = true;
    }

    try {
      if(!programId) throw new Error('missing or invalid program id');
      
      let response = await TrialDAO.getAll(programId, paginationQuery, full, metadata) as Result<Error, BiResponse>;
      if(response.isErr()) throw response.value;

      const frontendModel = (res: BiResponse): [Trial[], Metadata] => {
        let trials: Trial[] = [];
        let { result: { data }, metadata } = res;
        
        data = PaginationUtilities.mockSortRecords(data);
        trials = data.map((trial: any) => {
          return trial as Trial;
        });

        let newPagination;
        [trials, newPagination] = PaginationUtilities.mockPagination(trials, paginationQuery!.page, paginationQuery!.pageSize, paginationQuery!.showAll);
        metadata.pagination = newPagination;

        return [trials, metadata];
      }

      return response.applyResult(frontendModel);
      
    } catch(error) {
      return ResultGenerator.err(error);
    }        

  }

  static async getById(programId?: string, trialId?: string): Promise<Result<Error, Trial>> {
    try {
      if(!programId) throw new Error('missing or invalid program id');
      if(!trialId) throw new Error('missing or invalid trial id');
      
      let response = await TrialDAO.getById(programId, trialId) as Result<Error, BiResponse>;      
      if(response.isErr()) throw response.value;

      const frontendModel = (res: BiResponse): Trial => {
        let trials: Trial[] = [];
        let { result: { data }, metadata } = res;
        
        trials = data.map((trial: any) => {
          return new Trial(trial.trialDbId, trial.trialName, trial.active);
        });

        return trials[0];
      }

      return response.applyResult(frontendModel);
      
    } catch(error) {
      return ResultGenerator.err(error);
    }        

  }
}
