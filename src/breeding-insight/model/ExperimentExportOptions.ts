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

import {FileTypeOption} from "@/breeding-insight/model/FileTypeOption";
import {ExperimentDatasetOption} from "@/breeding-insight/model/ExperimentDatasetOption";

// Stores the user selected options for Experiment Observation file export.
export class ExperimentExportOptions {

    public fileExtension: string = FileTypeOption.xls.id;
    public dataset: string = ExperimentDatasetOption.observations.id;
    public environments: string[] = [];
    public allEnvironments: boolean = false;
    public includeTimestamps: string = 'No';

    public timestampsTrueFalseString(): string {
        if (this.includeTimestamps.toLowerCase() === 'yes')
        {
            return 'true';
        }
        return 'false';
    }
}