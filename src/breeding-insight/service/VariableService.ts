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

import {BiResponse, Metadata} from "@/breeding-insight/model/BiResponse";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {VariableDAO} from "@/breeding-insight/dao/VariableDAO";
import {ObservationVariable} from "@/breeding-insight/brapi/model/observationVariable";

export class VariableService {

  static getByStudyDbId(programId: string, studyDbId : string, paginationQuery: PaginationQuery = new PaginationQuery(0, 0, true)): Promise<[ObservationVariable[], Metadata]> {
    return new Promise<[ObservationVariable[], Metadata]>(((resolve, reject) => {

      let variables: ObservationVariable[] = [];

      if (programId) {
        VariableDAO.getVariablesByStudyId(programId, studyDbId, paginationQuery).then((biResponse: BiResponse) => {
          if (biResponse.result.data) {
            //TODO: Remove when backend default sorting is implemented
            //biResponse.result.data = PaginationController.mockSortRecords(biResponse.result.data);
            variables = biResponse.result.data.map((variable: any) => {
              return variable as ObservationVariable;
            });
          }

          resolve([variables, biResponse.metadata]);
        }).catch((error) => {
          reject(error);
        })
      } else {
        reject();
      }
    }));
  }

}
