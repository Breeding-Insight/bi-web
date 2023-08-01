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

export class BrAPIUtils {
    static getBreedingInsightId(references: ExternalReferences|undefined, referenceSourcePath: string = ""): string | undefined {
        if(!references){ return undefined; }
        let val = references.find(ref => ref.referenceSource === process.env.VUE_APP_BI_REFERENCE_SOURCE + referenceSourcePath);
        return val ? val.referenceID : "";
    }
}