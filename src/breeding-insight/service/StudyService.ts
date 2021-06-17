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

import {StudyDAO} from "@/breeding-insight/dao/StudyDAO";
import {Study} from "@/breeding-insight/model/Study";
import {BiResponse, Metadata} from "@/breeding-insight/model/BiResponse";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import {Result, Err, Success, ResultGenerator } from "@/breeding-insight/model/Result";

export class StudyService {
  
  static async getAll(programId: string, trialId?: string, paginationQuery?: PaginationQuery, full?: boolean): Promise<Result<Error, [Study[], Metadata]>> {

    if (paginationQuery === undefined){
      paginationQuery = new PaginationQuery(0, 0, true);
    }

    if (full === undefined) {
      full = false;
    }

    try {
      if(!programId) throw new Error('missing or invalid program id');
      
      let response: Result<Error, BiResponse>;
      if (trialId) {
        response = await StudyDAO.getAllForTrial(programId, trialId, paginationQuery, full) as Result<Error, BiResponse>;
      } else {
        response = await StudyDAO.getAll(programId, paginationQuery, full) as Result<Error, BiResponse>;
      }
      
      if(response.isErr()) throw response.value;
      
      const frontendModel = (res: BiResponse): [Study[], Metadata] => {
        let studies: Study[] = [];
        let { result: { data },  metadata } = res;
        
        data = PaginationController.mockSortRecords(data);
        studies = data.map((study: any) => {
          return new Study(study.studyDbId, study.studyName, study.studyDescription, study.studyType, study.startDate, study.endDate, study.locationName, study.active);
        });

        let newPagination;
        [studies, newPagination] = PaginationController.mockPagination(studies, paginationQuery!.page, paginationQuery!.pageSize, paginationQuery!.showAll);
        metadata.pagination = newPagination;

        return [studies, metadata];
      }

      return response.applyResult(frontendModel);
      
    } catch(error) {
      return ResultGenerator.err(error);
    }
  }
}
