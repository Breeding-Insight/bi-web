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
import {ExternalReferences} from "@/breeding-insight/brapi/model/externalReferences";

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
            let dateTime = moment(germplasm.additionalInfo!.createdDate!, "DD/MM/YYYY h:mm:ss");
            return dateTime.format("YYYY-MM-DD");
        }
        return "";
    }

    static getGermplasmUUID(references: ExternalReferences): string | undefined {
        let val = references.find(ref => ref.referenceSource === process.env.VUE_APP_BI_REFERENCE_SOURCE);
        return val ? val.referenceID : "";
    }

    static formatSynonyms(synonyms: any[]): string {
        if (!synonyms) return "";
        return synonyms.map(synonym => synonym.synonym).join("; ");
    }

}