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

import {ExternalReferences} from "@/breeding-insight/brapi/model/externalReferences";

export class Experiment {
    trialDbId?: string;
    active?: boolean;
    additionalInfo?: any;
    externalReferences?: ExternalReferences;
    programDbId?: string;
    programName?: string;
    trialDescription?: string;
    trialName?: string;

    constructor(trialDbId?: string,
                active?: boolean,
                additionalInfo?: any,
                externalReferences?: ExternalReferences,
                programDbId?: string,
                programName?: string,
                trialDescription?: string,
                trialName?: string
    ) {
        this.trialDbId = trialDbId;
        this.active = active;
        this.additionalInfo = additionalInfo;
        this.externalReferences = externalReferences;
        this.programDbId = programDbId;
        this.trialDescription = trialDescription;
        this.trialName = trialName;
    }


    static assign(experiment: Experiment): Experiment {

        return new Experiment(
            experiment.trialDbId,
            experiment.active,
            experiment.additionalInfo,
            experiment.externalReferences,
            experiment.programDbId,
            experiment.programName,
            experiment.trialDescription,
            experiment.trialName
        );
    }

    equals(experiment?: Experiment): boolean {
        if (!experiment) {
            return false;
        }
        return (this.trialDbId === experiment.trialDbId);
    }
}