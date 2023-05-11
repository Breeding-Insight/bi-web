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

import {GermplasmList} from "@/breeding-insight/model/GermplasmList";
import {BiResponse, Metadata} from "@/breeding-insight/model/BiResponse";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {PaginationUtilities} from "@/breeding-insight/model/view_models/PaginationUtilities";
import {ExperimentDAO} from "@/breeding-insight/dao/ExperimentDAO";
import {Germplasm} from "@/breeding-insight/brapi/model/germplasm";
import {Result, ResultGenerator} from "@/breeding-insight/model/Result";
import {SortOrder} from "@/breeding-insight/model/Sort";
import * as api from "@/util/api";
import {GermplasmFilter} from "@/breeding-insight/model/GermplasmFilter";

export class ExperimentService {

    static async getSingleExperiment(programId: string, experimentId: string): Promise<Result<Error, Germplasm>> {
        try {
              if (!programId) throw new Error('Missing or invalid program id');
              let response: Result<Error, Germplasm> = await ExperimentDAO.getSingleExperiment(programId, experimentId);
              return response;
          } catch(error) {
              return ResultGenerator.err(error);
          }
    }

}
