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

import {ExperimentDAO} from "@/breeding-insight/dao/ExperimentDAO";
import {Trial} from "@/breeding-insight/model/Trial.ts";
import {Result, ResultGenerator} from "@/breeding-insight/model/Result";
import {DatasetModel} from "@/breeding-insight/model/DatasetModel";

export class ExperimentService {

    static async getSingleExperiment(programId: string, experimentId: string, stats: boolean): Promise<Result<Error, Trial>> {
        if (!programId) {
            return ResultGenerator.err(new Error('Missing or invalid program id'));
        }
        return await ExperimentDAO.getSingleExperiment(programId, experimentId, stats);
    }

    static async getDatasetModel(programId: string, experimentId: string, datasetId: string): Promise<Result<Error, DatasetModel>> {
        if (!programId) {
            return ResultGenerator.err(new Error('Missing or invalid program id'));
        }
        return await ExperimentDAO.getDatasetById(programId,experimentId, datasetId, true);
    }

}
