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
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";

export class TrialService {

  static async getAll(programId: string, paginationQuery?: PaginationQuery, full?: boolean): Promise<[Trial[], Metadata]> {

    if (paginationQuery === undefined){
      paginationQuery = new PaginationQuery(0, 0, true);
    }

    if (full === undefined) {
      full = false;
    }

    if (programId) {
      try {    
        const { result: { data }, metadata } = await TrialDAO.getAll(programId, paginationQuery, full);
        const trials: Trial[] = [];
          
        if (data) {
          data = PaginationController.mockSortRecords(data);

            trials = data.map((trial: any) => {
            return trial as Trial;
          });
        }

        let newPagination;
        [traits, newPagination] = PaginationController.mockPagination(trials, paginationQuery!.page, paginationQuery!.pagesize, paginationQuery!.showAll);  
        metadata.pagination = newPagination;

        return [trials, metadata];
          
      } catch(err) {

        else throw 'Unable to get trials';

      }        
    }      
  }
}
