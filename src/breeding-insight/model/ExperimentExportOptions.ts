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

import {FileType} from "@/breeding-insight/model/FileType";
import {ExperimentObservationsDataset} from "@/breeding-insight/model/ExperimentObservationsDataset";
import {EnvironmentOption} from "@/breeding-insight/model/EnvironmentOption";

// Stores the user selected options for Experiment Observation file export.
export class ExperimentExportOptions {

    public fileExtension: string = FileType.xls.id;
    public dataset: string = ExperimentObservationsDataset.observations.id;
    public environments: string[] = [EnvironmentOption.all.id];
    public includeTimestamps: string = 'Yes';

    public timestampsTrueFalseString(): string {
        if (this.includeTimestamps.toLowerCase() === 'yes')
        {
            return 'true';
        }
        return 'false';
    }
}