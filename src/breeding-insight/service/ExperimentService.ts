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
import {Trial} from "@/breeding-insight/model/Trial";
import {Result, ResultGenerator} from "@/breeding-insight/model/Result";
import {DatasetModel} from "@/breeding-insight/model/DatasetModel";
import {DatasetMetadata} from "@/breeding-insight/model/DatasetMetadata";
import {SubEntityDatasetNewRequest} from "@/breeding-insight/model/SubEntityDatasetNewRequest";
import {BrAPIUtils} from "@/breeding-insight/utils/BrAPIUtils";
import {Collaborator} from "@/breeding-insight/model/Collaborator";

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

    static async createSubEntityDataset(programId: string, experimentId: string, subEntityRequest: SubEntityDatasetNewRequest): Promise<Result<Error, DatasetModel>> {
        if (!programId) {
            return ResultGenerator.err(new Error('Missing or invalid program id'));
        }
        return await ExperimentDAO.createSubEntityDataset(programId, experimentId, subEntityRequest.name, subEntityRequest.repeatedMeasures);
    }

    static async getDatasetMetadata(programId: string, experimentId: string): Promise<Result<Error, DatasetMetadata[]>> {
        if (!programId) {
            return ResultGenerator.err(new Error('Missing or invalid program id'));
        }
        return await ExperimentDAO.getDatasetMetadata(programId, experimentId);
    }

    static async getDatasetMetadataByTrial(programId: string, trial: Trial): Promise<Result<Error, DatasetMetadata[]>> {
        if (!programId) {
            return ResultGenerator.err(new Error('Missing or invalid program id'));
        }
        if (!trial) {
            return ResultGenerator.err(new Error('Missing or invalid trial'));
        }
        if (!trial.externalReferences) {
            return ResultGenerator.err(new Error('Trial is missing external references'));
        }
        // Try to get the /trials external reference.
        let externalReferenceId = BrAPIUtils.getBreedingInsightId(trial.externalReferences, '/trials');
        // Throw if trial is missing ExternalReferenceId.
        if (!externalReferenceId) {
            return ResultGenerator.err(new Error("Trial is missing external reference."));
        }
        return await ExperimentDAO.getDatasetMetadata(programId, externalReferenceId);
    }
    
    static async getUnassignedCollaboratorsByExperiment(programId: string | undefined, experimentId: string): Promise<Result<Error, Collaborator[]>> {
        if (!programId) {
            return ResultGenerator.err(new Error('Missing or invalid program id'));
        }
        return await ExperimentDAO.getUnassignedCollaborators(programId, experimentId);
    }

    static async getAssignedCollaborators(programId: string | undefined, experimentId: string): Promise<Result<Error, Collaborator[]>> {
        if (!programId) {
            return ResultGenerator.err(new Error('Missing or invalid program id'));
        }
        return await ExperimentDAO.getAssignedCollaborators(programId, experimentId);
    }

    static async addCollaboratorToExperiment(programId: string | undefined, experimentId: string, userId: string): Promise<Result<Error, Collaborator>> {
        if (!programId) {
            return ResultGenerator.err(new Error('Missing or invalid program id'));
        }
        return await ExperimentDAO.addCollaborator(programId, experimentId, userId);
    }

    static async removeCollaboratorFromExperiment(programId: string | undefined, experimentId: string, id: string): Promise<Result<Error, boolean>> {
        if (!programId) {
            return ResultGenerator.err(new Error('Missing or invalid program id'));
        }
        return await ExperimentDAO.deleteCollaborator(programId, experimentId, id);
    }
}
