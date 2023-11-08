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

import moment from "moment";
import {Germplasm} from "@/breeding-insight/brapi/model/germplasm";
import {MOMENT_BRAPI_DATE_FORMAT} from "@/breeding-insight/utils/BrAPIDateTime";

// The moment.js interpretable format for Date values sent and received via the BI API.
export const MOMENT_DATE_PERSISTED_FORMAT = 'DD/MM/YYYY h:mm:ss';

export class GermplasmUtils {
    static getExternalUID(germplasm: Germplasm): string | undefined {
        let val;
        if (germplasm.externalReferences && germplasm.seedSource) {
            val = germplasm.externalReferences!.filter(ref => ref.referenceSource == germplasm.seedSource!)
                .map(ref => ref.referenceID);
            return val ? val[0]: "";
        }
        return "";
    }

    static getCreatedDate(germplasm: Germplasm): string | undefined {
        if (germplasm.additionalInfo && germplasm.additionalInfo.createdDate) {
            let dateTime = moment(germplasm.additionalInfo!.createdDate!, MOMENT_DATE_PERSISTED_FORMAT);
            return dateTime.format(MOMENT_BRAPI_DATE_FORMAT);
        }
        return "";
    }

    static formatSynonyms(synonyms: any[]): string {
        if (!synonyms) return "";
        return synonyms.map(synonym => synonym.synonym).join("; ");
    }

    static getEntryNumber(germplasm: Germplasm, referenceId: string | undefined): string | undefined {
        if (germplasm.additionalInfo) {
            return referenceId ? germplasm.additionalInfo.listEntryNumbers[<any>referenceId] :
                germplasm.additionalInfo.importEntryNumber;
        }
        return "";
    }
}