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
import {Result, ResultGenerator} from "@/breeding-insight/model/Result";
import {Germplasm} from "@/breeding-insight/brapi/model/germplasm";

export class ExperimentDAO {

      static async getSingleExperiment(programId: string, experimentId: string): Promise<Result<Error, Germplasm>> {
        experimentId = '26b98605-b7dc-40aa-a8b9-2e3dc6664a7f'
        const config: any = {};
        config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/brapi/v2/trials/${experimentId}`;
        config.method = 'get';
        config.programId = programId;
        config.experimentId = experimentId;
        // TODO set boolean param for stats
        config.params = {};
console.log(config.url);
        try {
            const res = await api.call(config) as Response;
            let { result } = res.data;
            console.log(result);
            return ResultGenerator.success(result);
        } catch (error) {
            return ResultGenerator.err(error);
        }
    }
}
