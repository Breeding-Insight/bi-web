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
import {Result, ResultGenerator} from "@/breeding-insight/model/Result";
import {Trial} from "@/breeding-insight/model/Trial.ts";
import {DatasetModel} from "@/breeding-insight/model/DatasetModel";
import {DatasetMetadata} from "@/breeding-insight/model/DatasetMetadata";
import {Collaborator} from "@/breeding-insight/model/Collaborator";

export class ExperimentDAO {

      static async getSingleExperiment(programId: string, experimentId: string, stats: boolean): Promise<Result<Error, Trial>> {
        const config: any = {};
        config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/brapi/v2/trials/${experimentId}`;
        config.method = 'get';
        config.programId = programId;
        config.experimentId = experimentId;
        config.params = {stats: stats};
        try {
            const res = await api.call(config) as Response;
            let { result } = res.data;
            return ResultGenerator.success(result);
        } catch (error) {
            return ResultGenerator.err(error);
        }
    }

    static async getUnassignedCollaborators(programId: string, experimentId: string): Promise<Result<Error, Collaborator[]>> {
        const config: any = {};
        config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/experiments/${experimentId}/collaborators?active=false`;
        config.method = 'get';
        config.programId = programId;
        config.experimentId = experimentId;
        try {
            const res = await api.call(config) as Response;
            let { result } = res.data;
            return ResultGenerator.success(result);
        } catch (error) {
            return ResultGenerator.err(error);
        }
    }

    static async addCollaborator(programId: string, experimentId: string, userId: string): Promise<Result<Error, Collaborator>> {
        const config: any = {};
        config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/experiments/${experimentId}/collaborators`;
        config.method = 'post';
        config.programId = programId;
        config.experimentId = experimentId;
        config.data = {userId: userId};
        try {
            const res = await api.call(config) as Response;
            let { result } = res.data;
            return ResultGenerator.success(result);
        } catch (error) {
            return ResultGenerator.err(error);
        }
    }

    static async deleteCollaborator(programId: string, experimentId: string, id: string): Promise<Result<Error, boolean>> {
        const config: any = {};
        config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/experiments/${experimentId}/collaborators/${id}`;
        config.method = 'delete';
        config.programId = programId;
        config.experimentId = experimentId;
        try {
            const res = await api.call(config) as Response;
            return ResultGenerator.success(true);
        } catch (error) {
            return ResultGenerator.err(error);
        }
    }

    static async getAssignedCollaborators(programId: string, experimentId: string): Promise<Result<Error, Collaborator[]>> {
        const config: any = {};
        config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/experiments/${experimentId}/collaborators?active=true`;
        config.method = 'get';
        config.programId = programId;
        config.experimentId = experimentId;
        try {
            const res = await api.call(config) as Response;
            let { result } = res.data;
            return ResultGenerator.success(result);
        } catch (error) {
            return ResultGenerator.err(error);
        }
    }

    static async getDatasetMetadata(programId: string, experimentId: string): Promise<Result<Error, DatasetMetadata[]>> {
        const config: any = {};
        config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/experiments/${experimentId}/datasets`;
        config.method = 'get';
        config.programId = programId;
        config.experimentId = experimentId;
        try {
            const res = await api.call(config) as Response;
            let { result } = res.data;
            return ResultGenerator.success(result);
        } catch (error) {
            return ResultGenerator.err(error);
        }
    }

    static async getDatasetById(programId: string, experimentId: string, datasetId: string, stats: boolean): Promise<Result<Error, DatasetModel>> {
        const config: any = {};
        config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/experiments/${experimentId}/dataset/${datasetId}`;
        config.method = 'get';
        config.programId = programId;
        config.experimentId = experimentId;
        config.datasetId = datasetId;
        config.params = {
            stats : stats,
        };
        try {
            const res = await api.call(config) as Response;
            let { result } = res.data;
            return ResultGenerator.success(result);
        } catch (error) {
            return ResultGenerator.err(error);
        }
    }

    static async createSubEntityDataset(programId: string, experimentId: string, name: string, repeatedMeasures: number): Promise<Result<Error, DatasetModel>> {
        const config: any = {};
        config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/experiments/${experimentId}/dataset`;
        config.method = 'post';
        config.programId = programId;
        config.experimentId = experimentId;
        config.data = {name: name, repeatedMeasures: repeatedMeasures}  // Corresponds to SubEntityDatasetRequest in bi-api.
        try {
            const res = await api.call(config) as Response;
            let { result } = res.data;
            return ResultGenerator.success(result);
        } catch (error) {
            return ResultGenerator.err(error);
        }
    }
}
