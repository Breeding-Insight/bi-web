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

import {ObservationDAO} from "@/breeding-insight/dao/ObservationDAO";
import {ObservationUnitDAO} from "@/breeding-insight/dao/ObservationUnitDAO";
import {Observation, Season} from "@/breeding-insight/model/Observation";
import {ObservationUnit, ObservationUnitPosition} from '@/breeding-insight/model/ObservationUnit';
import {BiResponse, Metadata} from "@/breeding-insight/model/BiResponse";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {PaginationUtilities} from "@/breeding-insight/model/view_models/PaginationUtilities";
import {Result, Err, Success, ResultGenerator } from "@/breeding-insight/model/Result";

export class ObservationService {

  static async getByStudy(programId: string, studyId?: string, paginationQuery?: PaginationQuery, full?: boolean): Promise<Result<Error, [Observation[], Metadata]>> {

    if (paginationQuery === undefined){
      paginationQuery = new PaginationQuery(0, 0, true);
    }

    if (full === undefined) {
      full = false;
    }

    try {
      if(!programId) throw new Error('missing or invalid program id');
      if(!studyId) throw new Error('missing or invalid study id');

      let response: Result<Error, BiResponse>;
      response = await ObservationDAO.getAllForStudy(programId, studyId, paginationQuery, full) as Result<Error, BiResponse>;

      const frontendModel = (res: BiResponse): [Observation[], Metadata] => {
        let observations: Observation[] = [];
        let { result: { data },  metadata } = res;

        data = PaginationUtilities.mockSortRecords(data);
                
        observations = data.map((observation: any) => {
          let season: Season | undefined = undefined;
          if (observation.season) {
            season = new Season(observation.season.seasonDbId,
                                observation.season.seasonName,
                                ~~observation.season.year);
          }
          
          // TODO: add call to backend to get level from observationUnit.observationUnitPosition.observationLevel
          return new Observation(observation.observationDbId,
                                 observation.studyDbId,
                                 observation.germplasmDbId,
                                 observation.observationUnitDbId,
                                 observation.observationVariableDbId,
                                 observation.germplasmName,
                                 observation.name,
                                 observation.observationVariableName,
                                 observation.collector,
                                 observation.uploadedBy,
                                 observation.observationTimeStamp,
                                 season,
                                 undefined,
                                 observation.value);
        });

        let newPagination;
        [observations, newPagination] = PaginationUtilities.mockPagination(observations, paginationQuery!.page, paginationQuery!.pageSize, paginationQuery!.showAll);
        metadata.pagination = newPagination;

        return [observations, metadata];
      }

      return response.applyResult(frontendModel);

    } catch(error) {
      return ResultGenerator.err(error);
    }
  }
}
